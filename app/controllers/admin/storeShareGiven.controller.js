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
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "commission_by_admin", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res )
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
                    }
                ],
                where: {
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "commission_by_admin", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res )
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
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "commission_by_admin", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res )
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
                    is_paid: true,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst", "commission_by_admin", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res )
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
        return getResult( res, 200, data, "total store share given fetched successfully" );
    } catch ( error )
    {
        console.error( "error in fetch total store share given : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
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
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst_rate", "commission_by_admin", "is_paid", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    order_id: order.id,
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst_rate ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res ),
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
                            store_name: {
                                [ Op.like ]: `%${ store_name }%`
                            },
                            is_delete: false
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
                attributes: [ "id", "order_date", "bill_amount", "gst_rate", "commission_by_admin", "is_paid", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    order_id: order.id,
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst_rate ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res ),
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
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst_rate", "commission_by_admin", "is_paid", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    order_id: order.id,
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst_rate ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res ),
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
                    is_paid: false,
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ "id", "order_date", "bill_amount", "gst_rate", "commission_by_admin", "is_paid", "given_to_res" ]
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                storeShareList.push( {
                    order_id: order.id,
                    store_name: store ? store.store_name : '',
                    date: order.order_date,
                    bill_amount: parseFloat( order.bill_amount ),
                    all_gst: parseFloat( order.gst_rate ),
                    total_commision: parseFloat( order.commission_by_admin ),
                    store_share_given: parseFloat( order.given_to_res ),
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
        return getResult( res, 200, data, "total store share given fetched successfully" );

    } catch ( error )
    {
        console.error( "error in fetch total store share given : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

exports.paidOrUnpaid = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { is_paid } = req.body;

        const order = await db.orders.findOne( { where: { id: id } } );

        if ( !order )
        {
            return getErrorResult( res, 400, `order not found with id ${ id }.` );
        }

        if ( is_paid === true )
        {
            await db.orders.update( { is_paid }, { where: { id } } );
            return getResult( res, 200, 1, "pay successfully" );
        } else
        {
            await db.orders.update( { is_paid }, { where: { id } } );
            return getResult( res, 200, 1, "unpay successfully" );
        }
    } catch ( err )
    {
        console.error( "err in pay : ", err );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

async function paidPayout ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'given_to_res' ) ),
                    0
                ),
                'paid_payout'
            ],
        ],
        where: { is_paid: true }
    } );

    const paidPayout = parseFloat( result[ 0 ].dataValues.paid_payout );

    return paidPayout;
}

async function toBePaidPayout ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'given_to_res' ) ),
                    0
                ),
                'to_be_paid_payout'
            ],
        ],
        where: { is_paid: false }
    } );

    const paidPayout = parseFloat( result[ 0 ].dataValues.to_be_paid_payout );

    return paidPayout;
}

// async function paidPayout ()
// {
//     const result = await db.restaurants_payouts.findAll( {
//         attributes: [
//             [
//                 Sequelize.fn(
//                     'COALESCE',
//                     Sequelize.fn( 'SUM', Sequelize.col( 'amount' ) ),
//                     0
//                 ),
//                 'paid_payout'
//             ],
//         ],
//     } );

//     const paidPayout = parseFloat( result[ 0 ].dataValues.paid_payout );

//     return paidPayout;
// }

// async function toBePaidPayout ()
// {
//     const result = await db.payout_histories.findAll( {
//         attributes: [
//             [
//                 Sequelize.fn(
//                     'COALESCE',
//                     Sequelize.fn( 'SUM', Sequelize.col( 'amount' ) ),
//                     0
//                 ),
//                 'to_be_paid_payout'
//             ],
//         ],
//     } );

//     const paidPayout = parseFloat( result[ 0 ].dataValues.to_be_paid_payout );

//     return paidPayout;
// }