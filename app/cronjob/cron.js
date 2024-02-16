const cron = require( 'node-cron' );
const { autoPayout } = require( '../controllers/customer/payment.controller' );

cron.schedule( '0 22 * * *', async () =>
{
    try
    {
        await autoPayout();
    } catch ( error )
    {
        console.error( "Error in auto payout cron job: ", error );
    }
} );
