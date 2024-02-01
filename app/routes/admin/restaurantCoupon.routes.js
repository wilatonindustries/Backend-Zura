const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const restaurantCouponController = require( "../../controllers/admin/restaurantCoupon.controller" );

    const restaurantCouponRouter = require( "express" ).Router();

    restaurantCouponRouter.post( "/assign-coupon", restaurantCouponController.couponAssignToRestaurant );

    app.use( '/api/admin/restaurant', [ adminVerify.verifyAccessToken ], restaurantCouponRouter )
};
