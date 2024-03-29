const express = require( "express" );
const bodyParser = require( "body-parser" );
const cors = require( "cors" );
const config = require( "./app/config/config.js" );
const { createAdmin } = require( "./app/controllers/admin/auth.controller.js" );
require( './app/cronjob/cron.js' );

const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use( cors() );

// parse requests of content-type - application/json
app.use( bodyParser.json() );

// parse requests of content-type - application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( "/uploads", express.static( "assets/uploads" ) );

// database
const db = require( "./app/models" );
db.sequelize.sync().then( async () =>
{
  console.log( 'database connected !' );
  const adminCount = await db.admin.count();

  if ( adminCount === 0 )
  {
    createAdmin()
      .then( () =>
      {
        console.log( 'Admin creation check completed successfully.' );
      } )
      .catch( ( error ) =>
      {
        console.error( 'Error during admin creation check:', error );
      } );
  }
} );


// api routes
require( "./app/routes/admin/auth.routes.js" )( app );
require( "./app/routes/admin/categories.routes.js" )( app );
require( "./app/routes/admin/banners.routes.js" )( app );
require( "./app/routes/admin/customerList.routes.js" )( app );
require( "./app/routes/admin/earnings.routes.js" )( app );
require( "./app/routes/admin/gst.routes.js" )( app );
require( "./app/routes/admin/ownerProfileList.routes.js" )( app );
require( "./app/routes/admin/orderList.routes.js" )( app );
require( "./app/routes/admin/restaurant.routes.js" )( app );
require( "./app/routes/admin/restaurantDocuments.routes.js" )( app );
require( "./app/routes/admin/restaurantProfilePhotos.routes.js" )( app );
require( "./app/routes/admin/restaurantDiscounts.routes.js" )( app );
require( "./app/routes/admin/coupon.routes.js" )( app );
require( "./app/routes/admin/dashboard.routes.js" )( app );
require( "./app/routes/admin/sales.routes.js" )( app );
require( "./app/routes/admin/discountReceived.routes.js" )( app );
require( "./app/routes/admin/rewardGivenCustomer.routes.js" )( app );
require( "./app/routes/admin/storeShareGiven.routes.js" )( app );
require( "./app/routes/admin/billAnalysis.routes.js" )( app );
require( "./app/routes/admin/restaurantPayoutsHistories.routes.js" )( app );
require( "./app/routes/admin/timingBanners.routes.js" )( app );
require( "./app/routes/admin/configurations.routes.js" )( app );
require( "./app/routes/admin/staticComponents.routes.js" )( app );
require( "./app/routes/admin/socialMedias.routes.js" )( app );

require( "./app/routes/restaurant/auth.routes.js" )( app );
require( "./app/routes/restaurant/orderList.routes.js" )( app );
require( "./app/routes/restaurant/earnings.routes.js" )( app );
require( "./app/routes/restaurant/sales.routes.js" )( app );
require( "./app/routes/restaurant/homePage.routes.js" )( app );
require( "./app/routes/restaurant/discountRates.routes.js" )( app );

require( "./app/routes/customer/auth.routes.js" )( app );
require( "./app/routes/customer/customerHomePage.routes.js" )( app );
require( "./app/routes/customer/explore.routes.js" )( app );
require( "./app/routes/customer/payment.routes.js" )( app );
require( "./app/routes/customer/order.routes.js" )( app );
require( "./app/routes/customer/reward.routes.js" )( app );
require( "./app/routes/customer/coupon.routes.js" )( app );
require( "./app/routes/customer/staticComponents.routes.js" )( app );
require( "./app/routes/customer/socialMedias.routes.js" )( app );
require( "./app/routes/customer/timingBanners.routes.js" )( app );

// set port, listen for requests
const PORT = config.PORT;
app.listen( PORT, () =>
{
  console.log( `Server is running on port ${ PORT }` );
} );

