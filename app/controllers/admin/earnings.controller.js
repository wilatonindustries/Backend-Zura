const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalEarningsWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, customer_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );
        const dateArray = [];
        let currentDate = new Date( startDate );
        let orders;

        while ( currentDate <= new Date( endDate ) )
        {
            dateArray.push( new Date( currentDate ) );
            currentDate.setDate( currentDate.getDate() + 1 );
        }
        if ( store_name && customer_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id" ],
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
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal(
                            `COALESCE(
                                SUM(CAST(orders.bill_amount AS DECIMAL)) * (SUM(CAST(orders.discount_from_restaurant AS DECIMAL)) / 100)
                                + 10 - SUM(CAST(orders.discount_given AS DECIMAL)), 0
                            )`
                        ),
                        'total_earnings'
                    ]
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                as: 'orders',
                group: [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ) ],
                order: [ [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'ASC' ] ]
            } );
        } else if ( store_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id" ],
                        as: "restaurant",
                        where: {
                            store_name
                        },
                        require: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal(
                            `COALESCE(
                                SUM(CAST(orders.bill_amount AS DECIMAL)) * (SUM(CAST(orders.discount_from_restaurant AS DECIMAL)) / 100)
                                + 10 - SUM(CAST(orders.discount_given AS DECIMAL)), 0
                            )`
                        ),
                        'total_earnings'
                    ]
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                as: 'orders',
                group: [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ) ],
                order: [ [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'ASC' ] ]
            } );
        } else if ( customer_name )
        {
            orders = await db.orders.findAll( {
                include: [
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
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal(
                            `COALESCE(
                                SUM(CAST(orders.bill_amount AS DECIMAL)) * (SUM(CAST(orders.discount_from_restaurant AS DECIMAL)) / 100)
                                + 10 - SUM(CAST(orders.discount_given AS DECIMAL)), 0
                            )`
                        ),
                        'total_earnings'
                    ]
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                as: 'orders',
                group: [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ) ],
                order: [ [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'ASC' ] ]
            } );
        } else
        {
            orders = await db.orders.findAll( {
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal(
                            `COALESCE(
                                SUM(CAST(orders.bill_amount AS DECIMAL)) * (SUM(CAST(orders.discount_from_restaurant AS DECIMAL)) / 100)
                                + 10 - SUM(CAST(orders.discount_given AS DECIMAL)), 0
                            )`
                        ),
                        'total_earnings'
                    ]
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                as: 'orders',
                group: [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ) ],
                order: [ [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'ASC' ] ]
            } );
        }

        const expensesMap = new Map(
            orders.map( ( order ) => [
                order.get( 'date' ),
                order.get( 'total_earnings' )
            ] )
        );
        const resultArray = dateArray.map( ( date ) => ( {
            date: date.toISOString().split( 'T' )[ 0 ],
            total_earnings: Number(
                expensesMap.get( date.toISOString().split( 'T' )[ 0 ] ) || 0
            )
        } ) );

        const data = {
            total_earnings: await totalEarnings(),
            earnings: resultArray
        };
        return getResult( res, 200, data, "total earnings fetched successfully." );
    } catch ( error )
    {
        console.error( "error in total earnings with filter : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

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
