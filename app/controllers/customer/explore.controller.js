const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Op = db.Op;

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
                    [ db.Op.or ]: [ {
                        store_name: {
                            [ Op.like ]: `%${ name }%`
                        }
                    }, {
                        address: {
                            [ Op.like ]: `%${ name }%`
                        }
                    } ],
                    is_delete: false
                },
                attributes: [ 'id', 'store_name', 'address', 'short_address' ],
                include: [ {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    where: { is_delete: false },
                    attributes: [ 'discount_json' ],
                } ],
            } );
        } else if ( filter )
        {
            restaurants = await db.restaurants.findAll( {
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    },
                    is_delete: false
                },
                attributes: [ 'id', 'store_name', 'address', 'short_address' ],
                include: [ {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    where: { is_delete: false },
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
                    where: { is_delete: false },
                    attributes: [ 'discount_json' ],
                } ],
                where: { is_delete: false },
            } );
        }
        const formattedRestaurants = restaurants.map( ( restaurant ) =>
        {
            const discounts = JSON.parse( restaurant.discounts.discount_json );

            const formattedDiscounts = discounts.map( discount => ( {
                ...discount,
                discount: parseInt( discount.discount ),
                discount_percentage: parseInt( discount.discount_percentage ),
                discount_commission: parseInt( discount.discount_commission )
            } ) );

            return {
                id: restaurant.id,
                store_name: restaurant.store_name,
                address: restaurant.address,
                short_address: restaurant.short_address,
                discounts: formattedDiscounts,
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
            where: { id, is_delete: false },
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