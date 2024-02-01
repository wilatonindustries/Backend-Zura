const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.assignCoupon = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;

        const coupon = await db.coupons.findOne( { where: { user_id: userId } } );

        if ( !coupon )
        {
            return getResult( res, 200, [], "coupon assigned successfully." );
        }
        const orders = await db.orders.findAll( { where: { user_id: userId } } );

        if ( !orders || orders.length === 0 )
        {
            return getResult( res, 200, { coupon_code: coupon.unique_coupon_codes, discount: 0 }, "Coupon assigned successfully." );
        }

        const totalOrderAmount = orders.reduce( ( total, order ) => total + parseFloat( order.bill_amount ), 0 );
        const discountAmount = calculateDiscount( totalOrderAmount, coupon );

        const data = {
            coupon_code: coupon.unique_coupon_codes,
            discount: discountAmount
        };
        return getResult( res, 200, data, "coupon assigned successfully." );
    } catch ( error )
    {
        console.error( "error in assign coupon : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

function calculateDiscount ( orderAmount, coupon )
{
    const maxCouponQuantity = 10;
    const baseDiscountPercentage = 5;

    const discountPercentage = ( coupon.coupon_quantity / maxCouponQuantity ) * baseDiscountPercentage;

    const discountAmount = ( orderAmount * discountPercentage ) / 100;

    return discountAmount;
}