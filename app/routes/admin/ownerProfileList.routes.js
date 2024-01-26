const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const ownerController = require( "../../controllers/admin/ownerProfileList.controller" );

    const ownerRouter = require( "express" ).Router();

    ownerRouter.post( "/profile-list", ownerController.getOwnerProfileListWithFilter );

    ownerRouter.get( "/request-list", ownerController.getOwnerRequestList );

    ownerRouter.put( "/request/:id", ownerController.ownerRequest );

    app.use( '/api/admin/owner', [ adminVerify.verifyAccessToken ], ownerRouter )
};
