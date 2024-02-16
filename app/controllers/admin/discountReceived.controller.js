const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalDiscountReceivedWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );
        const dateArray = [];
        let currentDate = new Date( startDate );

        while ( currentDate <= new Date( endDate ) )
        {
            dateArray.push( new Date( currentDate ) );
            currentDate.setDate( currentDate.getDate() + 1 );
        }

        if ( store_name )
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
                            }
                        },
                        require: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.dis_receive_by_res' ) ),
                            0
                        ),
                        'discount_received'
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
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.dis_receive_by_res' ) ),
                            0
                        ),
                        'discount_received'
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
                order.get( 'discount_received' )
            ] )
        );
        const resultArray = dateArray.map( ( date ) => ( {
            date: date.toISOString().split( 'T' )[ 0 ],
            discount_received: Number(
                expensesMap.get( date.toISOString().split( 'T' )[ 0 ] ) || 0
            )
        } ) );

        const total_discount_received = await discountReceived();

        const data = {
            total_discount_received,
            discount_received: resultArray
        };
        return getResult( res, 200, data, "total discount received  successfully." );
    } catch ( error )
    {
        console.error( "error in total discount received with filter : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

async function discountReceived ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'dis_receive_by_res' ) ),
                    0
                ),
                'total_discount_received'
            ]
        ],
    } );

    const total_discount_received = parseFloat( result[ 0 ].dataValues.total_discount_received );
    return total_discount_received;
}
