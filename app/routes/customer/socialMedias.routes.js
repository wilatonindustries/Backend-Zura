const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const socilMediaController = require( "../../controllers/customer/socialMedias.controller" );

    const socilMediaRouter = require( "express" ).Router();

    socilMediaRouter.get( "/", socilMediaController.getSocialMedias );

    app.use( '/api/customer/social-media', [ customerVerify.verifyAccessToken ], socilMediaRouter );
};