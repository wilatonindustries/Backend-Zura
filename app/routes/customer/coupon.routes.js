const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const couponController = require( "../../controllers/customer/coupon.controller" );

    const couponRouter = require( "express" ).Router();

    couponRouter.post( "/list", couponController.getCouponList );

    app.use( '/api/customer/coupon', [ customerVerify.verifyAccessToken ], couponRouter );
};
