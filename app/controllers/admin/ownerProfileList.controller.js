const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );

exports.getOwnerProfileListWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, owner_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        const ownerRequest = await db.user.count( { where: { is_accept: false } } );
        const storeOwner = await db.user.count( { where: { is_accept: true } } );

        let ownerProfileList = [];

        if ( owner_name )
        {
            const owners = await db.user.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id" ],
                        as: "restaurant",
                        attributes: [ 'id', 'store_name' ]
                    }
                ],
                where: {
                    owner_name,
                    is_accept: true,
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'id', 'owner_name', 'owner_mobile' ]
            } );
            owners.forEach( ( owner ) =>
            {
                const restaurant = owner.restaurant;
                ownerProfileList.push( {
                    store_name: restaurant.store_name,
                    owner_name: owner.owner_name,
                    owner_mobile: owner.owner_mobile
                } );
            } );
        } else
        {
            const restaurants = await db.restaurants.findAll( {
                include: [
                    {
                        model: db.user,
                        attributes: [ "id" ],
                        as: "user",
                        where: {
                            is_accept: true,
                            createdAt: {
                                [ db.Op.between ]: [ startDate, endDate ]
                            }
                        },
                        attributes: [ 'id', 'owner_name', 'owner_mobile' ]
                    }
                ],
                where: { store_name },
                attributes: [ 'id', 'store_name' ]
            } );
            restaurants.forEach( ( restaurant ) =>
            {
                const owner = restaurant.user;
                ownerProfileList.push( {
                    store_name: restaurant.store_name,
                    owner_name: owner.owner_name,
                    owner_mobile: owner.owner_mobile
                } );
            } );
        }

        const data = {
            total_owners: ownerRequest,
            new_owners_request: storeOwner,
            owner_profile_list: ownerProfileList
        }
        return getResult( res, 200, data, "owner profile list fetched successfully." )
    } catch ( error )
    {
        console.error( "error in fetch owner profile list : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

exports.getOwnerRequestList = async ( req, res ) =>
{
    try
    {
        let ownerRequestList = [];

        const owners = await db.user.findAll( {
            include: [
                {
                    model: db.restaurants,
                    attributes: [ "id" ],
                    as: "restaurant",
                    attributes: [ 'id', 'store_name' ]
                }
            ],
            where: {
                is_accept: false,
            },
            attributes: [ 'id', 'owner_name', 'owner_mobile' ]
        } );
        owners.forEach( ( owner ) =>
        {
            const restaurant = owner.restaurant;
            ownerRequestList.push( {
                store_name: restaurant.store_name,
                owner_name: owner.owner_name,
                owner_mobile: owner.owner_mobile
            } );
        } );

        const data = {
            owner_request_list: ownerRequestList
        }
        return getResult( res, 200, data, "owner's request list fetched successfully." )
    } catch ( error )
    {
        console.error( "error in fetch owner's request list : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

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
        const acceptedOwner = await db.user.update( { is_accept }, { where: { id } } );

        return getResult( res, 200, acceptedOwner, "owner's request accepted successfully." )
    } catch ( error )
    {
        console.error( "error in accept owner's request : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}