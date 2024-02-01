const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const dashboardController = require( "../../controllers/admin/dashboard.controller" );

    const dashboardRouter = require( "express" ).Router();

    dashboardRouter.get( "/store-list", dashboardController.restaurantList );

    dashboardRouter.put( "/discount/changes", dashboardController.updateDiscount );

    app.use( '/api/admin/dashboard', [ adminVerify.verifyAccessToken ], dashboardRouter );
};