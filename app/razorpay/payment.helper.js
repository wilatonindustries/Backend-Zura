const config = require( "../config/config" );
const razorpay = require( 'razorpay' );

const rzp = new razorpay( {
    key_id: config.razorpay.key_id,
    key_secret: config.razorpay.key_secret,
} );

exports.paymentIntent = async ( amount ) =>
{
    try
    {
        const paymentIntent = await rzp.orders.create( {
            amount: amount * 100,
            currency: config.razorpay.currency,
            payment_capture: true
        } );

        return paymentIntent;
    } catch ( error )
    {
        console.error( 'Error creating payment intent:', error );
        throw error;
    }
};