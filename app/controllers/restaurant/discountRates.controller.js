const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getDiscountRates = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const restaurant_id = req.body.restaurant_id;

        const restaurant = await db.restaurants.findOne( { where: { user_id: userId, id: restaurant_id } } );
        if ( !restaurant )
        {
            return getResult( res, 200, [], "discount rates fetched successfully." );
        }

        const discount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant_id } } );

        const discounts = JSON.parse( discount.discount_json );

        return getResult( res, 200, discounts, "discount rates fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch discount rates : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.updateDiscountRates = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const discountData = req.body;

        const restaurant = await db.restaurants.findOne( { where: { user_id: userId } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 404, `restaurant not found with user id ${ userId }` );
        }

        const restaurantDis = await db.restaurant_discounts.findOne( { where: { user_id: userId, restaurant_id: restaurant.id } } );
        if ( !restaurantDis )
        {
            return getErrorResult( res, 404, `restaurant discount not found with user id ${ userId } and restaurant id ${ restaurant.id }` );
        }

        await db.restaurant_discounts.update( {
            changes_discount_json: JSON.stringify( discountData ),
            is_changes_accept: true
        }, {
            where: {
                user_id: userId, restaurant_id: restaurant.id
            }
        } );

        const storeDis = await db.restaurant_discounts.findOne( { where: { user_id: userId, restaurant_id: restaurant.id } } );

        return getResult( res, 200, storeDis, "discount rates updated successfully." );
    } catch ( error )
    {
        console.error( "error in update discount rates : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
