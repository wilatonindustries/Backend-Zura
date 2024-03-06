const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getSocialMedias = async ( req, res ) =>
{
    try
    {
        const socialMedia = await db.social_medias.findAll( {} );

        return getResult( res, 200, socialMedia ? socialMedia : [], "social media's details fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch social media's details : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
