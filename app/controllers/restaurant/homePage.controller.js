const moment = require( 'moment' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Sequelize = db.Sequelize;

exports.homePage = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;

        const total_sales = await db.orders.findAll( {
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
        const total_earnings = await db.orders.findAll( {
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
                        Sequelize.fn( 'SUM', Sequelize.col( 'orders.our_profit' ) ),
                        0
                    ),
                    'total_sales'
                ]
            ],
        } );
        const data = {
            total_sales, total_earnings
        };

        return getResult( res, 200, data, "home page fetched successfully." );
    } catch ( error )
    {
        console.error( "error in get home page for restaurant : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};