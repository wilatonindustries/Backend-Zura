const { authVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const orderListController = require( "../../controllers/restaurant/orderList.controller" );

    const orderListRouter = require( "express" ).Router();

    orderListRouter.post( "/order-list", orderListController.getOrderList );

    app.use( '/api/user/restaurant', [ authVerify.verifyAccessToken ], orderListRouter )
};
