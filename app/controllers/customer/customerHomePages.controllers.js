const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Op = db.Op;

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
        const { name, startTime, endTime, offer, category } = req.body;

        let restaurants, formattedRestaurants, formattedDiscounts;

        const orderOptions = {
            include: [
                {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    attributes: [ 'discount_json' ],
                },
                {
                    model: db.restaurant_profile_photos,
                    as: 'profile_photos',
                    attributes: [ 'set_store_thumbnail_photo' ],
                }
            ],
            attributes: [ 'id', 'store_name', 'address', 'short_address' ],
        };
        if ( category )
        {
            if ( category !== 0 )
            {
                orderOptions.where = {
                    category_id: category
                };
                restaurants = await db.restaurants.findAll( orderOptions );
                formattedRestaurants = restaurants.map( ( restaurant ) =>
                {
                    const discounts = restaurant.discounts && restaurant.discounts.discount_json
                        ? JSON.parse( restaurant.discounts.discount_json )
                        : [];

                    return {
                        id: restaurant.id,
                        store_name: restaurant.store_name,
                        address: restaurant.address,
                        short_address: restaurant.short_address,
                        discount: discounts,
                        thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo
                    };
                } );
            } else
            {
                restaurants = await db.restaurants.findAll( orderOptions );
                formattedRestaurants = restaurants.map( ( restaurant ) =>
                {
                    const discounts = restaurant.discounts && restaurant.discounts.discount_json
                        ? JSON.parse( restaurant.discounts.discount_json )
                        : [];

                    return {
                        id: restaurant.id,
                        store_name: restaurant.store_name,
                        address: restaurant.address,
                        short_address: restaurant.short_address,
                        discount: discounts,
                        thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo
                    };
                } );
            }
        }

        if ( name )
        {
            orderOptions.where = {
                store_name: {
                    [ Op.like ]: `%${ name }%`
                }
            };
            restaurants = await db.restaurants.findAll( orderOptions );
            formattedRestaurants = restaurants.filter( restaurant =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json ? JSON.parse( restaurant.discounts.discount_json ) : [];
                return discounts.some( discount => discount.discount_percentage > 0 );
            } ).map( ( restaurant ) =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json
                    ? JSON.parse( restaurant.discounts.discount_json )
                    : [];

                formattedDiscounts = discounts.map( discount => ( {
                    ...discount,
                    discount: parseInt( discount.discount ),
                    discount_percentage: parseInt( discount.discount_percentage ),
                    discount_commission: parseInt( discount.discount_commission )
                } ) );
                console.log( "formattedDiscounts: ", formattedDiscounts );
                return {
                    id: restaurant.id,
                    store_name: restaurant.store_name,
                    address: restaurant.address,
                    short_address: restaurant.short_address,
                    discount: formattedDiscounts,
                    thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo
                };
            } );
        }
        if ( offer )
        {
            const discountOrder = offer === "high_to_low" ? "DESC" : "ASC";
            orderOptions.order = [
                [ db.Sequelize.literal( 'CAST(JSON_UNQUOTE(JSON_EXTRACT(discounts.discount_json, "$[0].discount_percentage")) AS SIGNED)' ), discountOrder ],
            ];
            restaurants = await db.restaurants.findAll( orderOptions );

            formattedRestaurants = restaurants.filter( restaurant =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json ? JSON.parse( restaurant.discounts.discount_json ) : [];
                return discounts.some( discount => discount.discount_percentage > 0 );
            } ).map( ( restaurant ) =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json
                    ? JSON.parse( restaurant.discounts.discount_json )
                    : [];

                formattedDiscounts = discounts.map( discount => ( {
                    ...discount,
                    discount: parseInt( discount.discount ),
                    discount_percentage: parseInt( discount.discount_percentage ),
                    discount_commission: parseInt( discount.discount_commission )
                } ) );


                if ( Array.isArray( formattedDiscounts ) )
                {
                    if ( offer === "high_to_low" )
                    {
                        formattedDiscounts.sort( ( a, b ) => b.discount_percentage - a.discount_percentage ); // Sort in descending order
                    } else
                    {
                        formattedDiscounts.sort( ( a, b ) => a.discount_percentage - b.discount_percentage ); // Sort in ascending order
                    }
                }
                return {
                    id: restaurant.id,
                    store_name: restaurant.store_name,
                    address: restaurant.address,
                    short_address: restaurant.short_address,
                    discount: formattedDiscounts,
                    thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo
                };
            } );

        }
        if ( startTime && endTime )
        {
            restaurants = await db.restaurants.findAll( orderOptions );
            formattedRestaurants = restaurants.filter( restaurant =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json ? JSON.parse( restaurant.discounts.discount_json ) : [];
                return discounts.some( discount => discount.discount_percentage > 0 );
            } ).map( ( restaurant ) =>
            {
                const discounts = restaurant.discounts && restaurant.discounts.discount_json
                    ? JSON.parse( restaurant.discounts.discount_json )
                    : [];

                formattedDiscounts = discounts.map( discount => ( {
                    ...discount,
                    discount: parseInt( discount.discount ),
                    discount_percentage: parseInt( discount.discount_percentage ),
                    discount_commission: parseInt( discount.discount_commission )
                } ) );

                const filteredDiscounts = formattedDiscounts.filter( ( discount ) =>
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
                    thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo
                };

            } );

        }
        restaurants = await db.restaurants.findAll( orderOptions );
        formattedRestaurants = restaurants.map( ( restaurant ) =>
        {
            const discounts = restaurant.discounts && restaurant.discounts.discount_json
                ? JSON.parse( restaurant.discounts.discount_json )
                : [];

            formattedDiscounts = discounts.map( discount => ( {
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
                discount: formattedDiscounts,
                thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo
            };

        } );

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