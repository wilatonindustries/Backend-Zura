const { adminVerify } = require( "../../middlewares" );
const { uploadImage } = require( "../../middlewares/uploads" );

module.exports = app =>
{
    const restaurantDocumentController = require( "../../controllers/admin/restaurantDocuments.controller" );

    const restaurantDocumentRouter = require( "express" ).Router();

    restaurantDocumentRouter.post( "/add-document", uploadImage( "assets/uploads/restaurant/documents", "image" ), restaurantDocumentController.addDocument );

    app.use( '/api/admin/restaurant', [ adminVerify.verifyAccessToken ], restaurantDocumentRouter )
};
