const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { generateTransactionId } = require( '../../utils/helper' );

exports.paymentHandler = async ( req, res ) =>
{
    try
    {
        const customer_id = req.customerId;
        const { type, payment_order_id } = req.body;
        let data,
            paymentOrder, paymentOrderId, restaurant_id, bill_amount, order_timing, discount, coupon_id,
            customer, restaurant, restaurantDiscount, discounts, filteredDiscount, coupons,
            discount_percentage = 0, discount_commision = 0, discount_from_restaurant = 0, coupon_discount = 0,
            convinenceFee, GST, convin_fee, gstDis,
            convenienceRate, dis_to_customer, pay_by_customer, dis_by_res, com_by_admin, gstRate, gstAmt,
            discountGiven, givenToRes, magic_coupon_amount;

        if ( type === "SUCCESS" )
        {
            paymentOrder = await db.payment_orders.findOne( {
                where: { order_id: payment_order_id }
            } );

            if ( !paymentOrder )
            {
                return getErrorResult( res, 404, `Payment order not found with order id ${ payment_order_id } ` );
            }
            paymentOrderId = paymentOrder.id;
            // customer_id = paymentOrder.customer_id;
            restaurant_id = paymentOrder.restaurant_id;
            bill_amount = paymentOrder.bill_amount;
            order_timing = paymentOrder.order_timing;
            discount = paymentOrder.discount;
            coupon_id = paymentOrder.coupon_id;

            const [ orderStartTime, orderEndTime ] = order_timing.split( '-' );

            const start_time = orderStartTime;
            const end_time = orderEndTime;

            customer = await db.customer.findOne( { where: { id: customer_id } } );

            if ( !customer )
            {
                return getErrorResult( res, 404, `Customer not found with customer id ${ customer_id }` );
            }

            restaurant = await db.restaurants.findOne( { where: { id: restaurant_id, is_delete: false } } );
            if ( !restaurant )
            {
                return getErrorResult( res, 404, `Restaurant not found with restaurant id ${ restaurant_id }` );
            }

            restaurantDiscount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id } } );

            discounts = JSON.parse( restaurantDiscount.discount_json );

            filteredDiscount = discounts.find( ( discount ) =>
            {
                const discountStartTime = discount.start_time;
                const discountEndTime = discount.end_time;

                return (
                    start_time == discountStartTime && end_time == discountEndTime
                );
            } );

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

            coupons = await db.coupons.findOne( {
                where: { id: coupon_id, status: "active" }
            } );

            if ( coupons )
            {
                coupon_discount = coupons.discount;
            }

            convinenceFee = await db.configurations.findOne( { where: { type: 'convinence_fee' }, attributes: [ 'value' ] } );
            GST = await db.configurations.findOne( { where: { type: 'gst' }, attributes: [ 'value' ] } );
            convin_fee = convinenceFee.value;
            gstDis = GST.value;

            convenienceRate = bill_amount * convin_fee / 100;
            dis_to_customer = ( bill_amount * discount / 100 );
            com_by_admin = ( bill_amount * discount_commision / 100 ) + convenienceRate;
            gstRate = com_by_admin * gstDis / 100;
            gstAmt = com_by_admin + gstRate;

            magic_coupon_amount = bill_amount * coupon_discount / 100;

            discountGiven = dis_to_customer + magic_coupon_amount;

            dis_by_res = ( bill_amount * discount_commision / 100 ) + discountGiven;

            pay_by_customer = ( bill_amount - discountGiven ) + convenienceRate;
            givenToRes = pay_by_customer - com_by_admin - gstRate;

            data = await db.orders.create( {
                user_id: restaurant.user_id,
                restaurant_id: restaurant_id,
                customer_id: customer_id,
                order_date: Date.now(),
                transaction_id: generateTransactionId(),
                bill_amount: parseFloat( bill_amount ),
                discount_from_restaurant: parseFloat( discount_from_restaurant ),
                discount_to_customer: parseFloat( discount ),
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
                order_timing: order_timing,
                is_paid: true
            } );
        } else if ( type === "FAIL" )
        {
            paymentOrder = await db.payment_orders.findOne( {
                where: { order_id: payment_order_id }
            } );

            if ( !paymentOrder )
            {
                return getErrorResult( res, 404, `Payment order not found with order id ${ payment_order_id } ` );
            }
            paymentOrderId = paymentOrder.id;
            // customer_id = paymentOrder.customer_id;
            restaurant_id = paymentOrder.restaurant_id;
            bill_amount = paymentOrder.bill_amount;
            order_timing = paymentOrder.order_timing;
            discount = paymentOrder.discount;
            coupon_id = paymentOrder.coupon_id;

            const [ orderStartTime, orderEndTime ] = order_timing.split( '-' );

            const start_time = orderStartTime;
            const end_time = orderEndTime;

            customer = await db.customer.findOne( { where: { id: customer_id } } );

            if ( !customer )
            {
                return getErrorResult( res, 404, `Customer not found with customer id ${ customer_id }` );
            }

            restaurant = await db.restaurants.findOne( { where: { id: restaurant_id, is_delete: false } } );
            if ( !restaurant )
            {
                return getErrorResult( res, 404, `Restaurant not found with restaurant id ${ restaurant_id }` );
            }

            restaurantDiscount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id } } );

            discounts = JSON.parse( restaurantDiscount.discount_json );

            filteredDiscount = discounts.find( ( discount ) =>
            {
                const discountStartTime = discount.start_time;
                const discountEndTime = discount.end_time;

                return (
                    start_time == discountStartTime && end_time == discountEndTime
                );
            } );

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

            coupons = await db.coupons.findOne( {
                where: { id: coupon_id, status: "active" }
            } );

            if ( coupons )
            {
                coupon_discount = coupons.discount;
            }

            convinenceFee = await db.configurations.findOne( { where: { type: 'convinence_fee' }, attributes: [ 'value' ] } );
            GST = await db.configurations.findOne( { where: { type: 'gst' }, attributes: [ 'value' ] } );
            convin_fee = convinenceFee.value;
            gstDis = GST.value;

            convenienceRate = bill_amount * convin_fee / 100;
            dis_to_customer = ( bill_amount * discount / 100 );

            com_by_admin = ( bill_amount * discount_commision / 100 ) + convenienceRate;
            gstRate = com_by_admin * gstDis / 100;
            gstAmt = com_by_admin + gstRate;

            magic_coupon_amount = bill_amount * coupon_discount / 100;

            discountGiven = dis_to_customer + magic_coupon_amount;

            dis_by_res = ( bill_amount * discount_commision / 100 ) + discountGiven;

            pay_by_customer = ( bill_amount - discountGiven ) + convenienceRate;
            givenToRes = pay_by_customer - com_by_admin - gstRate;

            data = await db.orders.create( {
                user_id: restaurant.user_id,
                restaurant_id: restaurant_id,
                customer_id: customer_id,
                order_date: Date.now(),
                transaction_id: generateTransactionId(),
                bill_amount: parseFloat( bill_amount ),
                discount_from_restaurant: parseFloat( discount_from_restaurant ),
                discount_to_customer: parseFloat( discount ),
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
                order_timing: order_timing,
                is_paid: false
            } );
        } else
        {
            return getErrorResult( res, 404, 'Invalid type' );
        }

        return getResult( res, 200, data, "Order created successfully" );
    } catch ( err )
    {
        console.error( "err in webhooks events : ", err );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    };
};