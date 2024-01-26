const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const paymentController = require( "../../controllers/customer/payment.controller" );

    const paymentRouter = require( "express" ).Router();

    paymentRouter.post( "/:id", paymentController.paymentSummery );

    app.use( '/api/customer/payment', [ customerVerify.verifyAccessToken ], paymentRouter )
};
