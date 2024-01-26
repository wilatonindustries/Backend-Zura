const fs = require( 'fs' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const { restaurantDocsImagePath } = require( "../../config/config_constant" );
const db = require( "../../models" );

exports.addDocument = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const type = req.body.type;
        const documentField = getDocumentField( type );

        const restaurant = await db.restaurants.findOne( { where: { user_id: userId } } )

        const document = await db.restaurant_documents.findOne( {
            where: {
                user_id: userId, restaurant_id: restaurant.id
            }
        } )
        if ( document[ type ] === null )
        {
            await updateDocumentField(
                documentField,
                req.file,
                restaurant.id,
                userId
            );
            return getResult( res, 200, 1, `${ type } added or updated successfully.` )
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
                userId
            );
            return getResult( res, 200, 1, `${ type } added or updated successfully.` )
        }
    } catch ( error )
    {
        console.log( `error in add ${ type } : `, error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

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
        where: { restaurant_id: restaurantId, user_id: userId },
    } );
}
