const { adminVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const customerRewardController = require( "../../controllers/admin/rewardGivenCustomer.controller" );

    const customerRewardRouter = require( "express" ).Router();

    customerRewardRouter.post( "/reward", customerRewardController.totalRewardGivenToCustomerWithFilter );

    app.use( '/api/admin/customer', [ adminVerify.verifyAccessToken ], customerRewardRouter );
};