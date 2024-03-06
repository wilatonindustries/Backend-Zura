const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const aboutAppController = require( "../../controllers/admin/staticComponents.controller" );

    const aboutAppRouter = require( "express" ).Router();

    aboutAppRouter.get( "/", aboutAppController.getStaticComponents );

    aboutAppRouter.put( "/:id", aboutAppController.updateComponents );

    app.use( '/api/admin/about-app', [ adminVerify.verifyAccessToken ], aboutAppRouter );
};