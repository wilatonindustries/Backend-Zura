const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalRewardGivenToCustomerWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, customer_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );
        let orders, orderList = [], totalBillAmount = 0, totalDiscount = 0, totalDiscountGivenWorth = 0;

        if ( store_name && customer_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        where: {
                            store_name
                        },
                        require: false
                    },
                    {
                        model: db.customer,
                        attributes: [ "id", "name" ],
                        as: "customer",
                        where: {
                            name: customer_name
                        },
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "discount_to_customer", "discount_given_by_customer", "magic_coupon_amount", "magic_coupon_discount", "discount_given" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                const discountWorth = order.bill_amount - order.discount_given;

                orderList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    customer_name: customer ? customer.name : '',
                    bill_amount: order.bill_amount,
                    discount: discount,
                    discount_given_worth: discountWorth
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
                            store_name
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
                attributes: [ "id", "order_date", "bill_amount", "discount_to_customer", "discount_given_by_customer", "magic_coupon_amount", "magic_coupon_discount", "discount_given" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                const discountWorth = order.bill_amount - order.discount_given;

                orderList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    customer_name: customer ? customer.name : '',
                    bill_amount: order.bill_amount,
                    discount: discount,
                    discount_given_worth: discountWorth
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
                            name: customer_name
                        },
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "discount_to_customer", "discount_given_by_customer", "magic_coupon_amount", "magic_coupon_discount", "discount_given" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                const discountWorth = order.bill_amount - order.discount_given;

                orderList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    customer_name: customer ? customer.name : '',
                    bill_amount: order.bill_amount,
                    discount: discount,
                    discount_given_worth: discountWorth
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
                attributes: [ "id", "order_date", "bill_amount", "discount_to_customer", "discount_given_by_customer", "magic_coupon_amount", "magic_coupon_discount", "discount_given" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;
                const customer = order.customer;

                const discount = parseFloat( order.discount_to_customer ) + parseFloat( order.magic_coupon_discount );

                const discountWorth = order.bill_amount - order.discount_given;

                orderList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    customer_name: customer ? customer.name : '',
                    bill_amount: order.bill_amount,
                    discount: discount,
                    discount_given_worth: discountWorth
                } );
            } );
        }

        for ( const order of orderList )
        {
            totalBillAmount += parseFloat( order.bill_amount );
            totalDiscount += parseFloat( order.discount );
            totalDiscountGivenWorth += parseFloat( order.discount_given_worth );
        }

        const total_reward_given_to_customer = await totalRewardGivenToCustomer();

        const data = {
            total_reward_given_to_customer,
            reward_given_to_customer_list: orderList,
            totals: {
                total_bill_amount: totalBillAmount,
                total_dicount: totalDiscount,
                total_discount_given_worth: totalDiscountGivenWorth
            }
        };
        return getResult( res, 200, data, "total reward given to customer fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch total reward given to customer : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

async function totalRewardGivenToCustomer ()
{
    const total_reward_given_to_customer = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.literal( 'COALESCE(SUM(CAST(orders.discount_given AS DECIMAL)), 0)' ),
                'total_reward_given_to_customer'
            ]
        ],
    } );

    return total_reward_given_to_customer;
}
