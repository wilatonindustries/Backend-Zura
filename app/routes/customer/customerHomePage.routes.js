const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const customerHomePagesController = require( "../../controllers/customer/customerHomePages.controllers" );

    const customerHomePagesRouter = require( "express" ).Router();

    customerHomePagesRouter.get( "/", customerHomePagesController.getCustomerHomePage );

    customerHomePagesRouter.post( "/search-restaurant", customerHomePagesController.searchRestaurant );

    app.use( '/api/customer/home-page', customerHomePagesRouter );
};
