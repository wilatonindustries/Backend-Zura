const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const axios = require( 'axios' );
const config = require( "../../config/config" );
const Op = db.Op;

exports.customerList = async ( req, res ) =>
{
    try
    {
        const { name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        const countCustomer = await db.customer.count();

        let customers, customerlist = [], totalAmount = 0;
        if ( name )
        {
            customers = await db.customer.findAll( {
                include: [
                    {
                        model: db.orders,
                        attributes: [ "id", "discount_given" ],
                        as: "orders",
                        require: false
                    }
                ],
                where: {
                    name: {
                        [ Op.like ]: `%${ name }%`
                    },
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    },
                },
                attributes: [ 'id', 'name', "email", "mobile", "is_active" ],
            } );

            for ( const customer of customers )
            {

                const orders = customer.orders || [];

                const discountGivenByCustomer = orders.reduce( ( sum, order ) => sum + parseFloat( order.discount_given || 0 ), 0 );

                customerlist.push( {
                    id: customer.id,
                    name: customer.name,
                    mobile: customer.mobile,
                    email: customer.email,
                    discount_given_by_customer: discountGivenByCustomer,
                    is_active: customer.is_active
                } );
            }
        } else
        {
            customers = await db.customer.findAll( {
                include: [
                    {
                        model: db.orders,
                        attributes: [ "id", "discount_given" ],
                        as: "orders",
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    },
                },
                attributes: [ 'id', 'name', "email", "mobile", "is_active" ],
            } );

            for ( const customer of customers )
            {

                const orders = customer.orders || [];

                const discountGivenByCustomer = orders.reduce( ( sum, order ) => sum + parseFloat( order.discount_given || 0 ), 0 );

                customerlist.push( {
                    id: customer.id,
                    name: customer.name,
                    mobile: customer.mobile,
                    email: customer.email,
                    discount_given_by_customer: discountGivenByCustomer,
                    is_active: customer.is_active
                } );
            }
        }

        for ( const list of customerlist )
        {
            totalAmount += parseFloat( list.discount_given_by_customer );
        }

        const data = {
            total_customers: countCustomer,
            customerlist,
            total_amount: totalAmount
        };
        return getResult( res, 200, data, "Customers list fetched successfully" );
    } catch ( err )
    {
        console.error( "err in fetch customers list and customer counted : ", err );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

exports.blockOrUnblockCustomer = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { is_active } = req.body;

        const customer = await db.customer.findOne( { where: { id: id } } );

        if ( !customer )
        {
            return getErrorResult( res, 400, `Customer not found with id ${ id }` );
        }

        if ( is_active === true )
        {
            await db.customer.update( { is_active }, { where: { id } } );
            return getResult( res, 200, 1, "Customer unblocked successfully" );
        } else
        {
            await db.customer.update( { is_active }, { where: { id } } );
            return getResult( res, 200, 1, "Customer blocked successfully" );
        }
    } catch ( err )
    {
        console.error( "err in customer block or unblock : ", err );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

exports.sendNotification = async ( req, res ) =>
{
    try
    {
        const { title, message } = req.body;

        let tokens = [];

        const customers = await db.customer.findAll( {
            where: {
                fcm_token: { [ db.Sequelize.Op.not ]: null },
                is_notified: true
            }
        } );

        for ( let customer of customers )
        {
            tokens.push( customer.fcm_token );
        }

        const fcmApiKey = config.fcm.api_key;

        const payload = {
            registration_ids: tokens,
            notification: {
                title: title,
                body: message,
            },
        };

        if ( tokens.length > 0 )
        {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `key=${ fcmApiKey }`
            };

            const response = await axios.post( 'https://fcm.googleapis.com/fcm/send', payload, { headers } );

            if ( response.data.failure > 0 )
            {
                console.error( "Failed notifications:", response.data.results );
            }


            return getResult( res, 200, 1, "Notification send successfully" );
        } else
        {
            return getResult( res, 200, 1, "Notification send successfully" );
        }
    } catch ( error )
    {
        console.error( "error in send notification in admin : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};