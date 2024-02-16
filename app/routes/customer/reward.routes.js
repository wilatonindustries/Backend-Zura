const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const rewardController = require( "../../controllers/customer/reward.controller" );

    const rewardRouter = require( "express" ).Router();

    rewardRouter.get( "/", rewardController.reward );

    app.use( '/api/customer/reward', [ customerVerify.verifyAccessToken ], rewardRouter );
};
