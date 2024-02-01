const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { generateTransactionId } = require( '../../utils/helper' );
const { where } = require( 'sequelize' );

exports.createOrder = async ( req, res ) =>
{
    try
    {
        const customerId = req.customerId;

        const { restaurant_id, bill_amount, order_timing } = req.body;
        const [ orderStartTime, orderEndTime ] = order_timing.split( '-' );

        const start_time = orderStartTime;
        const end_time = orderEndTime;

        const customer = await db.customer.findOne( { where: { id: customerId } } );
        if ( !customer )
        {
            return getErrorResult( res, 404, `customer not found with customer id ${ customerId }` );
        }

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 404, `restaurant not found with restaurant id ${ restaurant_id }` );
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
            console.error( 'Order is NOT within discount time range.' );
            return getErrorResult( res, 500, 'Something went wrong.' );
        }

        const discount_by_customer = bill_amount * discount_percentage / 100;
        const profit = bill_amount * discount_commision / 100;
        const gstRate = profit * restaurant.gst_rate / 100;

        const total_profit = profit - gstRate;

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
        };

        return getResult( res, 200, data, "order created successfully." );
    } catch ( error ) 
    {
        console.error( "err in create order : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.getAllOrders = async ( req, res ) =>
{
    const customerId = req.customerId;
    await db.orders.findAll( {
        where: { customer_id: customerId }
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "fetch all orders successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in fetch all orders : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.deleteOrder = async ( req, res ) =>
{
    const id = req.params.id;
    const customerId = req.customerId;
    const order = await db.orders.findOne( { where: { id, customer_id: customerId } } );

    if ( !order )
    {
        return getErrorResult( res, 404, `order not found with order id ${ id }` );
    }

    await db.orders.destroy( {
        where: { id, customer_id: customerId }
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "order deleted successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in delete order : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};