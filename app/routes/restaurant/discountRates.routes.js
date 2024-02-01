const { authVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const discountRateController = require( "../../controllers/restaurant/discountRates.controller" );

    const discontRateRouter = require( "express" ).Router();

    discontRateRouter.post( "/discount-rates", discountRateController.getDiscountRates );

    discontRateRouter.put( "/discount-rates", discountRateController.updateDiscountRates );

    app.use( '/api/user/restaurant', [ authVerify.verifyAccessToken ], discontRateRouter );
};
