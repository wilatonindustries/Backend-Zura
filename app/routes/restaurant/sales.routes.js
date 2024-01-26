const { authVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const restaurantSalesController = require( "../../controllers/restaurant/sales.controller" );

    const restaurantSalesRouter = require( "express" ).Router();

    restaurantSalesRouter.post( "/total", restaurantSalesController.totalSalesWithFilter );

    app.use( '/api/user/restaurant/sales', [ authVerify.verifyAccessToken ], restaurantSalesRouter )
};