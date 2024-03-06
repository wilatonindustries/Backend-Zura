const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.billAnalysis = async ( req, res ) =>
{
    try
    {
        const { store_id, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orders, bill_analysis = [];
        if ( store_id && filter )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        where: {
                            id: store_id,
                            is_delete: false
                        },
                        require: false
                    },
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'id', 'bill_amount' ],
                order: [ [ Sequelize.fn( 'DATE', Sequelize.col( 'orders.bill_amount' ) ), 'ASC' ] ]
            } );

            orders.forEach( order =>
            {
                bill_analysis.push( {
                    bill_amount: parseFloat( order.bill_amount )
                } );
            } );

        } else
        {
            return getErrorResult( res, 400, "store id and filter are require." );
        }
        return getResult( res, 200, bill_analysis, "bill analysis fetched successfully." );
    } catch ( error )
    {
        console.error( "error in bill analysis with filter : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.countBillAnalysis = async ( req, res ) =>
{
    try
    {
        const result = await db.orders.findAll( {
            attributes: [
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn( 'SUM', Sequelize.col( 'bill_amount' ) ),
                        0
                    ),
                    'total_bill_analysis'
                ],
            ],
        } );

        const total_bill_analysis = parseFloat( result[ 0 ].dataValues.total_bill_analysis );

        return getResult( res, 200, { total_bill_analysis: total_bill_analysis }, "total bill analysis fetched successfully." );
    } catch ( error )
    {
        console.error( "error in count bill analysis : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};