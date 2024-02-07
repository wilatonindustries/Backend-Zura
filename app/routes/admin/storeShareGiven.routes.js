const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const storeShareController = require( "../../controllers/admin/storeShareGiven.controller" );

    const storeShareRouter = require( "express" ).Router();

    storeShareRouter.post( "/share-given", storeShareController.totalStoreShareGiven );

    storeShareRouter.post( "/share-to-be-given", storeShareController.totalStoreShareToBeGiven );

    app.use( '/api/admin/store', [ adminVerify.verifyAccessToken ], storeShareRouter );
};