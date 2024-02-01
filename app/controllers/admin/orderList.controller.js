const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );

exports.orderList = async ( req, res ) =>
{
    try
    {
        const { store_name, customer_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orderlist = [];
        let ordersPromises;
        let formattedOrders;
        const totalOrders = await db.orders.count();
        if ( customer_name )
        {
            const customers = await db.customer.findAll( {
                where: { name: customer_name },
            } );
            ordersPromises = customers.map( async ( customer ) =>
            {
                const orders = await db.orders.findAll( {
                    where: {
                        [ db.Op.or ]: [
                            { customer_id: customer.id }
                        ],
                        createdAt: {
                            [ db.Op.between ]: [ startDate, endDate ]
                        }
                    },
                    attributes: [ 'restaurant_id', 'createdAt', 'transaction_id', 'bill_amount', 'gst', 'discount_to_customer', 'discount_given_by_customer', 'order_timing', 'our_profit' ]
                } );

                formattedOrders = await Promise.all( orders.map( async order =>
                {
                    const restaurants = await db.restaurants.findAll( {
                        where: { id: order.restaurant_id },
                        attributes: [ 'store_name' ]
                    } );

                    return {
                        store_name: restaurants[ 0 ].store_name,
                        customer_name: customer.name,
                        date: order.createdAt,
                        transaction_id: order.transaction_id,
                        bill_amount: order.bill_amount,
                        gst: order.gst,
                        discount_to_customer: order.discount_to_customer,
                        discount_given_by_customer: order.discount_given_by_customer,
                        order_timing: order.order_timing,
                        our_profit: order.our_profit
                    };
                } ) );

                orderlist.push( ...formattedOrders );
                return formattedOrders;
            } );
        } else
        {
            const restaurants = await db.restaurants.findAll( {
                where: { store_name: store_name }
            } );

            ordersPromises = restaurants.map( async ( restaurant ) =>
            {
                const orders = await db.orders.findAll( {
                    where: {
                        [ db.Op.or ]: [
                            { restaurant_id: restaurant.id },
                        ],
                        createdAt: {
                            [ db.Op.between ]: [ startDate, endDate ]
                        }
                    },
                    attributes: [ 'customer_id', 'createdAt', 'transaction_id', 'bill_amount', 'gst', 'discount_to_customer', 'discount_given_by_customer', 'order_timing', 'our_profit' ]
                } );

                formattedOrders = await Promise.all( orders.map( async order =>
                {
                    const customer = await db.customer_details.findAll( {
                        where: { id: order.customer_id },
                        attributes: [ 'name' ]
                    } );

                    return {
                        store_name: restaurant.store_name,
                        customer_name: customer[ 0 ].name,
                        date: order.createdAt,
                        transaction_id: order.transaction_id,
                        bill_amount: order.bill_amount,
                        gst: order.gst,
                        discount_to_customer: order.discount_to_customer,
                        discount_given_by_customer: order.discount_given_by_customer,
                        order_timing: order.order_timing,
                        our_profit: order.our_profit
                    };
                } ) );

                orderlist.push( ...formattedOrders );
                return formattedOrders;
            } );
        }

        const ordersData = await Promise.all( ordersPromises );

        const flatOrders = ordersData.flat();

        const data = {
            total_orders: totalOrders,
            orders: flatOrders
        };

        return getResult( res, 200, data, "order list and counted fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch order list and counted : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
