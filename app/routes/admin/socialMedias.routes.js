const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const socilMediaController = require( "../../controllers/admin/socialMedias.controller" );

    const socilMediaRouter = require( "express" ).Router();

    socilMediaRouter.get( "/", socilMediaController.getSocialMedias );

    socilMediaRouter.put( "/:id", socilMediaController.updateSocialMedias );

    app.use( '/api/admin/social-media', [ adminVerify.verifyAccessToken ], socilMediaRouter );
};