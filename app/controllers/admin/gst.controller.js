const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalGstBillWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orders, gstList = [], gst = 5;

        if ( store_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        where: { store_name },
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [
                    [ Sequelize.fn( 'DISTINCT', Sequelize.col( 'orders.restaurant_id' ) ), 'restaurant_id' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                            0
                        ),
                        'bill_amount'
                    ],
                ],
                as: 'orders',
                group: [ 'restaurant.store_name' ],
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const billAmt = parseFloat( order.dataValues.bill_amount );
                const gstAmount = billAmt * gst / 100;

                gstList.push( {
                    store_name: store ? store.store_name : '',
                    bill_amount: billAmt,
                    gst: gst,
                    gst_amount: gstAmount
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
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [
                    [ Sequelize.fn( 'DISTINCT', Sequelize.col( 'orders.restaurant_id' ) ), 'restaurant_id' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                            0
                        ),
                        'bill_amount'
                    ],
                ],
                as: 'orders',
                group: [ 'restaurant.store_name' ],
            } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const billAmt = parseFloat( order.dataValues.bill_amount );
                const gstAmount = billAmt * gst / 100;

                gstList.push( {
                    store_name: store ? store.store_name : '',
                    bill_amount: billAmt,
                    gst: gst,
                    gst_amount: gstAmount
                } );
            } );
        }
        const data = {
            total_gst: await totalGST(),
            all_gst_details: gstList
        };
        return getResult( res, 200, data, "total GST fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch total GST : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

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