const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Op = db.Op;

exports.getOrderList = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const { sort, date, timing } = req.body;

        const orderOptions = {
            include: [
                {
                    model: db.restaurants,
                    attributes: [],
                    as: "restaurant",
                    where: {
                        user_id: userId
                    },
                    require: false
                }
            ],
            attributes: [ 'transaction_id', 'bill_amount', 'discount_given_by_customer', 'createdAt' ],
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

        const total_orders = await db.orders.findAll( orderOptions );
        return getResult( res, 200, total_orders, "order list fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch order list : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};