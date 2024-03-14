const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const orderController = require( "../../controllers/customer/orders.controller" );

    const orderRouter = require( "express" ).Router();

    orderRouter.get( "/", orderController.getAllOrders );

    app.use( '/api/customer/order', [ customerVerify.verifyAccessToken ], orderRouter );
};
