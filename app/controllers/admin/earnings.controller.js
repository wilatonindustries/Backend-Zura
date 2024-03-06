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
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal( `
                            COALESCE(
                                SUM(CAST(orders.commission_by_admin AS DECIMAL)) - (SUM(CAST(orders.magic_coupon_amount AS DECIMAL))),
                                0
                            )
                        `),
                        'total_earnings'
                    ]
                    // [
                    //     Sequelize.fn(
                    //         'COALESCE',
                    //         Sequelize.fn( 'SUM', Sequelize.col( 'orders.commission_by_admin' ) ),
                    //         0
                    //     ),
                    //     'total_earnings'
                    // ]
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
                            store_name: {
                                [ Op.like ]: `%${ store_name }%`
                            },
                            is_delete: false
                        },
                        require: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal( `
                            COALESCE(
                                SUM(CAST(orders.commission_by_admin AS DECIMAL)) - (SUM(CAST(orders.magic_coupon_amount AS DECIMAL))),
                                0
                            )
                        `),
                        'total_earnings'
                    ]
                    // [
                    //     Sequelize.fn(
                    //         'COALESCE',
                    //         Sequelize.fn( 'SUM', Sequelize.col( 'orders.commission_by_admin' ) ),
                    //         0
                    //     ),
                    //     'total_earnings'
                    // ]
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
                            name: {
                                [ Op.like ]: `%${ customer_name }%`
                            }
                        },
                        require: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal( `
                            COALESCE(
                                SUM(CAST(orders.commission_by_admin AS DECIMAL)) - (SUM(CAST(orders.magic_coupon_amount AS DECIMAL))),
                                0
                            )
                        `),
                        'total_earnings'
                    ]
                    // [
                    //     Sequelize.fn(
                    //         'COALESCE',
                    //         Sequelize.fn( 'SUM', Sequelize.col( 'orders.commission_by_admin' ) ),
                    //         0
                    //     ),
                    //     'total_earnings'
                    // ]
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
                        Sequelize.literal( `
                            COALESCE(
                                SUM(CAST(orders.commission_by_admin AS DECIMAL)) - (SUM(CAST(orders.magic_coupon_amount AS DECIMAL))),
                                0
                            )
                        `),
                        'total_earnings'
                    ]
                    // [
                    //     Sequelize.fn(
                    //         'COALESCE',
                    //         Sequelize.fn( 'SUM', Sequelize.col( 'orders.commission_by_admin' ) ),
                    //         0
                    //     ),
                    //     'total_earnings'
                    // ]
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
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.literal( `
                COALESCE(
                    SUM(CAST(orders.commission_by_admin AS DECIMAL)) - (SUM(CAST(orders.magic_coupon_amount AS DECIMAL))),
                    0
                )
            `),
                'total_earnings'
            ]
            // [
            //     Sequelize.fn(
            //         'COALESCE',
            //         Sequelize.fn( 'SUM', Sequelize.col( 'commission_by_admin' ) ),
            //         0
            //     ),
            //     'total_earnings'
            // ],
        ],
    } );

    const total_earnings = parseFloat( result[ 0 ].dataValues.total_earnings );

    return total_earnings;
}