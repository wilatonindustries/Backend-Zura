const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
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
        return getResult( res, 200, data, "customers list fetched successfully." );
    } catch ( err )
    {
        console.error( "err in fetch customers list and customer counted : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
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
            return getErrorResult( res, 400, `customer not found with id ${ id }.` );
        }

        if ( is_active === true )
        {
            await db.customer.update( { is_active }, { where: { id } } );
            return getResult( res, 200, 1, "customers unblocked successfully." );
        } else
        {
            await db.customer.update( { is_active }, { where: { id } } );
            return getResult( res, 200, 1, "customers blocked successfully." );
        }
    } catch ( err )
    {
        console.error( "err in customer block or unblock : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};