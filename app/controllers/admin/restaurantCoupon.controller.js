const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.couponAssignToRestaurant = async ( req, res ) =>
{
    try
    {
        const { restaurant_id, coupon_id } = req.body;

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 400, `restaurant not found with id ${ restaurant_id }.` );
        }

        const coupon = await db.coupons.findOne( { where: { id: coupon_id, status: 'active' } } );
        if ( !coupon )
        {
            return getErrorResult( res, 400, `coupon not found with id ${ coupon_id }.` );
        }

        const couponAssigned = await db.restaurant_coupons.findOne( { where: { restaurant_id: restaurant_id } } );
        if ( couponAssigned )
        {
            return getErrorResult( res, 403, `coupon already assigned.` );
        }

        const assignCoupon = await db.restaurant_coupons.create( {
            user_id: restaurant.user_id,
            restaurant_id,
            coupon_id,
            coupon_code: coupon.unique_coupon_codes
        } );

        return getResult( res, 200, assignCoupon, "coupon assinged to restaurant successfully." );
    } catch ( error )
    {
        console.error( "error in coupon assign to restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}