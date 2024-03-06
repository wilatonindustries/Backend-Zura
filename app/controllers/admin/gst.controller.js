const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );
const Sequelize = db.Sequelize;
const Op = db.Op;

exports.totalGstBillWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );

        let orders, gstList = [], gst = 5;

        if ( store_name )
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
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
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [
                    [ Sequelize.fn( 'DISTINCT', Sequelize.col( 'orders.restaurant_id' ) ), 'restaurant_id' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.bill_amount' ) ),
                            0
                        ),
                        'bill_amount'
                    ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.gst_rate' ) ),
                            0
                        ),
                        'gst_rate'
                    ],
                ],
                as: 'orders',
                group: [ 'restaurant.store_name' ],
            } );

            const GST = await db.configurations.findOne( { where: { type: 'gst' }, attributes: [ 'value' ] } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const billAmt = parseFloat( order.dataValues.bill_amount );
                const gstAmt = parseFloat( order.dataValues.gst_rate );

                gstList.push( {
                    store_name: store ? store.store_name : '',
                    bill_amount: billAmt,
                    gst: parseFloat( GST.value ),
                    gst_amount: gstAmt
                } );
            } );
        } else
        {
            orders = await db.orders.findAll( {
                include: [
                    {
                        model: db.restaurants,
                        attributes: [ "id", "store_name" ],
                        as: "restaurant",
                        where: { is_delete: false },
                        require: false
                    }
                ],
                where: {
                    createdAt: {
                        [ Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [
                    [ Sequelize.fn( 'DISTINCT', Sequelize.col( 'orders.restaurant_id' ) ), 'restaurant_id' ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.bill_amount' ) ),
                            0
                        ),
                        'bill_amount'
                    ],
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn( 'SUM', Sequelize.col( 'orders.gst_rate' ) ),
                            0
                        ),
                        'gst_rate'
                    ],
                ],
                as: 'orders',
                group: [ 'restaurant.store_name' ],
            } );

            const GST = await db.configurations.findOne( { where: { type: 'gst' }, attributes: [ 'value' ] } );

            orders.forEach( order =>
            {
                const store = order.restaurant;

                const billAmt = parseFloat( order.dataValues.bill_amount );
                const gstAmt = parseFloat( order.dataValues.gst_rate );

                gstList.push( {
                    store_name: store ? store.store_name : '',
                    bill_amount: billAmt,
                    gst: parseFloat( GST.value ),
                    gst_amount: gstAmt
                } );
            } );
        }
        const data = {
            total_gst: await totalGST(),
            all_gst_details: gstList
        };
        return getResult( res, 200, data, "total GST fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch total GST : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

async function totalGST ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'gst_amt' ) ),
                    0
                ),
                'total_gst'
            ],
        ],
    } );

    const total_gst = parseFloat( result[ 0 ].dataValues.total_gst );

    return total_gst;
}
