const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getDiscountRates = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;

        const discount_rates = await db.restaurant_discounts.findAll( {
            include: [
                {
                    model: db.restaurants,
                    attributes: [],
                    as: "restaurant",
                    where: {
                        user_id: userId
                    },
                    require: false
                }
            ],
            attributes: [ 'discount_json' ],
        } );
        const discounts = discount_rates[ 0 ]?.dataValues.discount_json
            ? JSON.parse( discount_rates[ 0 ].dataValues.discount_json )
            : null;
        const formattedDiscounts = discounts
            ? discounts.map( ( { 'start_time ': startTime, end_time, discount } ) => ( {
                start_time: startTime.trim(),
                end_time,
                discount,
            } ) )
            : null;
        return getResult( res, 200, formattedDiscounts, "discount rates fetched successfully." )
    } catch ( error )
    {
        console.log( "error in fetch discount rates : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.updateDiscountRates = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const discountData = req.body

        const restaurant = await db.restaurants.findOne( { where: { user_id: userId } } )
        if ( !restaurant )
        {
            return getErrorResult( res, 404, `restaurant not found with user id ${ userId }` )
        }

        const restaurantDis = await db.restaurant_discounts.findOne( { where: { user_id: userId, restaurant_id: restaurant.id } } )
        if ( !restaurantDis )
        {
            return getErrorResult( res, 404, `restaurant discount not found with user id ${ userId } and restaurant id ${ restaurant.id }` )
        }

        await db.restaurant_discounts.update( {
            discount_json: JSON.stringify( discountData ),
        }, {
            where: {
                user_id: userId, restaurant_id: restaurant.id
            }
        } ).then( data =>
        {
            return getResult( res, 200, data, "restaurant discount updated successfully." )
        } ).catch( err =>
        {
            console.log( "err in update restaurant discount : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } )
    } catch ( error )
    {
        console.log( "error in update discount rates : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}
