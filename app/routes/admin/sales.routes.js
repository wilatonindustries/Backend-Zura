const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const totalSalesController = require( "../../controllers/admin/sales.controller" );

    const totalSalesRouter = require( "express" ).Router();

    totalSalesRouter.post( "/total", totalSalesController.totalSalesWithFilter );

    app.use( '/api/admin/sales', [ adminVerify.verifyAccessToken ], totalSalesRouter );
};