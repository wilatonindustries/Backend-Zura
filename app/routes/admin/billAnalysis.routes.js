const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const billsController = require( "../../controllers/admin/billAnalysis.controller" );

    const billsRouter = require( "express" ).Router();

    billsRouter.post( "/analysis", billsController.billAnalysis );

    billsRouter.get( "/total/analysis", billsController.countBillAnalysis );

    app.use( '/api/admin/bill', [ adminVerify.verifyAccessToken ], billsRouter );
};
