const fs = require( 'fs' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const { restaurantDocsImagePath } = require( "../../config/config_constant" );
const db = require( "../../models" );

exports.addDocument = async ( req, res ) =>
{
    try
    {
        const { type, restaurant_id } = req.body;
        const documentField = getDocumentField( type );

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id, is_delete: false } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 404, 'restaurant not found.' );
        }

        const document = await db.restaurant_documents.findOne( {
            where: {
                user_id: restaurant.user_id, restaurant_id: restaurant.id, is_delete: false
            }
        } );
        if ( document[ type ] === null )
        {
            await updateDocumentField(
                documentField,
                req.file,
                restaurant.id,
                restaurant.user_id
            );
            const updatedDoc = await db.restaurant_documents.findOne( {
                where: {
                    restaurant_id: restaurant.id, is_delete: false
                },
            } );

            const data = {
                image: updatedDoc[ type ] ? `assets/${ updatedDoc[ type ] }` : null,
            };
            return getResult( res, 200, data, `${ type } added or updated successfully.` );
        } else
        {
            if ( req.file )
            {
                try
                {
                    fs.rmSync( `assets/${ document[ type ] }`, {
                        force: true,
                    } );
                    console.log( `Deleted previous ${ type } image` );
                } catch ( err )
                {
                    console.error( `Error deleting previous ${ type } image file :`, err );
                }
            }
            await updateDocumentField(
                documentField,
                req.file,
                restaurant.id,
                restaurant.user_id
            );
            const updatedDoc = await db.restaurant_documents.findOne( {
                where: {
                    restaurant_id: restaurant.id, is_delete: false
                },
            } );

            const data = {
                image: updatedDoc[ type ] ? `assets/${ updatedDoc[ type ] }` : null,
            };
            return getResult( res, 200, data, `${ type } added or updated successfully.` );
        }
    } catch ( error )
    {
        console.error( `error in add document : `, error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

function getDocumentField ( type )
{
    const typeToField = {
        license_copy: "license_copy",
        pan_card_copy: "pan_card_copy",
        shop_act: "shop_act",
    };

    return typeToField[ type ] || null;
}

async function updateDocumentField ( field, file, restaurantId, userId )
{
    const updateObject = {};
    updateObject[ field ] = file
        ? `${ restaurantDocsImagePath }/${ file.filename }`
        : null;

    await db.restaurant_documents.update( updateObject, {
        where: { restaurant_id: restaurantId, user_id: userId, is_delete: false },
    } );
}
