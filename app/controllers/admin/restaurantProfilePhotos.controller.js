const fs = require( 'fs' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const { restaurantProfileImagePath } = require( "../../config/config_constant" );
const db = require( "../../models" );

exports.addProfilePhoto = async ( req, res ) =>
{
    try
    {
        const { type, restaurant_id } = req.body;
        const profileField = getProfileField( type );

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id, is_delete: false } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 404, 'restaurant not found' );
        }

        const profile = await db.restaurant_profile_photos.findOne( {
            where: {
                user_id: restaurant.user_id, restaurant_id: restaurant.id, is_delete: false
            }
        } );

        if ( profile[ type ] === null )
        {
            await updateProfileField(
                profileField,
                req.file,
                restaurant.id,
                restaurant.user_id
            );
            const updatedProfile = await db.restaurant_profile_photos.findOne( {
                where: {
                    restaurant_id: restaurant.id, is_delete: false
                },
            } );

            const data = {
                image: updatedProfile[ type ] ? `assets/${ updatedProfile[ type ] }` : null,
            };
            return getResult( res, 200, data, `${ type } added or updated successfully.` );
        } else
        {
            if ( req.file )
            {
                try
                {
                    fs.rmSync( `assets/${ profile[ type ] }`, {
                        force: true,
                    } );
                    console.log( `Deleted previous ${ type } image` );
                } catch ( err )
                {
                    console.error( `Error deleting previous ${ type } image file :`, err );
                }
            }
            await updateProfileField(
                profileField,
                req.file,
                restaurant.id,
                restaurant.user_id
            );

            const updatedProfile = await db.restaurant_profile_photos.findOne( {
                where: {
                    restaurant_id: restaurant.id, is_delete: false
                },
            } );

            const data = {
                image: updatedProfile[ type ] ? `assets/${ updatedProfile[ type ] }` : null,
            };
            return getResult( res, 200, data, `${ type } added or updated successfully.` );
        }
    } catch ( error )
    {
        console.error( "error in add profile photo : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

function getProfileField ( type )
{
    const typeToField = {
        ambience_photo_1: "ambience_photo_1",
        ambience_photo_2: "ambience_photo_2",
        ambience_photo_3: "ambience_photo_3",
        ambience_photo_4: "ambience_photo_4",
        offering_photo_1: "offering_photo_1",
        offering_photo_2: "offering_photo_2",
        offering_photo_3: "offering_photo_3",
        offering_photo_4: "offering_photo_4",
        set_profile_background_photo: "set_profile_background_photo",
        set_store_thumbnail_photo: "set_store_thumbnail_photo",
        set_store_profile_photo: "set_store_profile_photo"
    };

    return typeToField[ type ] || null;
}

async function updateProfileField ( field, file, restaurantId, userId )
{
    const updateObject = {};
    updateObject[ field ] = file
        ? `${ restaurantProfileImagePath }/${ file.filename }`
        : null;

    await db.restaurant_profile_photos.update( updateObject, {
        where: { restaurant_id: restaurantId, user_id: userId, is_delete: false },
    } );
}

