const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { generateTransactionId, encryptData, decryptdata } = require( '../../utils/helper' );

exports.createOrder = async ( req, res ) =>
{
    try
    {
        const customerId = req.customerId;

        const { restaurant_id, bill_amount, order_timing, coupon_id } = req.body;
        const [ orderStartTime, orderEndTime ] = order_timing.split( '-' );

        const start_time = orderStartTime;
        const end_time = orderEndTime;

        const customer = await db.customer.findOne( { where: { id: customerId } } );
        if ( !customer )
        {
            return getErrorResult( res, 404, `customer not found with customer id ${ customerId }` );
        }

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id, is_delete: false } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 404, `restaurant not found with restaurant id ${ restaurant_id }` );
        }

        const restaurantDiscount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id } } );

        const discounts = JSON.parse( restaurantDiscount.discount_json );

        let discount_percentage = 0, discount_commision = 0, discount_from_restaurant = 0;

        const filteredDiscount = discounts.find( ( discount ) =>
        {
            const discountStartTime = discount.start_time;
            const discountEndTime = discount.end_time;

            return (
                start_time == discountStartTime && end_time == discountEndTime
            );
        } );

        let coupon_discount = 0, convin_fee, gstDis;
        if ( coupon_id )
        {
            const coupons = await db.coupons.findOne( {
                where: { id: coupon_id, status: "active" }
            } );

            if ( coupons )
            {
                coupon_discount = coupons.discount;
            }
        }

        if ( filteredDiscount )
        {
            discount_from_restaurant = filteredDiscount.discount;
            discount_percentage = filteredDiscount.discount_percentage;
            discount_commision = filteredDiscount.discount_commission;
        } else
        {
            console.error( 'Order is NOT within discount time range' );
            return getErrorResult( res, 500, 'Something went wrong' );
        }

        const convinenceFee = await db.configurations.findOne( { where: { type: 'convinence_fee' }, attributes: [ 'value' ] } );
        const GST = await db.configurations.findOne( { where: { type: 'gst' }, attributes: [ 'value' ] } );
        convin_fee = convinenceFee.value;
        gstDis = GST.value;

        const convenienceRate = bill_amount * convin_fee / 100;
        const dis_to_customer = ( bill_amount * discount_percentage / 100 );
        const dis_by_res = bill_amount * discount_from_restaurant / 100;
        const com_by_admin = ( bill_amount * discount_commision / 100 ) + convenienceRate;
        const gstRate = com_by_admin * gstDis / 100;
        const gstAmt = com_by_admin + gstRate;

        const magic_coupon_amount = bill_amount * coupon_discount / 100;

        const discountGiven = dis_to_customer + magic_coupon_amount;
        const pay_by_customer = ( bill_amount - discountGiven ) + convenienceRate;
        const givenToRes = pay_by_customer - com_by_admin - gstRate - magic_coupon_amount;

        const createOrder = await db.orders.create( {
            user_id: restaurant.user_id,
            restaurant_id: restaurant_id,
            customer_id: customerId,
            order_date: Date.now(),
            transaction_id: generateTransactionId(),
            bill_amount: bill_amount,
            discount_from_restaurant: parseFloat( discount_from_restaurant ),
            discount_to_customer: parseFloat( discount_percentage ),
            discount_commision: parseFloat( discount_commision ),
            magic_coupon_discount: parseFloat( coupon_discount ),
            convinence_fee: parseFloat( convin_fee ),
            gst: parseFloat( gstDis ),
            dis_to_customer: dis_to_customer,
            amt_pay_by_customer: pay_by_customer,
            dis_receive_by_res: dis_by_res,
            commission_by_admin: com_by_admin,
            magic_coupon_amount: magic_coupon_amount,
            gst_rate: gstRate,
            gst_amt: gstAmt,
            given_to_res: givenToRes,
            discount_given: discountGiven,
            order_timing: order_timing
        } );

        return getResult( res, 200, createOrder, "Order created successfully" );
    } catch ( error )
    {
        console.error( "err in create order : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

exports.getAllOrders = async ( req, res ) =>
{
    try
    {
        const customerId = req.customerId;

        let orderList = [];

        const orders = await db.orders.findAll( {
            include: [
                {
                    model: db.restaurants,
                    attributes: [ "id", "store_name", "address", "short_address" ],
                    as: "restaurant",
                    require: false
                }
            ],
            where: { customer_id: customerId },
            attributes: [ "id", "order_date", "discount_given", "bill_amount" ],
            order: [ [ "order_date", "DESC" ] ]
        } );

        orders.forEach( order =>
        {
            const store = order.restaurant;

            orderList.push( {
                store_name: store ? store.store_name : '',
                address: store ? store.address : '',
                short_address: store ? store.short_address : '',
                bill_amount: JSON.stringify( order.bill_amount ),
                discount: JSON.stringify( order.discount_given ),
                date: order.order_date,
            } );
        } );
        return getResult( res, 200, orderList, "Fetch all orders successfully" );
    } catch ( err )
    {
        console.error( "err in fetch all orders : ", err );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};
