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
        const { name, startTime, endTime, offer, category, is_offer_default, latitude, longitude } = req.body;

        let restaurants, formattedRestaurants, formattedDiscounts;

        const orderOptions = {
            include: [
                {
                    model: db.restaurant_discounts,
                    as: 'discounts',
                    where: { is_delete: false },
                    attributes: [ 'discount_json' ],
                },
                {
                    model: db.restaurant_profile_photos,
                    as: 'profile_photos',
                    where: { is_delete: false },
                    attributes: [ 'set_store_thumbnail_photo' ],
                }
            ],
            attributes: [ 'id', 'store_name', 'address', 'short_address', "google_link", 'category_id', 'latitude', 'longitude' ],
        };
        orderOptions.where = {
            is_delete: false
        };
        if ( category && category !== 0 )
        {
            Object.assign( orderOptions.where, {
                category_id: category
            } );
        }

        if ( name )
        {
            Object.assign( orderOptions.where, {
                store_name: {
                    [ Op.like ]: `%${ name }%`
                }
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
                thumbnail_photo: restaurant.profile_photos.set_store_thumbnail_photo,
                google_link: restaurant.google_link,
                category_id: restaurant.category_id
            };
        } );

        if ( offer && is_offer_default == true )
        {
            const filteredRestaurants = formattedRestaurants.filter( restaurant =>
                restaurant.discount.some( discount =>
                    discount.start_time === startTime && discount.end_time === endTime
                )
            );

            // Sort filtered restaurants based on discount percentage
            filteredRestaurants.sort( ( a, b ) =>
            {
                const discountPercentageA = a.discount.find( discount =>
                    discount.start_time === startTime && discount.end_time === endTime
                ).discount_percentage;
                const discountPercentageB = b.discount.find( discount =>
                    discount.start_time === startTime && discount.end_time === endTime
                ).discount_percentage;
                return offer == "high_to_low" ? ( discountPercentageB - discountPercentageA ) : ( discountPercentageA - discountPercentageB );
            } );

            formattedRestaurants = filteredRestaurants;
        }

        if ( startTime && endTime && !offer )
        {
            const filteredRestaurants = formattedRestaurants.filter( restaurant =>
                restaurant.discount.some( discount =>
                    discount.start_time === startTime && discount.end_time === endTime && discount.discount_percentage > 0
                )
            );

            formattedRestaurants = filteredRestaurants;
        }

        if ( startTime && endTime && !is_offer_default && offer )
        {
            const filteredRestaurants = formattedRestaurants.filter( restaurant =>
                restaurant.discount.some( discount =>
                    discount.start_time === startTime && discount.end_time === endTime && discount.discount_percentage > 0
                )
            );

            // Sort filtered restaurants based on discount percentage
            filteredRestaurants.sort( ( a, b ) =>
            {
                const discountPercentageA = a.discount.find( discount =>
                    discount.start_time === startTime && discount.end_time === endTime
                ).discount_percentage;
                const discountPercentageB = b.discount.find( discount =>
                    discount.start_time === startTime && discount.end_time === endTime
                ).discount_percentage;
                return offer == "high_to_low" ? ( discountPercentageB - discountPercentageA ) : ( discountPercentageA - discountPercentageB );
            } );

            formattedRestaurants = filteredRestaurants;
        }

        if ( latitude && longitude )
        {
            const maxDistance = db.configurations.findOne( { where: { type: 'distance' }, attributes: [ 'value' ] } );
            formattedRestaurants = formattedRestaurants.filter( restaurant =>
            {
                const distance = calculateDistance( latitude, longitude, restaurant.latitude, restaurant.longitude );
                return distance <= maxDistance;
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

function calculateDistance ( lat1, lon1, lat2, lon2 )
{
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ( lat2 - lat1 ) * Math.PI / 180;
    const dLon = ( lon2 - lon1 ) * Math.PI / 180;
    const a =
        Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
        Math.cos( lat1 * Math.PI / 180 ) * Math.cos( lat2 * Math.PI / 180 ) *
        Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
    const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    const distance = R * c; // Distance in kilometers
    return distance;
}