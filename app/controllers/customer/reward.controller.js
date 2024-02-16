const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.reward = async ( req, res ) =>
{
    try
    {
        const customerId = req.customerId;

        let rewardList = [], totalDiscount = 0;

        const orders = await db.orders.findAll( {
            include: [
                {
                    model: db.restaurants,
                    attributes: [ "id", "store_name" ],
                    as: "restaurant",
                    require: false
                }
            ],
            where: { customer_id: customerId },
            attributes: [ "id", "order_date", "discount_given" ]
        } );

        orders.forEach( order =>
        {
            const store = order.restaurant;

            rewardList.push( {
                store_name: store ? store.store_name : '',
                discount: parseFloat( order.discount_given ),
                date: order.order_date,
            } );
        } );

        for ( const list of rewardList )
        {
            totalDiscount += parseFloat( list.discount );
        }

        const data = { my_rewards: rewardList, total_discount: totalDiscount };

        return getResult( res, 200, data, "customer's reward fetched successfully." );
    } catch ( error )
    {
        console.error( "error in customer reward : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};