const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const timeBannerController = require( "../../controllers/customer/timingBanner.controller" );

    const timeBannerRouter = require( "express" ).Router();

    timeBannerRouter.get( "/", timeBannerController.getTimingBanners );

    app.use( '/api/customer/timing-banner', [ customerVerify.verifyAccessToken ], timeBannerRouter );
};