const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const customerController = require( "../../controllers/admin/customerList.controller" );

    const customerRouter = require( "express" ).Router();

    customerRouter.post( "/list", customerController.customerList );

    app.use( '/api/admin/customer', [ adminVerify.verifyAccessToken ], customerRouter )
};