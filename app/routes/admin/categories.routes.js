const { adminVerify } = require( "../../middlewares" );
const { uploadImage } = require( "../../middlewares/uploads" );

module.exports = app =>
{
    const categoryController = require( "../../controllers/admin/categories.controller" );

    const categoryRouter = require( "express" ).Router();

    categoryRouter.post( "/", uploadImage( "assets/uploads/category", "image" ), categoryController.create );

    categoryRouter.get( "/", categoryController.findAll );

    categoryRouter.get( "/:id", categoryController.findOne );

    categoryRouter.put( "/:id", uploadImage( "assets/uploads/category", "image" ), categoryController.update );

    categoryRouter.delete( "/:id", categoryController.deleteById );

    app.use( '/api/admin/category', [ adminVerify.verifyAccessToken ], categoryRouter )
};