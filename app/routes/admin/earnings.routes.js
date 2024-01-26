const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const earningController = require( "../../controllers/admin/earnings.controller" );

    const earningRouter = require( "express" ).Router();

    earningRouter.post( "/total", earningController.totalEarningsWithFilter );

    app.use( '/api/admin/earnigs', [ adminVerify.verifyAccessToken ], earningRouter )
};