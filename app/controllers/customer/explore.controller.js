const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );

exports.restaurantList = async ( req, res ) =>
{
    try
    {
        const { name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );;

        const restaurants = await db.restaurants.findAll( {
            where: {
                [ db.Op.or ]: [ { store_name: name }, { address: name } ],
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

        const formattedRestaurants = restaurants.map( ( restaurant ) =>
        {
            const discounts = JSON.parse( restaurant.discounts.discount_json )

            return {
                id: restaurant.id,
                store_name: restaurant.store_name,
                address: restaurant.address,
                short_address: restaurant.short_address,
                discounts: discounts
            }
        } );

        const data = {
            restaurants: formattedRestaurants
        }

        return getResult( res, 200, data, "restaurant list fetched successfully." )
    } catch ( error )
    {
        console.log( "error in search restaurants : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.getRestaurantDetailsById = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;

        const restaurant = await db.restaurants.findOne( {
            where: { id },
            include: [
                { model: db.restaurant_profile_photos, as: 'profile_photos' },
                { model: db.restaurant_discounts, as: 'discounts' }
            ]
        } )
        const discounts = restaurant.discounts;
        if ( discounts && discounts.discount_json )
        {
            discounts.discount_json = JSON.parse( discounts.discount_json );
        }

        const data = {
            restaurant
        }

        return getResult( res, 200, data, "restaurant details fetched successfully." )
    } catch ( err )
    {
        console.log( "err in fetch restaurants details : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    };
}