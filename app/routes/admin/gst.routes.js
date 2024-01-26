const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const gstController = require( "../../controllers/admin/gst.controller" );

    const gstRouter = require( "express" ).Router();

    gstRouter.post( "/bill-total", gstController.totalGstBillWithFilter );

    app.use( '/api/admin/gst', [ adminVerify.verifyAccessToken ], gstRouter )
};