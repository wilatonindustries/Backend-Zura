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
                            store_name
                        },
                        require: false
                    }
                ],
                attributes: [
                    [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.createdAt' ) ), 'date' ],
                    [
                        Sequelize.literal( 'COALESCE(SUM(CAST(orders.bill_amount AS DECIMAL)) * (SUM(CAST(orders.discount_from_restaurant AS DECIMAL)) / 100), 0)' ),
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
                        Sequelize.literal( 'COALESCE(SUM(CAST(orders.bill_amount AS DECIMAL)) * (SUM(CAST(orders.discount_from_restaurant AS DECIMAL)) / 100), 0)' ),
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

async function totalSales ()
{
    const total_sales = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                    0
                ),
                'total_sales'
            ]
        ],
    } );
    return total_sales;
}

async function totalDiscount ()
{
    const total_discount_from_restaurant = await db.orders.findAll( {
        attributes: [
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
    return total_discount_from_restaurant;
}

async function discountReceived ()
{
    const total_sales_result = await totalSales();
    const discount_from_restaurant_result = await totalDiscount();

    const total_sales = parseFloat( total_sales_result[ 0 ].dataValues.total_sales );
    const discount_from_restaurant = parseFloat( discount_from_restaurant_result[ 0 ].dataValues.discount_from_restaurant );

    const total_discount_received = total_sales * discount_from_restaurant / 100;

    return total_discount_received;
}
