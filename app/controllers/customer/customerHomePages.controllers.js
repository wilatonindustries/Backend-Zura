const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getCustomerHomePage = async ( req, res ) =>
{
    try
    {
        const categories = await db.categories.findAll();
        const banners = await db.banners.findAll();
        const restaurants = await db.restaurants.findAll();

        const data = {
            category_list: categories,
            banner_list: banners,
            saved_till_date: 0,
            restaurant_list: restaurants,
        };
        return getResult( res, 200, data, "customer home page fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetching customer home page : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.searchRestaurant = async ( req, res ) =>
{
    try
    {
        const category = req.query.category;
        const { name, startTime, endTime, offer } = req.body;

        let restaurants, formattedRestaurants;

        const orderOptions = {
            include: [ {
                model: db.restaurant_discounts,
                as: 'discounts',
                attributes: [ 'discount_json' ],
            } ],
            attributes: [ 'id', 'store_name', 'address', 'short_address' ],
        };
        if ( category )
        {
            if ( category != 0 )
            {
                orderOptions.where = {
                    category_id: category
                };
            }
        }

        if ( name )
        {
            orderOptions.where = {
                store_name: name
            };
            restaurants = await db.restaurants.findAll( orderOptions );
            formattedRestaurants = restaurants.map( ( restaurant ) =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json
                    ? JSON.parse( restaurant.discounts.discount_json )
                    : null;

                return {
                    id: restaurant.id,
                    store_name: restaurant.store_name,
                    address: restaurant.address,
                    short_address: restaurant.short_address,
                    discount: discounts ? discounts : []
                };
            } );
        } else if ( offer )
        {
            if ( offer === "high_to_low" )
            {
                orderOptions.order = [
                    [ db.Sequelize.literal( 'CAST(JSON_UNQUOTE(JSON_EXTRACT(discounts.discount_json, "$[0].discount_percentage")) AS SIGNED)' ), 'DESC' ],
                ];
                restaurants = await db.restaurants.findAll( orderOptions );
                formattedRestaurants = restaurants.map( ( restaurant ) =>
                {
                    const discounts = restaurant.discounts && restaurant.discounts.discount_json
                        ? JSON.parse( restaurant.discounts.discount_json )
                        : null;

                    if ( Array.isArray( discounts ) )
                    {
                        discounts.sort( ( a, b ) => b.discount_percentage - a.discount_percentage );
                    }
                    return {
                        id: restaurant.id,
                        store_name: restaurant.store_name,
                        address: restaurant.address,
                        short_address: restaurant.short_address,
                        discount: discounts ? discounts : []
                    };
                } );
            }
            else
            {
                orderOptions.order = [
                    [ db.Sequelize.literal( 'CAST(JSON_UNQUOTE(JSON_EXTRACT(discounts.discount_json, "$[0].discount_percentage")) AS SIGNED)' ), 'ASC' ],
                ];
                restaurants = await db.restaurants.findAll( orderOptions );
                formattedRestaurants = restaurants.map( ( restaurant ) =>
                {
                    const discounts = restaurant.discounts && restaurant.discounts.discount_json
                        ? JSON.parse( restaurant.discounts.discount_json )
                        : null;

                    return {
                        id: restaurant.id,
                        store_name: restaurant.store_name,
                        address: restaurant.address,
                        short_address: restaurant.short_address,
                        discount: discounts ? discounts : []
                    };
                } );
            }
        } else if ( startTime && endTime )
        {
            restaurants = await db.restaurants.findAll( orderOptions );
            formattedRestaurants = restaurants.map( ( restaurant ) =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json
                    ? JSON.parse( restaurant.discounts.discount_json )
                    : null;

                if ( discounts )
                {
                    const filteredDiscounts = discounts.filter( ( discount ) =>
                    {
                        return (
                            moment( discount.start_time, 'hh:mma' ).isSame( moment( startTime, 'hh:mma' ) ) &&
                            moment( discount.end_time, 'hh:mma' ).isSame( moment( endTime, 'hh:mma' ) )
                        );
                    } );

                    return {
                        id: restaurant.id,
                        store_name: restaurant.store_name,
                        address: restaurant.address,
                        short_address: restaurant.short_address,
                        discount: filteredDiscounts.map( ( d ) => ( {
                            discount_percentage: d.discount_percentage,
                        } ) ),
                    };
                } else
                {
                    return {
                        id: restaurant.id,
                        store_name: restaurant.store_name,
                        address: restaurant.address,
                        short_address: restaurant.short_address,
                        discount: [],
                    };
                }
            } );
        } else
        {
            restaurants = await db.restaurants.findAll( orderOptions );
            formattedRestaurants = restaurants.map( ( restaurant ) =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json
                    ? JSON.parse( restaurant.discounts.discount_json )
                    : null;

                return {
                    id: restaurant.id,
                    store_name: restaurant.store_name,
                    address: restaurant.address,
                    short_address: restaurant.short_address,
                    discount: discounts ? discounts : []
                };

            } );
        }
        const data = {
            restaurants: formattedRestaurants
        };
        return getResult( res, 200, data, "restaurants fetched successfully." );
    } catch ( error )
    {
        console.error( "error in search restaurants : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};