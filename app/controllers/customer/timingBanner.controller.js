const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getTimingBanners = async ( req, res ) =>
{
    try
    {
        const timingBanner = await db.timing_banners.findAll();

        return getResult( res, 200, timingBanner ? timingBanner : [], "timing banners fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch timing banners : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
