const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { getDataForFilter } = require( "../../utils/helper" );

exports.totalGstBillWithFilter = async ( req, res ) =>
{
    try
    {
        const { store_name, filter } = req.body;
        const [ startDate, endDate ] = getDataForFilter( filter );
        let gstAmt = [];

        const restaurants = await db.restaurants.findAll( {
            where: { store_name: store_name }
        } );

        const ordersPromises = restaurants.map( async ( restaurant ) =>
        {
            const orders = await db.orders.findAll( {
                where: {
                    [ db.Op.or ]: [
                        { restaurant_id: restaurant.id },
                    ],
                    createdAt: {
                        [ db.Op.between ]: [ startDate, endDate ]
                    }
                },
                attributes: [ 'createdAt', 'bill_amount', 'gst' ]
            } );

            const gstData = orders.map( order =>
            {
                const billAmount = parseFloat( order.bill_amount );
                const gst = parseFloat( order.gst );

                const gstAmount = billAmount + ( billAmount * gst / 100 );
                return {
                    store_name: restaurant.store_name,
                    bill_amount: billAmount,
                    gst: gst,
                    gst_amount: gstAmount
                }
            } );

            gstAmt.push( ...gstData );
            return gstData;
        } )
        await Promise.all( ordersPromises );

        const totalGstAmount = gstAmt.reduce( ( total, order ) => total + order.gst_amount, 0 );

        const data = {
            total_gst_bill: totalGstAmount,
            bill_details: gstAmt
        }
        return getResult( res, 200, data, "total GST calculated successfully." )
    } catch ( error )
    {
        console.error( "error in total GST calculated : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    }
}