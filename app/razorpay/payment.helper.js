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
        const options = {
            amount: amount * 100,
            currency: config.razorpay.currency,
        };
        const paymentIntent = await rzp.orders.create( options );
        return paymentIntent;
    } catch ( error )
    {
        console.error( 'Error creating payment intent:', error );
        throw error;
    }
}