const { adminVerify } = require( "../../middlewares" );
const { uploadImage } = require( "../../middlewares/uploads" );

module.exports = app =>
{
    const bannerController = require( "../../controllers/admin/banners.controller" );

    const bannerRouter = require( "express" ).Router();

    bannerRouter.post( "/", uploadImage( "assets/uploads/banner", "image" ), bannerController.create );

    bannerRouter.get( "/", bannerController.findAll );

    bannerRouter.get( "/:id", bannerController.findOne );

    bannerRouter.put( "/:id", uploadImage( "assets/uploads/banner", "image" ), bannerController.update );

    bannerRouter.delete( "/:id", bannerController.deleteById );

    app.use( '/api/admin/banner', [ adminVerify.verifyAccessToken ], bannerRouter )
};