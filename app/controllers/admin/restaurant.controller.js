const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const { defaultDiscount } = require( "./restaurantDiscounts.controller" );

exports.createRestaurant = async ( req, res ) =>
{
    try
    {
        const { owner_name, owner_mobile, restaurantData, bankAccountDetails, discountData } = req.body;

        if ( owner_mobile.length === 10 )
        {
            const mobileExistOrNot = await db.user.findOne( { where: { owner_mobile } } );
            if ( mobileExistOrNot )
            {
                return getErrorResult( res, 403, 'owner already exists .' );
            }

            const owner = await db.user.create( { owner_name, owner_mobile, is_accept: true } );

            const category = await db.categories.findAll();
            if ( category.length === 0 )
            {
                return getErrorResult( res, 404, 'category not found.' );
            } else
            {
                if ( bankAccountDetails )
                {
                    if ( bankAccountDetails.account_number )
                    {
                        const existingBankDetails = await db.restaurant_bank_account_details.findOne( {
                            where: {
                                account_number: bankAccountDetails.account_number
                            }
                        } );
                        if ( existingBankDetails )
                        {
                            return getErrorResult( res, 403, 'Bank account number already exists.' );
                        }
                    }
                }
                const createdRestaurant = await db.restaurants.create( {
                    user_id: owner.id,
                    ...restaurantData
                } );

                const createdBankDetails = await db.restaurant_bank_account_details.create( {
                    user_id: owner.id,
                    restaurant_id: createdRestaurant.id,
                    ...( bankAccountDetails ? { bankAccountDetails } : {} ),
                } );

                const createDoc = await db.restaurant_documents.create( {
                    user_id: owner.id,
                    restaurant_id: createdRestaurant.id,
                } );

                const createProfile = await db.restaurant_profile_photos.create( {
                    user_id: owner.id,
                    restaurant_id: createdRestaurant.id,
                } );

                let createDiscount;
                if ( discountData )
                {
                    createDiscount = await db.restaurant_discounts.create( {
                        user_id: owner.id,
                        restaurant_id: createdRestaurant.id,
                        discount_json: JSON.stringify( discountData ),
                    } );
                } else
                {
                    discount = defaultDiscount();
                    createDiscount = await db.restaurant_discounts.create( {
                        user_id: owner.id,
                        restaurant_id: createdRestaurant.id,
                        discount_json: JSON.stringify( discount ),
                    } );
                }

                const data = {
                    owner: owner,
                    restaurant: createdRestaurant,
                    bank_details: createdBankDetails,
                    discount: createDiscount,
                    document: createDoc,
                    profile_photos: createProfile
                };

                return getResult( res, 200, data, "restaurant created successfully." );
            }

        } else
        {
            return getErrorResult( res, 400, 'Mobile number must be exactly 10 digits.' );
        }
    } catch ( error )
    {
        console.error( "error in creating restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.restaurantList = async ( req, res ) =>
{
    try
    {
        const { store_name, filter } = req.body;

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
                store_name
            };
            restaurants = await db.restaurants.findAll( orderOptions );
            restaurants.forEach( ( store ) =>
            {
                const owner = store.user;
                storeList.push( {
                    store_id: store.id,
                    store_name: store.store_name,
                    owner_name: owner.owner_name,
                } );
            } );
        } else if ( filter )
        {
            const [ startDate, endDate ] = getDataForFilter( filter );
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
                    store_id: store.id,
                    store_name: store.store_name,
                    owner_name: owner.owner_name,
                } );
            } );
        } else
        {
            restaurants = await db.restaurants.findAll( orderOptions );
            restaurants.forEach( ( store ) =>
            {
                const owner = store.user;
                storeList.push( {
                    store_id: store.id,
                    store_name: store.store_name,
                    owner_name: owner.owner_name,
                } );
            } );
        }
        const data = {
            total_store,
            store_list: storeList
        };
        return getResult( res, 200, data, "store list fetched successfully." );
    } catch ( err )
    {
        console.error( "err in fetch store list : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.getAllRestaurant = async ( req, res ) =>
{
    await db.restaurants.findAll( {
        include: [
            { model: db.user, as: 'user' },
            { model: db.restaurant_bank_account_details, as: 'bank_details' },
            { model: db.restaurant_documents, as: 'documents' },
            { model: db.restaurant_profile_photos, as: 'profile_photos' },
            { model: db.restaurant_discounts, as: 'discounts' }
        ]
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "fetch all restaurants successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in fetch all restaurants : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.getRestaurantById = async ( req, res ) =>
{
    const id = req.params.id;

    await db.restaurants.findOne( {
        where: { id },
        include: [
            { model: db.user, as: 'user' },
            { model: db.restaurant_bank_account_details, as: 'bank_details' },
            { model: db.restaurant_documents, as: 'documents' },
            { model: db.restaurant_profile_photos, as: 'profile_photos' },
            { model: db.restaurant_discounts, as: 'discounts' }
        ]
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "fetch restaurants successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in fetch restaurants : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.updateRestaurant = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;

        const { restaurantData, bankAccountDetails, discountData } = req.body;

        const category = await db.categories.findAll();
        if ( category.length === 0 )
        {
            return getErrorResult( res, 404, 'category not found.' );
        } else
        {
            const restaurant = await db.restaurants.findOne( { where: { id } } );
            if ( !restaurant )
            {
                return getErrorResult( res, 404, `restaurant not found with id ${ id }` );
            }

            const bankDetail = await db.restaurant_bank_account_details.findOne( {
                where: {
                    restaurant_id: restaurant.id
                }
            } );
            if ( !bankDetail )
            {
                return getErrorResult( res, 404, `restaurant not found with restaurant id ${ restaurant.id }` );
            }
            let updatedRestaurant;
            if ( restaurantData )
            {
                updatedRestaurant = await db.restaurants.update( {
                    ...restaurantData
                }, {
                    where: {
                        id,
                    }
                } );
            }

            let updatedBankDetails;
            if ( bankAccountDetails )
            {
                if ( bankAccountDetails.account_number )
                {
                    const existingBankDetails = await db.restaurant_bank_account_details.findOne( {
                        where: {
                            account_number: bankAccountDetails.account_number,
                            restaurant_id: {
                                [ db.Op.ne ]: id
                            }
                        }
                    } );
                    if ( existingBankDetails )
                    {
                        return getErrorResult( res, 403, 'Bank account number already exists.' );
                    }
                }
                updatedBankDetails = await db.restaurant_bank_account_details.update( {
                    ...bankAccountDetails
                }, {
                    where: {
                        restaurant_id: restaurant.id
                    }
                } );
            }

            let updateDis;
            if ( discountData )
            {
                updateDis = await db.restaurant_discounts.update( {
                    discount_json: JSON.stringify( discountData ),
                }, {
                    where: {
                        is_changes_accept: true,
                        restaurant_id: restaurant.id
                    }
                } );
            }
            const data = {
                restaurant: updatedRestaurant,
                bank_details: updatedBankDetails,
                discounts: updateDis,
            };

            return getResult( res, 200, data, "restaurant updated successfully." );
        }
    } catch ( error )
    {
        console.error( "error in updating restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.updateOwner = async ( req, res ) =>
{
    try
    {
        const { owner_name, owner_mobile, user_id } = req.body;

        const userAuth = await db.user.findOne( { where: { id: user_id } } );
        if ( userAuth )
        {
            if ( userAuth.email === null )
            {
                let updateUser = await db.user.update( {
                    owner_name: owner_name,
                    owner_mobile: owner_mobile,
                    is_profile_updated: true
                },
                    {
                        where: {
                            id: user_id
                        }
                    } );
                if ( !updateUser )
                {
                    return getErrorResult( res, 500, 'somthing went wrong.' );
                }
            } else
            {
                let updateUser = await db.user.update( {
                    owner_name: owner_name,
                    owner_mobile: owner_mobile,
                    is_profile_updated: true,
                },
                    {
                        where: {
                            id: user_id
                        }
                    } );
                if ( !updateUser )
                {
                    return getErrorResult( res, 500, 'somthing went wrong.' );
                }
            }
        }
        return getResult( res, 200, 1, "owner updated successfully." );
    } catch ( error )
    {
        console.error( "error in update owner : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    };
};

exports.deleteRestaurantById = async ( req, res ) =>
{
    const id = req.params.id;

    const restaurant = await db.restaurants.findOne( { where: { id } } );
    if ( !restaurant )
    {
        return getErrorResult( res, 404, `restaurant not found with id ${ id }` );
    }

    await db.restaurant_bank_account_details.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } );
    await db.restaurant_profile_photos.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } );
    await db.restaurant_documents.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } );
    await db.restaurant_discounts.destroy( {
        where: { id, restaurant_id: restaurant.id },
    } );
    await db.restaurants.destroy( {
        where: { id },
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "restaurant deleted successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in delete restaurant : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};