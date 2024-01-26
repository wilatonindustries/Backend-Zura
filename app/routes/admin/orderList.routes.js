const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const orderListController = require( "../../controllers/admin/orderList.controller" );

    const orderListRouter = require( "express" ).Router();

    orderListRouter.post( "/list", orderListController.orderList );

    app.use( '/api/admin/orders', [ adminVerify.verifyAccessToken ], orderListRouter )
};
