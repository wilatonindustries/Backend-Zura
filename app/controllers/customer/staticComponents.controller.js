const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getStaticComponents = async ( req, res ) =>
{
    try
    {
        const aboutApp = await db.static_components.findAll( {} );

        return getResult( res, 200, aboutApp ? aboutApp : [], "About app details fetched successfully" );
    } catch ( error )
    {
        console.error( "error in fetch about app details : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};
