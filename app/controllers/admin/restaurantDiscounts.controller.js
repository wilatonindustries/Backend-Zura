const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.createRestaurantDiscount = async ( req, res ) =>
{
    const userId = req.userId
    const discountData = req.body;

    const restaurant = await db.restaurants.findOne( { where: { user_id: userId } } );

    await db.restaurant_discounts.update( {
        discount_json: JSON.stringify( discountData ),
    }, {
        where: { restaurant_id: restaurant.id, user_id: userId },
    } ).then( data =>
    {
        return getResult( res, 200, data, "restaurant discount added or updated successfully." )
    } ).catch( err =>
    {
        console.log( "err in create restaurant discount : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    } )
}

// exports.updateRestaurantDiscount = async ( req, res ) =>
// {
//     const userId = req.userId;
//     const discountData = req.body

//     const restaurant = await db.restaurants.findOne( { where: { user_id: userId } } )
//     if ( !restaurant )
//     {
//         return getErrorResult( res, 404, `restaurant not found with user id ${ userId }` )
//     }

//     const restaurantDis = await db.restaurant_discounts.findOne( { where: { user_id: userId, restaurant_id: restaurant.id } } )
//     if ( !restaurantDis )
//     {
//         return getErrorResult( res, 404, `restaurant discount not found with user id ${ userId } and restaurant id ${ restaurant.id }` )
//     }

//     await db.restaurant_discounts.update( {
//         discount_json: JSON.stringify( discountData ),
//     }, {
//         where: {
//              user_id: userId, restaurant_id: restaurant.id
//         }
//     } ).then( data =>
//     {
//         return getResult( res, 200, data, "restaurant discount updated successfully." )
//     } ).catch( err =>
//     {
//         console.log( "err in update restaurant discount : ", err );
//         return getErrorResult( res, 500, 'somthing went wrong.' )
//     } )
// }
