const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.restaurantList = async ( req, res ) =>
{
    try
    {
        let storeList = [];
        const percentage_owner_req = await db.restaurant_discounts.count( { where: { is_changes_accept: true } } );

        const restaurantsDis = await db.restaurant_discounts.findAll( {
            where: { is_changes_accept: true },
            include: [
                {
                    model: db.restaurants,
                    as: "restaurant",
                    attributes: [ 'id', 'store_name' ],
                    include: [
                        {
                            model: db.user,
                            attributes: [ "id" ],
                            as: "user",
                            attributes: [ 'id', 'owner_name' ]
                        } ]
                },
            ],
            attributes: [ 'id' ]
        } );
        restaurantsDis.forEach( ( store ) =>
        {
            const restaurant = store.restaurant;
            if ( restaurant && restaurant.user )
            {
                const owner = restaurant.user;
                storeList.push( {
                    store_id: restaurant?.id || null,
                    store_name: restaurant?.store_name || '',
                    owner_name: owner?.owner_name || '',
                } );
            }
        } );

        const data = {
            percentage_owner_req,
            store_list: storeList
        };
        return getResult( res, 200, data, "store list fetched successfully." );
    } catch ( err )
    {
        console.error( "err in fetch store list : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.updateDiscount = async ( req, res ) =>
{
    try
    {
        const { restaurant_id, changes_discount_json } = req.body;

        const restaurant = await db.restaurants.findOne( { where: { id: restaurant_id } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 400, `restaurant not found with id ${ restaurant_id }.` );
        }

        if ( changes_discount_json )
        {
            await db.restaurant_discounts.update( {
                discount_json: changes_discount_json ? JSON.stringify( changes_discount_json ) : '',
                changes_discount_json: null,
                is_changes_accept: false
            }, {
                where: {
                    user_id: restaurant.user_id, restaurant_id: restaurant.id
                }
            } );
        } else
        {
            await db.restaurant_discounts.update( {
                changes_discount_json: null,
                is_changes_accept: false
            }, {
                where: {
                    user_id: restaurant.user_id, restaurant_id: restaurant.id
                }
            } );
        }

        const discount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id } } );
        return getResult( res, 200, discount, "restaurant discount updated successfully." );
    } catch ( err )
    {
        console.error( "err in update restaurant discount : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};