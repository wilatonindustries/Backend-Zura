const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const paymentController = require( "../../controllers/customer/payment.controller" );
    const handlerController = require( "../../controllers/customer/paymentHandler.controller" );

    const paymentRouter = require( "express" ).Router();

    paymentRouter.post( "/body-encrypt", paymentController.orderBodyEncrypt );

    paymentRouter.post( "/order", paymentController.paymentOrderSummery );

    paymentRouter.post( "/handler", handlerController.paymentHandler );

    app.use( '/api/customer/payment', [ customerVerify.verifyAccessToken ], paymentRouter );
};
