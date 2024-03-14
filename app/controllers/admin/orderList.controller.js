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
                            },
                            is_delete: false
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
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'discount_given', 'order_timing', 'commission_by_admin', "magic_coupon_discount" ],
                order: [ [ 'createdAt', 'DESC' ] ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: discount,
                    discount_given_by_customer: parseFloat( order.discount_given ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.commission_by_admin )
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
                        where: { is_delete: false },
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
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'discount_given', 'order_timing', 'commission_by_admin', "magic_coupon_discount" ],
                order: [ [ 'createdAt', 'DESC' ] ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: discount,
                    discount_given_by_customer: parseFloat( order.discount_given ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.commission_by_admin )
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
                            },
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
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'discount_given', 'order_timing', 'commission_by_admin', "magic_coupon_discount" ],
                order: [ [ 'createdAt', 'DESC' ] ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: discount,
                    discount_given_by_customer: parseFloat( order.discount_given ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.commission_by_admin )
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
                        where: { is_delete: false },
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
                attributes: [ 'customer_id', 'order_date', 'createdAt', 'transaction_id', 'bill_amount', 'gst_rate', 'discount_to_customer', 'discount_given', 'order_timing', 'commission_by_admin', "magic_coupon_discount" ],
                order: [ [ 'createdAt', 'DESC' ] ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                orderlist.push( {
                    store_name: store ? store.store_name : '',
                    customer_name: customer ? customer.name : '',
                    date: order.order_date,
                    transaction_id: order.transaction_id,
                    bill_amount: parseFloat( order.bill_amount ),
                    gst: parseFloat( order.gst_rate ),
                    discount_to_customer: discount,
                    discount_given_by_customer: parseFloat( order.discount_given ),
                    order_timing: order.order_timing,
                    our_profit: parseFloat( order.commission_by_admin )
                } );
            } );
        }

        const data = {
            total_orders: totalOrders,
            orders_list: orderlist
        };

        return getResult( res, 200, data, "order list  fetched successfully" );
    } catch ( error )
    {
        console.error( "error in fetch order list and counted : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};
