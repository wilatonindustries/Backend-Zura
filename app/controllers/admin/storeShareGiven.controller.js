const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalStoreShareGiven = async ( req, res ) =>
{
    try
    {
        const { store_name, customer_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orders, storeShareList = [], totalBillAmount = 0, totalCommision = 0, totalGst = 0, totalStoreShareGoven = 0;

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
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision
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
                    }
                ],
                where: {
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision
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
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision
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
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision
                } );
            } );
        }
        for ( const storeShare of storeShareList )
        {
            totalBillAmount += parseFloat( storeShare.bill_amount );
            totalGst += parseFloat( storeShare.all_gst );
            totalCommision += parseFloat( storeShare.total_commision );
            totalStoreShareGoven += parseFloat( storeShare.store_share_given );
        }

        const data = {
            paid_payout: await paidPayout(),
            yet_to_be_paid_payout: await toBePaidPayout(),
            total_store_share_given: storeShareList,
            totals: {
                total_bill_amount: totalBillAmount,
                total_gst: totalGst,
                total_commision: totalCommision,
                total_store_share_given: totalStoreShareGoven
            }
        };
        return getResult( res, 200, data, "total store share given fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch total store share given : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.totalStoreShareToBeGiven = async ( req, res ) =>
{
    try
    {
        const { store_name, customer_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orders, storeShareList = [], totalBillAmount = 0, totalCommision = 0, totalGst = 0, totalStoreShareGoven = 0;

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
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant", "is_paid" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision,
                    paid_or_not: order.is_paid
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
                    }
                ],
                where: {
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant", "is_paid" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision,
                    paid_or_not: order.is_paid
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
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant", "is_paid" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision,
                    paid_or_not: order.is_paid
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
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "discount_from_restaurant", "is_paid" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const commision = parseFloat( order.bill_amount ) * order.discount_from_restaurant / 100;
                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: order.bill_amount,
                    all_gst: order.gst,
                    total_commision: commision,
                    store_share_given: parseFloat( order.bill_amount ) + commision,
                    paid_or_not: order.is_paid
                } );
            } );
        }
        for ( const storeShare of storeShareList )
        {
            totalBillAmount += parseFloat( storeShare.bill_amount );
            totalGst += parseFloat( storeShare.all_gst );
            totalCommision += parseFloat( storeShare.total_commision );
            totalStoreShareGoven += parseFloat( storeShare.store_share_given );
        }

        const data = {
            total_store_share_given: storeShareList,
            totals: {
                total_bill_amount: totalBillAmount,
                total_gst: totalGst,
                total_commision: totalCommision,
                total_store_share_given: totalStoreShareGoven
            }
        };
        return getResult( res, 200, data, "total store share given fetched successfully." );

    } catch ( error )
    {
        console.error( "error in fetch total store share given : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

async function paidPayout ()
{
    const total_earnings = await totalEarnings();
    const gst = await totalGST();
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                    0
                ),
                'paid_payout'
            ]
        ],
        where: {
            is_paid: true
        }
    } );

    const paid = parseFloat( result[ 0 ].dataValues.paid_payout );

    const payout = paid - total_earnings - gst;
    return payout;
}

async function toBePaidPayout ()
{
    const total_earnings = await totalEarnings();
    const gst = await totalGST();
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                    0
                ),
                'to_be_paid_payout'
            ]
        ],
        where: {
            is_paid: false
        }
    } );
    const toBePaid = parseFloat( result[ 0 ].dataValues.to_be_paid_payout );

    const toBepayout = toBePaid - total_earnings - gst;
    return toBepayout;
}

async function totalGST ()
{
    const gst = 5;
    const total_earnings = await totalEarnings();

    const total_gst = total_earnings * gst / 100;

    return total_gst;
}

async function totalEarnings ()
{
    const conenience_fee = 10;
    const totalDiscountReceived = await discountReceived();
    const total_dis_given = await totalDiscountGiven();

    const earnings = totalDiscountReceived + conenience_fee;

    const givenDisPr = earnings * total_dis_given / 100;

    const result = earnings - givenDisPr;

    return result;
}

async function discountReceived ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                    0
                ),
                'total_sales'
            ],
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'discount_from_restaurant' ) ),
                    0
                ),
                'discount_from_restaurant'
            ]
        ],
    } );

    const total_sales_res = parseFloat( result[ 0 ].dataValues.total_sales );
    const discount_from_restaurant_res = parseFloat( result[ 0 ].dataValues.discount_from_restaurant );

    const total_discount_received = total_sales_res * discount_from_restaurant_res / 100;

    return total_discount_received;
}

async function totalDiscountGiven ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.literal( 'COALESCE(SUM(CAST(orders.discount_to_customer AS DECIMAL)) + (SUM(CAST(orders.magic_coupon_discount AS DECIMAL))), 0)' ),
                'total_discount_given'
            ]
        ],
    } );

    const total_discount_given = parseFloat( result[ 0 ].dataValues.total_discount_given );

    return total_discount_given;
}