const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { paymentIntent } = require( '../../razorpay/payment.helper' );
const config = require( '../../config/config' );
const { decryptdata, encryptData } = require( '../../utils/helper' );

exports.orderBodyEncrypt = async ( req, res ) =>
{
    try
    {
        const { customer_id, restaurant_id, bill_amount, order_timing, discount, coupon_id } = req.body;
        const data = { customer_id, restaurant_id, bill_amount, order_timing, discount, coupon_id };
        const encryptedData = await encryptData( JSON.stringify( data ) );
        return getResult( res, 200, encryptedData, "Payment's body encrypted successfully" );
    } catch ( error )
    {
        console.error( "error in payment body data encrypt : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    };

};

exports.paymentOrderSummery = async ( req, res ) =>
{
    try
    {
        const customer_id = req.customerId;
        const data = req.body;
        const decryptedData = await decryptdata( data.data );
        const parsedData = JSON.parse( decryptedData );
        const restaurant_id = parsedData.restaurant_id;
        const bill_amount = parsedData.bill_amount;
        const order_timing = parsedData.order_timing;
        const discount = parsedData.discount;
        const coupon_id = parsedData.coupon_id;

        const customer = await db.customer.findOne( { where: { id: customer_id } } );

        if ( !customer )
        {
            return getErrorResult( res, 404, `Customer not found with customer id ${ customer_id }` );
        }

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id, is_delete: false } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 404, `Restaurant not found with restaurant id ${ restaurant_id }` );
        }

        const convinenceFee = await db.configurations.findOne( { where: { type: 'convinence_fee' }, attributes: [ 'value' ] } );

        let discountedAmt = 0, magicCouponDiscountAmt = 0, coupon_discount = 0, convenience_fee = bill_amount * parseFloat( convinenceFee.value ) / 100;

        if ( coupon_id !== undefined )
        {
            const coupons = await db.coupons.findOne( {
                where: { id: coupon_id, status: "active" }
            } );

            if ( !coupons )
            {
                return getErrorResult( res, 404, `Coupons not found with coupon id ${ coupon_id }` );
            }
            coupon_discount = parseFloat( coupons.discount );
        }


        discountedAmt = bill_amount * discount / 100;


        magicCouponDiscountAmt = bill_amount * coupon_discount / 100;

        const payAmt = bill_amount - ( discountedAmt + magicCouponDiscountAmt ) + convenience_fee;

        // const rzpResponse = await paymentIntent( payAmt );

        const createPayment = await db.payment_orders.create( {
            customer_id: customer_id,
            restaurant_id: restaurant_id,
            bill_amount: bill_amount,
            pay_amount: payAmt,
            discount: discount,
            coupon_id: coupon_id ? coupon_id : null,
            order_timing: order_timing,
            order_id: new Date().getTime(),
        } );

        const responseData = {
            bill_amount: bill_amount,
            convenience_fee,
            discount: createPayment?.discount,
            magic_coupon_discount: coupon_discount,
            discount_amount: discountedAmt,
            magic_coupon_amount: magicCouponDiscountAmt,
            pay_amount: payAmt,
            payment_order_id: createPayment?.order_id
        };

        return getResult( res, 200, responseData, "Payment order created successfully" );
    } catch ( error )
    {
        console.error( "error in payment summary : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

exports.autoPayout = async () =>
{
    try
    {
        await db.orders.update( { is_paid: true }, {
            where: { is_paid: false }
        } );
        console.log( 'Automatic payout done' );
    } catch ( error )
    {
        console.error( "error in auto payment : ", error );
    }
};
