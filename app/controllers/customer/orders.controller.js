const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { generateTransactionId } = require( '../../utils/helper' );

exports.createOrder = async ( req, res ) =>
{
    try
    {
        const customerId = req.customerId;

        const { restaurant_id, bill_amount, order_timing } = req.body;
        const [ orderStartTime, orderEndTime ] = order_timing.split( '-' );

        const start_time = orderStartTime;
        const end_time = orderEndTime;
        console.log( "start_time: ", start_time );
        console.log( "end_time: ", end_time );

        const customer = await db.customer.findOne( { where: { id: customerId } } );
        if ( !customer )
        {
            return getErrorResult( res, 404, `customer not found with customer id ${ customerId }` )
        }

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } )
        if ( !restaurant )
        {
            return getErrorResult( res, 404, `restaurant not found with restaurant id ${ restaurant_id }` )
        }

        const restaurantDiscount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id, } } );

        const discounts = JSON.parse( restaurantDiscount.discount_json );

        let discount_percentage = 0;
        let discount_commision = 0;

        discounts.forEach( ( discount ) =>
        {
            discount.start_time = discount[ 'start_time ' ].trim();
            delete discount[ 'start_time ' ];
        } );

        const filteredDiscount = discounts.find( ( discount ) =>
        {
            const discountStartTime = discount.start_time;
            const discountEndTime = discount.end_time;

            return (
                start_time == discountStartTime && end_time == discountEndTime
            );
        } );

        if ( filteredDiscount )
        {
            discount_percentage = filteredDiscount.discount_percentage;
            discount_commision = filteredDiscount.discount_commission;
        } else
        {
            console.log( 'Order is NOT within discount time range.' );
            return getErrorResult( res, 500, 'Something went wrong. No applicable discount found.' );
        }

        const discount_by_customer = bill_amount * discount_percentage / 100;
        const profit = bill_amount * discount_commision / 100;
        const gstRate = profit * restaurant.gst_rate / 100;

        const total_profit = profit - gstRate

        const createOrder = await db.orders.create( {
            user_id: restaurant.user_id,
            restaurant_id: restaurant_id,
            customer_id: customerId,
            order_date: Date.now(),
            transaction_id: generateTransactionId(),
            bill_amount: bill_amount,
            gst: restaurant.gst_rate,
            discount_to_customer: discount_percentage,
            discount_given_by_customer: discount_by_customer,
            order_timing: order_timing,
            our_profit: total_profit,
        } );

        const data = {
            order: createOrder,
        }

        return getResult( res, 200, data, "order created successfully." )
    } catch ( error ) 
    {
        console.log( "err in create order : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.getAllOrders = async ( req, res ) =>
{
    const customerId = req.customerId;
    await db.orders.findAll( {
        where: { customer_id: customerId }
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "fetch all orders successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in fetch all orders : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
}

// exports.updateOrder = async ( req, res ) =>
// {
//     try
//     {
//         const customerId = req.customerId;
//         const id = req.params.id;
//         const { restaurant_id, transaction_id, bill_amount, order_timing } = req.body;

//         const customer = await db.customer.findOne( { where: { id: customerId } } );
//         if ( !customer )
//         {
//             return getErrorResult( res, 404, `customer not found with customer id ${ customerId }` )
//         }

//         const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } )
//         if ( !restaurant )
//         {
//             return getErrorResult( res, 404, `restaurant not found with restaurant id ${ restaurant_id }` )
//         }

//         const restaurantDiscount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id, } } );

//         const discounts = JSON.parse( restaurantDiscount.discount_json );

//         let discount_percentage = 0;
//         let discount_commision = 0;

//         discounts.forEach( ( discount ) =>
//         {
//             discount.start_time = discount[ 'start_time ' ].trim();
//             delete discount[ 'start_time ' ];
//         } );
//         const orderTime = moment( order_timing, 'hh:mma' );

//         const filteredDiscount = discounts.find( ( discount ) =>
//         {
//             const discountStartTime = moment( discount.start_time, 'hh:mma' );
//             const discountEndTime = moment( discount.end_time, 'hh:mma' );

//             return (
//                 orderTime.isSame( discountStartTime ) || orderTime.isSame( discountEndTime ) ||
//                 ( orderTime.isAfter( discountStartTime ) && orderTime.isBefore( discountEndTime ) )
//             );
//         } );


//         if ( filteredDiscount )
//         {
//             discount_percentage = filteredDiscount.discount_percentage;
//             discount_commision = filteredDiscount.discount_commission;
//         } else
//         {
//             console.log( 'Order is NOT within discount time range.' );
//             return getErrorResult( res, 500, 'Something went wrong. No applicable discount found.' );
//         }

//         const discount_by_customer = bill_amount * discount_percentage / 100;
//         const profit = bill_amount * discount_commision / 100;

//         const createOrder = await db.orders.create( {
//             user_id: restaurant.user_id,
//             restaurant_id: restaurant_id,
//             customer_id: customerId,
//             order_date: Date.now(),
//             transaction_id: transaction_id,
//             bill_amount: bill_amount,
//             gst: restaurant.gst_rate,
//             discount_to_customer: discount_percentage,
//             discount_given_by_customer: discount_by_customer,
//             order_timing: order_timing,
//             our_profit: profit,
//         } );

//         const data = {
//             order: createOrder,
//         }

//         return getResult( res, 200, data, "order created successfully." )
//     } catch ( error )
//     {
//         console.log( "err in create order : ", error );
//         return getErrorResult( res, 500, 'somthing went wrong.' )
//     }
// }