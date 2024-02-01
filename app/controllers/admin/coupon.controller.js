const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.createCoupon = async ( req, res ) =>
{
    try
    {
        const { description, status, coupon_quantity, unique_coupon_codes } = req.body;

        const couponStatus = status === 'inactive' ? 'inactive' : 'active';

        const createCoupon = await db.coupons.create( {
            description: description ? description : null,
            status: couponStatus,
            coupon_quantity: coupon_quantity,
            unique_coupon_codes: unique_coupon_codes
        } );

        return getResult( res, 200, createCoupon, "coupon created successfully." );
    } catch ( error )
    {
        console.error( "error in creating coupon  : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.getCouponById = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;

        const coupon = await db.coupons.findByPk( id );

        if ( !coupon )
        {
            return getResult( res, 200, [], "coupon fetched successfully." );
        }

        return getResult( res, 200, coupon, "coupon fetched successfully." );
    } catch ( error )
    {
        console.error( "error in get coupon by id  : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.updateCoupon = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { description, status, coupon_quantity } = req.body;

        const coupon = await db.coupons.findByPk( id );

        if ( !coupon )
        {
            return getErrorResult( res, 404, "coupon not found." );
        }
        const couponStatus = status === 'inactive' ? 'inactive' : 'active';

        const updateCoupon = await db.coupons.update( {
            description: description ? description : coupon.description,
            status: couponStatus,
            coupon_quantity: coupon_quantity ? coupon_quantity : coupon.coupon_quantity,
        }, { where: { id } } );

        return getResult( res, 200, updateCoupon, "coupon updated successfully." );
    } catch ( error )
    {
        console.error( "error in update coupon : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.deleteCoupon = async ( req, res ) =>
{
    const id = req.params.id;

    const coupon = await db.coupons.findOne( { where: { id } } );
    if ( !coupon )
    {
        return getErrorResult( res, 404, `coupon not found with id ${ id }` );
    }

    await db.coupons.destroy( {
        where: { id },
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "coupon deleted successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in delete coupon : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};