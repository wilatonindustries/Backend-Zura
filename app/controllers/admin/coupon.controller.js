const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Op = db.Op;

exports.createCoupon = async ( req, res ) =>
{
    try
    {
        const { description, status, coupon_quantity, unique_coupon_codes, discount, restaurant_id, category_id } = req.body;

        const couponStatus = status === 'inactive' ? 'inactive' : 'active';

        let createdvalue = {};

        if ( restaurant_id )
        {
            const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } );
            if ( !restaurant )
            {
                return getErrorResult( res, 404, 'restaurant not found.' );
            }
            createdvalue.restaurant_id = restaurant_id;
        }
        if ( category_id )
        {
            const category = await db.categories.findOne( { where: { id: category_id } } );
            if ( !category )
            {
                return getErrorResult( res, 404, 'category not found.' );
            }
            createdvalue.category_id = category_id;
        }

        const createCoupon = await db.coupons.create( {
            description: description ? description : null,
            status: couponStatus,
            coupon_quantity: coupon_quantity,
            unique_coupon_codes: unique_coupon_codes,
            discount: discount,
            ...createdvalue
        } );

        return getResult( res, 200, createCoupon, "coupon created successfully." );
    } catch ( error )
    {
        console.error( "error in creating coupon  : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.getCouponByCode = async ( req, res ) =>
{
    try
    {
        const { code, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let coupon;

        if ( code )
        {
            coupon = await db.coupons.findAll( {
                where: {
                    unique_coupon_codes: code, createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                }
            } );
        } else
        {
            coupon = await db.coupons.findAll( {
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                }
            } );
        }

        return getResult( res, 200, coupon, "coupons fetched successfully." );
    } catch ( error )
    {
        console.error( "error in get coupon  : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.getCoupons = async ( req, res ) =>
{
    try
    {
        const { filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        const countCoupon = await db.coupons.count();
        const coupon = await db.coupons.findAll( {
            where: {
                createdAt: {
                    [ Op.between ]: [ startDate, endDate ]
                }
            }
        } );

        const data = {
            countCoupon, coupon
        };

        return getResult( res, 200, data, "coupons fetched successfully." );
    } catch ( error )
    {
        console.error( "error in get coupon  : ", error );
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
        const { description, status, coupon_quantity, discount, unique_coupon_codes, restaurant_id, category_id } = req.body;

        const coupon = await db.coupons.findByPk( id );

        if ( !coupon )
        {
            return getErrorResult( res, 404, "coupon not found." );
        }
        const couponStatus = status === 'inactive' ? 'inactive' : 'active';

        let updateValue = {};

        if ( restaurant_id )
        {
            const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } );
            if ( !restaurant )
            {
                return getErrorResult( res, 404, 'restaurant not found.' );
            }
            updateValue.restaurant_id = restaurant_id;
        }
        if ( category_id )
        {
            const category = await db.categories.findOne( { where: { id: category_id } } );
            if ( !category )
            {
                return getErrorResult( res, 404, 'category not found.' );
            }
            updateValue.category_id = category_id;
        }

        const updateCoupon = await db.coupons.update( {
            description: description ? description : coupon.description,
            status: couponStatus,
            coupon_quantity: coupon_quantity ? coupon_quantity : coupon.coupon_quantity,
            discount: discount ? discount : coupon.discount,
            unique_coupon_codes: unique_coupon_codes ? unique_coupon_codes : coupon.unique_coupon_codes,
            ...updateValue
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