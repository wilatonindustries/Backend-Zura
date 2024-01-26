const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize
const Op = db.Op

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
                        required: false
                    },
                    {
                        model: db.customer,
                        attributes: [ "id" ],
                        as: "customer",
                        where: {
                            name: customer_name
                        },
                        required: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.our_profit' ) ),
                            0
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
        else if ( store_name )
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
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.our_profit' ) ),
                            0
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
                include: [
                    {
                        model: db.customer,
                        attributes: [ "id" ],
                        as: "customer",
                        where: {
                            name: customer_name
                        },
                        required: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.our_profit' ) ),
                            0
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
        }
        return getResult( res, 200, data, "total earnings with filter successfully." )
    } catch ( error )
    {
        console.error( "error in total earnings with filter : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}

async function totalEarnings ()
{
    const orders = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'our_profit' ) ),
                    0
                ),
                'earnings'
            ]
        ],
    } );
    return orders;
}
