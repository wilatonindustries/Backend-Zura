const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const Sequelize = db.Sequelize;

exports.restaurantPayoutsOrHistories = async ( req, res ) =>
{
    try
    {
        const payoutesData = await paidPayouts();
        const unPayoutesData = await unPaidPayouts();

        let user_id, restaurant_id, total_given_to_res;

        const restaurantPayoutsResponse = [];
        const payoutsHistoriesResponse = [];

        for ( const payout of payoutesData )
        {
            let createPayout, updatePayout;
            user_id = payout.user_id;
            restaurant_id = payout.restaurant_id;
            total_given_to_res = payout.total_given_to_res;

            const isPayout = await db.restaurants_payouts.findOne( { where: { user_id: user_id, restaurant_id: restaurant_id } } );

            if ( isPayout )
            {
                updatePayout = await db.restaurants_payouts.update( {
                    amount: total_given_to_res
                }, {
                    where: {
                        user_id: user_id,
                        restaurant_id: restaurant_id,
                    }
                } );
            } else
            {
                createPayout = await db.restaurants_payouts.create( {
                    user_id: user_id,
                    restaurant_id: restaurant_id,
                    amount: total_given_to_res
                } );
            }
            if ( createPayout || updatePayout )
            {
                pay = await db.restaurants_payouts.findOne( { where: { user_id: user_id, restaurant_id: restaurant_id } } );
                restaurantPayoutsResponse.push( {
                    user_id: pay.user_id,
                    restaurant_id: pay.restaurant_id,
                    amount: pay.amount
                } );
            }
        }
        for ( const payout of unPayoutesData )
        {
            let createPayoutHistory, updatePayoutHistory;
            user_id = payout.user_id;
            restaurant_id = payout.restaurant_id;
            total_given_to_res = payout.total_given_to_res;

            const isPayoutHistory = await db.payout_histories.findOne( { where: { user_id: user_id, restaurant_id: restaurant_id } } );

            if ( isPayoutHistory )
            {
                updatePayoutHistory = await db.payout_histories.update( {
                    amount: total_given_to_res
                }, {
                    where: {
                        user_id: user_id,
                        restaurant_id: restaurant_id,
                    }
                } );
            } else
            {
                createPayoutHistory = await db.payout_histories.create( {
                    user_id: user_id,
                    restaurant_id: restaurant_id,
                    amount: total_given_to_res
                } );
            }
            if ( createPayoutHistory || updatePayoutHistory )
            {
                unpay = await db.payout_histories.findOne( { where: { user_id: user_id, restaurant_id: restaurant_id } } );
                payoutsHistoriesResponse.push( {
                    user_id: unpay.user_id,
                    restaurant_id: unpay.restaurant_id,
                    amount: unpay.amount
                } );
            }
        }

        const data = {
            restaurant_payouts: restaurantPayoutsResponse,
            payouts_histories: payoutsHistoriesResponse
        };
        return getResult( res, 200, data, "restaurant payouts or histories created successfully." );
    } catch ( error )
    {
        console.error( "error in fetch total restaurant payouts : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

async function paidPayouts ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [ Sequelize.fn( 'DISTINCT', Sequelize.col( 'orders.restaurant_id' ) ), 'restaurant_id' ],
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'given_to_res' ) ),
                    0
                ),
                'total_given_to_res'
            ],
            'restaurant_id', 'user_id'
        ],
        where: { is_paid: true },
        group: [ 'orders.restaurant_id' ],
    } );

    const mappedData = result.map( item => ( {
        user_id: item.dataValues.user_id,
        restaurant_id: item.dataValues.restaurant_id,
        total_given_to_res: parseFloat( item.dataValues.total_given_to_res )
    } ) );

    return mappedData;
}

async function unPaidPayouts ()
{
    const result = await db.orders.findAll( {
        attributes: [
            [ Sequelize.fn( 'DISTINCT', Sequelize.col( 'orders.restaurant_id' ) ), 'restaurant_id' ],
            [
                Sequelize.fn(
                    'COALESCE',
                    Sequelize.fn( 'SUM', Sequelize.col( 'given_to_res' ) ),
                    0
                ),
                'total_given_to_res'
            ],
            'restaurant_id', 'user_id'
        ],
        where: { is_paid: false },
        group: [ 'orders.restaurant_id' ],
    } );

    const mappedData = result.map( item => ( {
        user_id: item.dataValues.user_id,
        restaurant_id: item.dataValues.restaurant_id,
        total_given_to_res: parseFloat( item.dataValues.total_given_to_res )
    } ) );

    return mappedData;
}
