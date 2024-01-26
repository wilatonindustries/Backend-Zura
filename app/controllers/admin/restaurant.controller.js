const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );

exports.createRestaurant = async ( req, res ) =>
{
    try
    {
        const { owner_name, owner_mobile, restaurantData, bankAccountDetails } = req.body;

        if ( owner_mobile.length === 10 )
        {
            const mobileExistOrNot = await db.user.findOne( { where: { owner_mobile } } );
            if ( mobileExistOrNot )
            {
                return getErrorResult( res, 400, 'owner already exists .' );
            }

            const owner = await db.user.create( { owner_name, owner_mobile } )

            const getRestaurant = await db.restaurants.findAll( { where: { user_id: owner.id } } )

            if ( getRestaurant.length === 0 )
            {
                const category = await db.categories.findAll()
                if ( category.length === 0 )
                {
                    return getErrorResult( res, 404, 'category not found.' )
                } else
                {
                    const existingBankDetails = await db.restaurant_bank_account_details.findOne( {
                        where: {
                            account_number: bankAccountDetails.account_number
                        }
                    } );
                    if ( existingBankDetails )
                    {
                        return getErrorResult( res, 400, 'Bank account number already exists.' );
                    }

                    const createdRestaurant = await db.restaurants.create( {
                        user_id: owner.id,
                        ...restaurantData
                    } );

                    const createdBankDetails = await db.restaurant_bank_account_details.create( {
                        user_id: owner.id,
                        restaurant_id: createdRestaurant.id,
                        ...bankAccountDetails
                    } );

                    await db.restaurant_documents.create( {
                        user_id: owner.id,
                        restaurant_id: createdRestaurant.id,
                    } );

                    await db.restaurant_profile_photos.create( {
                        user_id: owner.id,
                        restaurant_id: createdRestaurant.id,
                    } );

                    await db.restaurant_discounts.create( {
                        user_id: owner.id,
                        restaurant_id: createdRestaurant.id,
                    } );

                    const data = {
                        owner: owner,
                        restaurant: createdRestaurant,
                        bank_details: createdBankDetails,
                    };

                    return getResult( res, 200, data, "restaurant created successfully." )
                }
            } else
            {
                return getErrorResult( res, 400, `restaurant already exists with user id ${ owner.id }.` );
            }
        } else
        {
            return getErrorResult( res, 400, 'Mobile number must be exactly 10 digits.' )
        }
    } catch ( error )
    {
        console.log( "error in creating restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.restaurantList = async ( req, res ) =>
{
    try
    {
        const { store_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );
        let restaurants, storeList = [];
        const total_store = await db.restaurants.count();
        const orderOptions = {
            include: [
                {
                    model: db.user,
                    attributes: [ "id" ],
                    as: "user",
                    attributes: [ 'id', 'owner_name' ]
                }
            ],
            attributes: [ 'id', 'store_name' ]
        };

        if ( store_name )
        {
            orderOptions.where = {
                store_name,
                createdAt: {
                    [ db.Op.between ]: [ startDate, endDate ]
                }
            };
            restaurants = await db.restaurants.findAll( orderOptions );
            restaurants.forEach( ( store ) =>
            {
                const owner = store.user;
                storeList.push( {
                    store_name: store.store_name,
                    owner_name: owner.owner_name,
                } );
            } );
        } else
        {
            orderOptions.where = {
                createdAt: {
                    [ db.Op.between ]: [ startDate, endDate ]
                }
            };
            restaurants = await db.restaurants.findAll( orderOptions );
            restaurants.forEach( ( store ) =>
            {
                const owner = store.user;
                storeList.push( {
                    store_name: store.store_name,
                    owner_name: owner.owner_name,
                } );
            } );
        }
        const data = {
            total_store,
            store_list: storeList
        }
        return getResult( res, 200, data, "store list fetched successfully." )
    } catch ( err )
    {
        console.log( "err in fetch store list : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.getAllRestaurant = async ( req, res ) =>
{
    await db.restaurants.findAll( {
        include: [
            { model: db.restaurant_bank_account_details, as: 'bank_details' },
            { model: db.restaurant_documents, as: 'documents' },
            { model: db.restaurant_profile_photos, as: 'profile_photos' },
            { model: db.restaurant_discounts, as: 'discounts' }
        ]
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "fetch all restaurants successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in fetch all restaurants : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
}

exports.getRestaurantById = async ( req, res ) =>
{
    const id = req.params.id;

    const restaurant = await db.restaurants.findOne( { where: { id } } )

    await db.restaurants.findOne( {
        where: { id },
        include: [
            { model: db.restaurant_bank_account_details, as: 'bank_details' },
            { model: db.restaurant_documents, as: 'documents' },
            { model: db.restaurant_profile_photos, as: 'profile_photos' },
            { model: db.restaurant_discounts, as: 'discounts' }
        ]
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "fetch restaurants successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in fetch restaurants : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
}

exports.updateRestaurant = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;

        const { restaurantData, bankAccountDetails } = req.body;

        const category = await db.categories.findAll()
        if ( category.length === 0 )
        {
            return getErrorResult( res, 404, 'category not found.' )
        } else
        {
            const restaurant = await db.restaurants.findOne( { where: { id } } )
            if ( !restaurant )
            {
                return getErrorResult( res, 404, `restaurant not found with id ${ id }` )
            }

            const bankDetail = await db.restaurant_bank_account_details.findOne( {
                where: {
                    restaurant_id: restaurant.id
                }
            } )
            if ( !bankDetail )
            {
                return getErrorResult( res, 404, `restaurant not found with restaurant id ${ restaurant.id }` )
            }

            const existingBankDetails = await db.restaurant_bank_account_details.findOne( {
                where: {
                    account_number: bankAccountDetails.account_number
                }
            } );
            if ( existingBankDetails )
            {
                return getErrorResult( res, 400, 'Bank account number already exists.' );
            }

            const updatedRestaurant = await db.restaurants.update( {
                ...restaurantData
            }, {
                where: {
                    id,
                }
            } );

            const updatedBankDetails = await db.restaurant_bank_account_details.update( {
                ...bankAccountDetails
            }, {
                where: {
                    restaurant_id: restaurant.id
                }
            } );

            const data = {
                restaurant: updatedRestaurant,
                bank_details: updatedBankDetails,
            };

            return getResult( res, 200, data, "restaurant updated successfully." )
        }
    } catch ( error )
    {
        console.log( "error in updating restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.deleteRestaurantById = async ( req, res ) =>
{
    const id = req.params.id;

    const restaurant = await db.restaurants.findOne( { where: { id } } )
    if ( !restaurant )
    {
        return getErrorResult( res, 404, `restaurant not found with id ${ id }` )
    }

    await db.restaurant_bank_account_details.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } )
    await db.restaurant_profile_photos.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } )
    await db.restaurant_documents.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } )
    await db.restaurant_discounts.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } )
    await db.restaurants.destroy( {
        where: { id },
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "restaurant deleted successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in delete restaurant : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
};