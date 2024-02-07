const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Sequelize = db.Sequelize;

exports.homePage = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;

        const result = await db.orders.findAll( {
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
            attributes: [
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn( 'SUM', Sequelize.col( 'orders.bill_amount' ) ),
                        0
                    ),
                    'total_sales'
                ]
            ],
        } );

        const totalSales = parseFloat( result[ 0 ].dataValues.total_sales );
        const data = {
            total_sales: totalSales, total_earnings: await restaurantEarnings( userId )
        };

        return getResult( res, 200, data, "home page fetched successfully." );
    } catch ( error )
    {
        console.error( "error in get home page for restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

async function restaurantEarnings ( userId )
{
    const total_earnings = await totalEarnings( userId );
    const gst = await totalGST( userId );
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
            is_paid: true, user_id: userId
        }
    } );

    const paid = parseFloat( result[ 0 ].dataValues.paid_payout );

    const payout = paid - total_earnings - gst;
    return payout;
}

async function totalGST ( userId )
{
    const gst = 5;
    const total_earnings = await totalEarnings( userId );

    const total_gst = total_earnings * gst / 100;

    return total_gst;
}

async function totalEarnings ( userId )
{
    const conenience_fee = 10;
    const totalDiscountReceived = await discountReceived( userId );
    const total_dis_given = await totalDiscountGiven( userId );

    const earnings = totalDiscountReceived + conenience_fee;

    const givenDisPr = earnings * total_dis_given / 100;

    const result = earnings - givenDisPr;

    return result;
}

async function discountReceived ( userId )
{
    const result = await db.orders.findAll( {
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

async function totalDiscountGiven ( userId )
{
    const result = await db.orders.findAll( {
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