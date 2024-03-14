const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Op = db.Op;

exports.getCouponList = async ( req, res ) =>
{
    try
    {
        const { restaurant_id, category_id } = req.body;

        let conditions = {
            [ Op.and ]: [
                { restaurant_id: null },
                { category_id: null }
            ],
            status: "active"
        };
        let couponList = [];

        const coupon = await db.coupons.findAll( { where: conditions } );

        couponList.push( ...coupon );

        if ( restaurant_id )
        {
            conditions[ Op.and ] = [
                { restaurant_id },
                { category_id: null }
            ];

            const coupon = await db.coupons.findAll( { where: conditions } );

            couponList.push( ...coupon );
        }
        if ( category_id )
        {
            conditions[ Op.and ] = [
                { category_id: category_id },
                { restaurant_id: null }
            ];

            const coupon = await db.coupons.findAll( { where: conditions } );

            couponList.push( ...coupon );
        }

        return getResult( res, 200, couponList ? couponList : [], "Coupon list fetched successfully" );
    } catch ( error )
    {
        console.error( "error in fetch coupon list : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};
