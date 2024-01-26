const { customerVerify } = require( "../../middlewares" );

module.exports = app =>
{
    const exploreController = require( "../../controllers/customer/explore.controller" );

    const exploreRouter = require( "express" ).Router();

    exploreRouter.post( "/restaurant-list", exploreController.restaurantList );

    exploreRouter.get( "/get-restaurant/:id", exploreController.getRestaurantDetailsById );

    app.use( '/api/customer/explore', exploreRouter )
};
