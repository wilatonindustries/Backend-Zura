const { authVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const homePageController = require( "../../controllers/restaurant/homePage.controller" );

    const homePageRouter = require( "express" ).Router();

    homePageRouter.get( "/", homePageController.homePage );

    app.use( '/api/user/restaurant/home-page', [ authVerify.verifyAccessToken ], homePageRouter )
};