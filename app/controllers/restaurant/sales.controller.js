const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalSalesWithFilter = async ( req, res ) =>
{
    try
    {
        const userId = req.userId;
        const filter = req.body.filter;
        const [ startDate, endDate ] = getDataForFilter( filter );
        const dateArray = [];
        let currentDate = new Date( startDate );

        while ( currentDate <= new Date( endDate ) )
        {
            dateArray.push( new Date( currentDate ) );
            currentDate.setDate( currentDate.getDate() + 1 );
        }

        const orders = await db.orders.findAll( {
            include: [
                {
                    model: db.restaurants,
                    attributes: [ "id" ],
                    as: "restaurant",
                    where: {
                        user_id: userId
                    },
                    require: false
                }
            ],
            attributes: [
                [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn( 'SUM', Sequelize.col( 'orders.bill_amount' ) ),
                        0
                    ),
                    'total_sales'
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
        const expensesMap = new Map(
            orders.map( ( order ) => [
                order.get( 'date' ),
                order.get( 'total_sales' )
            ] )
        );
        const resultArray = dateArray.map( ( date ) => ( {
            date: date.toISOString().split( 'T' )[ 0 ],
            total_sales: Number(
                expensesMap.get( date.toISOString().split( 'T' )[ 0 ] ) || 0
            )
        } ) );

        return getResult( res, 200, resultArray, "total sales fetched successfully." );
    } catch ( error )
    {
        console.error( "error in total sales with filter : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};