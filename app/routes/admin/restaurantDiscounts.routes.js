const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const restaurantDiscountsController = require( "../../controllers/admin/restaurantDiscounts.controller" );

    const restaurantDiscountsRouter = require( "express" ).Router();

    restaurantDiscountsRouter.put( "/discount/changes/:id", restaurantDiscountsController.discountChanges );

    app.use( '/api/admin/restaurant', [ adminVerify.verifyAccessToken ], restaurantDiscountsRouter )
};
