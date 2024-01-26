const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const restaurantDiscountsController = require( "../../controllers/admin/restaurantDiscounts.controller" );

    const restaurantDiscountsRouter = require( "express" ).Router();

    restaurantDiscountsRouter.post( "/discount", restaurantDiscountsController.createRestaurantDiscount );

    app.use( '/api/admin/restaurant', [ adminVerify.verifyAccessToken ], restaurantDiscountsRouter )
};
