const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Op = db.Op;

exports.getOrderList = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const { sort, date, timing } = req.body;

        let ordersList = [];

        const orderOptions = {
            include: [
                {
                    model: db.restaurants,
                    attributes: [],
                    as: "restaurant",
                    where: {
                        user_id: userId,
                        is_delete: false
                    },
                    require: false
                },
                {
                    model: db.customer,
                    attributes: [ "id", "name" ],
                    as: "customer",
                    require: false
                }
            ],
            attributes: [ 'transaction_id', 'bill_amount', 'createdAt', 'is_paid' ],
        };
        if ( sort === 'high_to_low' )
        {
            orderOptions.order = [ [ 'bill_amount', 'DESC' ] ];
        } else if ( sort === 'low_to_high' )
        {
            orderOptions.order = [ [ 'bill_amount', 'ASC' ] ];
        } else if ( date )
        {
            orderOptions.where = {
                createdAt: {
                    [ Op.between ]: [ new Date( `${ date }T00:00:00.000Z` ), new Date( `${ date }T23:59:59.999Z` ) ]
                }
            };
        } else if ( timing )
        {
            orderOptions.where = {
                order_timing: timing
            };
        }

        const orders = await db.orders.findAll( orderOptions );

        orders.forEach( order =>
        {
            const customer = order.customer;

            ordersList.push( {
                customer_name: customer ? customer.name : '',
                transaction_id: order.transaction_id,
                bill_amount: order.bill_amount,
                created_date: order.createdAt,
                is_paid: order.is_paid,
            } );
        } );

        const data = { order_list: ordersList };
        return getResult( res, 200, data, "order list fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch order list : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};