const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Op = db.Op;

exports.orderList = async ( req, res ) =>
{
    try
    {
        const { store_name, customer_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orderlist = [], orders;
        const totalOrders = await db.orders.count();

        if ( store_name && customer_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        where: {
                            store_name: {
                                [ Op.like ]: `%${ store_name }%`
                            }
                        },
                        require: false
                    },
                    {
                        model: db.customer,
                        attributes: [ "id", "name" ],
                        as: "customer",
                        where: {
                            name: {
                                [ Op.like ]: `%${ customer_name }%`
                            }
                        },
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'dis_to_customer', 'order_timing', 'gst_amt' ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: parseFloat( order.discount_to_customer ),
                    discount_given_by_customer: parseFloat( order.dis_to_customer ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.gst_amt )
                } );
            } );
        } else if ( customer_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        require: false
                    },
                    {
                        model: db.customer,
                        attributes: [ "id", "name" ],
                        as: "customer",
                        where: {
                            name: {
                                [ Op.like ]: `%${ customer_name }%`
                            }
                        },
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'dis_to_customer', 'order_timing', 'gst_amt' ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: parseFloat( order.discount_to_customer ),
                    discount_given_by_customer: parseFloat( order.dis_to_customer ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.gst_amt )
                } );
            } );
        } else if ( store_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        where: {
                            store_name: {
                                [ Op.like ]: `%${ store_name }%`
                            }
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
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'dis_to_customer', 'order_timing', 'gst_amt' ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: parseFloat( order.discount_to_customer ),
                    discount_given_by_customer: parseFloat( order.dis_to_customer ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.gst_amt )
                } );
            } );
        } else
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        require: false
                    },
                    {
                        model: db.customer,
                        attributes: [ "id", "name" ],
                        as: "customer",
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'dis_to_customer', 'order_timing', 'gst_amt' ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: parseFloat( order.discount_to_customer ),
                    discount_given_by_customer: parseFloat( order.dis_to_customer ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.gst_amt )
                } );
            } );
        }

        const data = {
            total_orders: totalOrders,
            orders_list: orderlist
        };

        return getResult( res, 200, data, "order list  fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch order list and counted : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};
