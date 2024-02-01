const { adminVerify } = require( "../../middlewares" );


module.exports = app =>
{
    const restaurantController = require( "../../controllers/admin/restaurant.controller" );

    const restaurantRouter = require( "express" ).Router();

    restaurantRouter.put( "/owner/update", restaurantController.updateOwner );

    restaurantRouter.post( "/", restaurantController.createRestaurant );

    restaurantRouter.post( "/list", restaurantController.restaurantList );

    restaurantRouter.get( "/", restaurantController.getAllRestaurant );

    restaurantRouter.get( "/:id", restaurantController.getRestaurantById );

    restaurantRouter.put( "/:id", restaurantController.updateRestaurant );

    restaurantRouter.delete( "/:id", restaurantController.deleteRestaurantById );


    app.use( '/api/admin/store', [ adminVerify.verifyAccessToken ], restaurantRouter );
};
