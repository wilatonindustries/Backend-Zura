const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const couponController = require( "../../controllers/admin/coupon.controller" );

    const couponRouter = require( "express" ).Router();

    couponRouter.post( "/", couponController.createCoupon );

    couponRouter.post( "/list", couponController.getCouponByCode );

    couponRouter.post( '/fetch', couponController.getCoupons );

    couponRouter.get( '/:id', couponController.getCouponById );

    couponRouter.put( '/:id', couponController.updateCoupon );

    couponRouter.delete( '/:id', couponController.deleteCoupon );

    app.use( '/api/admin/coupon', [ adminVerify.verifyAccessToken ], couponRouter );
};
