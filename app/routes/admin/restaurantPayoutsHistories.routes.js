const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const payoutsController = require( "../../controllers/admin/restaurantPayoutsHistories.controller" );

    const payoutsRouter = require( "express" ).Router();

    payoutsRouter.post( "/payouts-histories", payoutsController.restaurantPayoutsOrHistories );

    app.use( '/api/admin/restaurant', [ adminVerify.verifyAccessToken ], payoutsRouter );
};