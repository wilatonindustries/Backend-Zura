const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { paymentIntent } = require( '../../razorpay/payment.helper' );
const config = require( '../../config/config' );

exports.paymentSummery = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { bill_amount, startTime, endTime } = req.body;

        const restaurant = await db.restaurants.findOne( {
            where: { id },
            include: [ {
                model: db.restaurant_discounts,
                as: 'discounts',
                attributes: [ 'discount_json' ],
            } ],
        } );

        if ( !restaurant )
        {
            return getErrorResult( res, 404, `restaurant not found with id ${ id } ` );
        } else
        {
            const discounts = JSON.parse( restaurant.discounts.discount_json );

            discounts.forEach( ( discount ) =>
            {
                discount.start_time = discount[ 'start_time ' ].trim();
                delete discount[ 'start_time ' ];
            } );

            const filteredDiscount = discounts.find( ( discount ) =>
            {
                return (
                    moment( discount.start_time, 'hh:mma' ).isSame( moment( startTime, 'hh:mma' ) ) &&
                    moment( discount.end_time, 'hh:mma' ).isSame( moment( endTime, 'hh:mma' ) )
                );
            } );
            let discountPercentage;
            if ( filteredDiscount )
            {
                discountPercentage = filteredDiscount.discount_percentage;
            } else
            {
                console.error( 'payment is NOT within discount time range.' );
                return getErrorResult( res, 500, 'Something went wrong. No applicable discount found.' );
            }

            const discountedAmount = bill_amount - ( bill_amount * discountPercentage ) / 100;

            const razorpayResponse = await paymentIntent( discountedAmount );
            const paymentIntentId = razorpayResponse.id;
            const paymentLink = `https://api.razorpay.com/v1/checkout.js?key=${ config.razorpay.key_id }&order_id=${ paymentIntentId }`;

            const data = {
                store_name: restaurant.store_name,
                bill_amount: bill_amount,
                discount_percentage: discountPercentage,
                pay_bill_amount: discountedAmount,
                razorpay_payment_link: paymentLink,
            };

            return getResult( res, 200, data, "payment summary fetched successfully." );
        }
    } catch ( error )
    {
        console.error( "error in payment summary : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
