const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );

exports.customerList = async ( req, res ) =>
{
    try
    {
        const { name, is_block, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        const countCustomer = await db.customer.count();

        let customers, customerlist;
        if ( name )
        {
            customers = await db.customer.findAll( {
                where: {
                    name,
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    },
                },
                attributes: [ 'id', 'name', "email", "mobile" ],
            } );

            customerlist = await Promise.all( customers.map( async ( customer ) =>
            {
                const customerDetails = {
                    id: customer.id,
                    name: customer.name,
                    mobile: customer.mobile,
                    email: customer.email,
                };

                if ( is_block == true )
                {
                    await db.customer.update( { is_active: false }, {
                        id: customer.id
                    } );
                    return getResult( res, 200, 1, "customers blocked." );
                }

                const orders = await db.orders.findAll( {
                    where: { customer_id: customer.id },
                    attributes: [ 'discount_given_by_customer' ],
                } );

                customerDetails.orders = orders;
                const total_amount = orders.reduce( ( sum, order ) =>
                {
                    return sum + parseFloat( order.discount_given_by_customer || 0 );
                }, 0 );

                const customerOrder = {
                    discount_given_by_customer: total_amount,
                };

                customerDetails.orders = [ customerOrder ];

                return { customerDetails };
            } ) );
        } else
        {
            customers = await db.customer.findAll( {
                where: {
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    },
                },
                attributes: [ 'id', 'name', "email", "mobile" ],
            } );

            customerlist = await Promise.all( customers.map( async ( customer ) =>
            {
                const customerDetails = {
                    id: customer.id,
                    name: customer.name,
                    mobile: customer.mobile,
                    email: customer.email,
                };

                if ( is_block == true )
                {
                    await db.customer.update( { is_active: false }, {
                        id: customer.id
                    } );
                    return getResult( res, 200, 1, "customers blocked." );
                }

                const orders = await db.orders.findAll( {
                    where: { customer_id: customer.id },
                    attributes: [ 'discount_given_by_customer' ],
                } );

                customerDetails.orders = orders;
                const total_amount = orders.reduce( ( sum, order ) =>
                {
                    return sum + parseFloat( order.discount_given_by_customer || 0 );
                }, 0 );

                const customerOrder = {
                    discount_given_by_customer: total_amount,
                };

                customerDetails.orders = [ customerOrder ];

                return { customerDetails };
            } ) );
        }
        const overallTotalAmount = customerlist.reduce( ( sum, customer ) =>
        {
            return sum + customer.customerDetails.orders[ 0 ].discount_given_by_customer;
        }, 0 );

        customerlist.push( { total_amount: overallTotalAmount } );

        const data = {
            total_customers: countCustomer,
            customers: customerlist
        };
        return getResult( res, 200, data, "customers list fetched successfully." );
    } catch ( err )
    {
        console.error( "err in fetch customers list and customer counted : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};