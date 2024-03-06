const { adminVerify } = require( "../../middlewares" );
const { uploadImage } = require( "../../middlewares/uploads" );

module.exports = app =>
{
    const timingBannerController = require( "../../controllers/admin/timingBanners.controller" );

    const timingBannerRouter = require( "express" ).Router();

    timingBannerRouter.post( "/", uploadImage( "assets/uploads/timingBanner", "image" ), timingBannerController.create );

    timingBannerRouter.get( "/", timingBannerController.findAll );

    timingBannerRouter.get( "/:id", timingBannerController.findOne );

    timingBannerRouter.put( "/:id", uploadImage( "assets/uploads/timingBanner", "image" ), timingBannerController.update );

    timingBannerRouter.delete( "/:id", timingBannerController.deleteById );

    app.use( '/api/admin/timing-banner', [ adminVerify.verifyAccessToken ], timingBannerRouter );
};