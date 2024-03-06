const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const configurationController = require( "../../controllers/admin/configurations.controller" );

    const configurationRouter = require( "express" ).Router();

    configurationRouter.get( '/', configurationController.getConfigurations );

    configurationRouter.put( '/', configurationController.updateConfigurations );

    app.use( '/api/admin/configuration', [ adminVerify.verifyAccessToken ], configurationRouter );
};
