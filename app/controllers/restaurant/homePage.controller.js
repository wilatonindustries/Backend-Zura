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
                        user_id: userId,
                        is_delete: false
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
                ],
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn( 'SUM', Sequelize.col( 'orders.given_to_res' ) ),
                        0
                    ),
                    'total_earnings'
                ]
            ],
        } );

        const totalSales = parseFloat( result[ 0 ].dataValues.total_sales );
        const totalEarnings = parseFloat( result[ 0 ].dataValues.total_earnings );
        const data = {
            total_sales: totalSales, total_earnings: totalEarnings
        };

        return getResult( res, 200, data, "Home page data fetched successfully" );
    } catch ( error )
    {
        console.error( "error in get home page for restaurant : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};
