const { adminVerify } = require( "../../middlewares" );
const { uploadImage } = require( "../../middlewares/uploads" );

module.exports = app =>
{
    const restaurantProfilePhotosController = require( "../../controllers/admin/restaurantProfilePhotos.controller" );

    const restaurantProfilePhotosRouter = require( "express" ).Router();

    restaurantProfilePhotosRouter.post( "/add-profile-photo",
        uploadImage( "assets/uploads/restaurant/profilePhotos", "image" ),
        restaurantProfilePhotosController.addProfilePhoto
    );

    app.use( '/api/admin/restaurant', [ adminVerify.verifyAccessToken ], restaurantProfilePhotosRouter )
};
