const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const aboutAppController = require( "../../controllers/customer/staticComponents.controller" );

    const aboutAppRouter = require( "express" ).Router();

    aboutAppRouter.get( "/", aboutAppController.getStaticComponents );

    app.use( '/api/customer/about-app', [ customerVerify.verifyAccessToken ], aboutAppRouter );
};