const { authVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const restaurantEarningController = require( "../../controllers/restaurant/earnings.controller" );

    const restaurantEarningRouter = require( "express" ).Router();

    restaurantEarningRouter.post( "/total", restaurantEarningController.totalEarningsWithFilter );

    app.use( '/api/user/restaurant/earnigs', [ authVerify.verifyAccessToken ], restaurantEarningRouter )
};