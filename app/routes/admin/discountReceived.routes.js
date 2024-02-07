const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const disReceivedController = require( "../../controllers/admin/discountReceived.controller" );

    const disReceivedRouter = require( "express" ).Router();

    disReceivedRouter.post( "/received", disReceivedController.totalDiscountReceivedWithFilter );

    app.use( '/api/admin/discount', [ adminVerify.verifyAccessToken ], disReceivedRouter );
};