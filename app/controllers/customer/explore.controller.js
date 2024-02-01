const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const { assignCoupon } = require( "../restaurant/coupon.controller" );

exports.restaurantList = async ( req, res ) =>
{
    try
    {
        const { name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );
        let restaurants;

        if ( name )
        {
            restaurants = await db.restaurants.findAll( {
                where: {
                    [ db.Op.or ]: [ { store_name: name }, { address: name } ],
                },
                attributes: [ 'id', 'store_name', 'address', 'short_address' ],
                include: [ {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    attributes: [ 'discount_json' ],
                } ],
            } );
        } else if ( filter )
        {
            restaurants = await db.restaurants.findAll( {
                where: {
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'id', 'store_name', 'address', 'short_address' ],
                include: [ {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    attributes: [ 'discount_json' ],
                } ],
            } );
        } else
        {
            restaurants = await db.restaurants.findAll( {
                attributes: [ 'id', 'store_name', 'address', 'short_address' ],
                include: [ {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    attributes: [ 'discount_json' ],
                } ],
            } );
        }
        const formattedRestaurants = restaurants.map( ( restaurant ) =>
        {
            const discounts = JSON.parse( restaurant.discounts.discount_json );

            return {
                id: restaurant.id,
                store_name: restaurant.store_name,
                address: restaurant.address,
                short_address: restaurant.short_address,
                discounts: discounts,
            };
        } );

        const data = {
            restaurants: formattedRestaurants
        };

        return getResult( res, 200, data, "restaurant list fetched successfully." );
    } catch ( error )
    {
        console.error( "error in search restaurants : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.getRestaurantDetailsById = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;

        const restaurant = await db.restaurants.findOne( {
            where: { id },
            include: [
                { model: db.restaurant_profile_photos, as: 'profile_photos' },
                { model: db.restaurant_discounts, as: 'discounts' },
            ]
        } );
        if ( !restaurant )
        {
            return getResult( res, 200, [], "restaurant details fetched successfully." );

        }
        const discounts = restaurant.discounts;
        if ( discounts && discounts.discount_json )
        {
            discounts.discount_json = JSON.parse( discounts.discount_json );
        }

        const coupons = await db.restaurant_coupons.findAll( {
            where: { restaurant_id: id },
            required: false,
            include: [
                { model: db.coupons, as: 'coupon' },
            ]
        } );

        if ( coupons.length > 0 )
        {
            restaurant.setDataValue( 'magic_coupon', coupons.map( coupon => coupon.coupon ) );
        }

        const data = {
            restaurant
        };

        return getResult( res, 200, data, "restaurant details fetched successfully." );
    } catch ( err )
    {
        console.error( "err in fetch restaurants details : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    };
};