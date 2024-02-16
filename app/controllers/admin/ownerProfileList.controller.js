const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Op = db.Op;

exports.getOwnerProfileListWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, owner_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        const storeOwner = await db.user.count( { where: { is_accept: true, is_active: true } } );
        const ownerRequest = await db.user.count( { where: { is_accept: false } } );

        let ownerProfileList = [], ownerRequestList = [], ownersProfiles;

        if ( store_name && owner_name )
        {
            ownersProfiles = await db.user.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        as: "restaurant",
                        where: {
                            store_name: {
                                [ Op.like ]: `%${ store_name }%`
                            }
                        },
                        attributes: [ 'id', 'store_name' ]
                    }
                ],
                where: {
                    owner_name: {
                        [ Op.like ]: `%${ owner_name }%`
                    },
                    is_accept: true,
                    is_active: true,
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'id', 'owner_name', 'owner_mobile', 'is_accept' ]
            } );
            ownersProfiles.forEach( ( owner ) =>
            {
                const restaurant = owner.restaurant;
                ownerProfileList.push( {
                    owner_id: owner.id,
                    store_id: restaurant ? restaurant.id : null,
                    store_name: restaurant ? restaurant.store_name : '',
                    owner_name: owner.owner_name,
                    owner_mobile: owner.owner_mobile,
                    is_accept: owner.is_accept
                } );
            } );
        } else if ( owner_name )
        {
            ownersProfiles = await db.user.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        as: "restaurant",
                        attributes: [ 'id', 'store_name' ]
                    }
                ],
                where: {
                    owner_name: {
                        [ Op.like ]: `%${ owner_name }%`
                    },
                    is_accept: true,
                    is_active: true,
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'id', 'owner_name', 'owner_mobile', 'is_accept' ]
            } );
            ownersProfiles.forEach( ( owner ) =>
            {
                const restaurant = owner.restaurant;
                ownerProfileList.push( {
                    owner_id: owner.id,
                    store_id: restaurant ? restaurant.id : null,
                    store_name: restaurant ? restaurant.store_name : '',
                    owner_name: owner.owner_name,
                    owner_mobile: owner.owner_mobile,
                    is_accept: owner.is_accept
                } );
            } );
        } else if ( store_name )
        {
            const restaurants = await db.restaurants.findAll( {
                include: [
                    {
                        model: db.user,
                        as: "user",
                        where: {
                            is_accept: true,
                            is_active: true,
                            createdAt: {
                                [ db.Op.between ]: [ startDate, endDate ]
                            }
                        },
                        attributes: [ 'id', 'owner_name', 'owner_mobile', 'is_accept' ]
                    }
                ],
                where: {
                    store_name: {
                        [ Op.like ]: `%${ store_name }%`
                    }
                },
                attributes: [ 'id', 'store_name' ],
            } );
            restaurants.forEach( ( restaurant ) =>
            {
                const owner = restaurant.user;
                ownerProfileList.push( {
                    owner_id: owner.id,
                    store_id: restaurant ? restaurant.id : null,
                    store_name: restaurant ? restaurant.store_name : '',
                    owner_name: owner.owner_name,
                    owner_mobile: owner.owner_mobile,
                    is_accept: owner.is_accept
                } );
            } );
        } else
        {
            ownersProfiles = await db.user.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        as: "restaurant",
                        attributes: [ 'id', 'store_name' ]
                    }
                ],
                where: {
                    is_accept: true,
                    is_active: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'id', 'owner_name', 'owner_mobile', 'is_accept' ]
            } );
            ownersProfiles.forEach( ( owner ) =>
            {
                const restaurant = owner.restaurant;
                ownerProfileList.push( {
                    owner_id: owner.id,
                    store_id: restaurant ? restaurant.id : null,
                    store_name: restaurant ? restaurant.store_name : '',
                    owner_name: owner.owner_name,
                    owner_mobile: owner.owner_mobile,
                    is_accept: owner.is_accept
                } );
            } );
        }

        const ownerRequests = await db.user.findAll( {
            include: [
                {
                    model: db.restaurants,
                    as: "restaurant",
                    attributes: [ 'id', 'store_name' ]
                }
            ],
            where: {
                is_accept: false,
            },
            attributes: [ 'id', 'owner_name', 'owner_mobile', 'is_accept' ]
        } );
        ownerRequests.forEach( ( owner ) =>
        {
            const restaurant = owner.restaurant;
            ownerRequestList.push( {
                owner_id: owner.id,
                store_id: restaurant ? restaurant.id : null,
                store_name: restaurant ? restaurant.store_name : '',
                owner_name: owner.owner_name,
                owner_mobile: owner.owner_mobile,
                is_accept: owner.is_accept
            } );
        } );

        const data = {
            total_owners: storeOwner,
            new_owners_request: ownerRequest,
            owner_profile_list: ownerProfileList,
            owner_request_list: ownerRequestList
        };
        return getResult( res, 200, data, "owner profile list fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch owner profile list : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.ownerRemove = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;

        const owner = await db.user.findByPk( id );
        if ( !owner )
        {
            return getErrorResult( res, 400, `owner not found with id ${ id }.` );
        }
        const removeOwner = await db.user.update( { is_active: false }, { where: { id } } );

        return getResult( res, 200, removeOwner, "owner remove successfully." );
    } catch ( error )
    {
        console.error( "error in owner remove : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.ownerRequest = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const is_accept = req.body.is_accept;

        const owner = await db.user.findByPk( id );
        if ( !owner )
        {
            return getErrorResult( res, 400, `owner not found with id ${ id }.` );
        }
        if ( is_accept === true )
        {
            const acceptedOwner = await db.user.update( { is_accept }, { where: { id } } );

            return getResult( res, 200, acceptedOwner, "owner's request accepted successfully." );
        } else
        {
            const declineOwner = await db.user.update( { is_accept }, { where: { id } } );

            return getResult( res, 200, declineOwner, "owner's request declined successfully." );
        }
    } catch ( error )
    {
        console.error( "error in owner's request : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
