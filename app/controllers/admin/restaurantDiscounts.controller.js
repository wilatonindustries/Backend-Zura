const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.defaultDiscount = () =>
{
    const defaultValue = [
        {
            "start_time": "07:00AM",
            "end_time": "10:00AM",
            "discount": "0",
            "discount_percentage": "0",
            "discount_commission": "0"
        },
        {
            "start_time": "10:00AM",
            "end_time": "12:00PM",
            "discount": "0",
            "discount_percentage": "0",
            "discount_commission": "0"
        },
        {
            "start_time": "12:00PM",
            "end_time": "03:00PM",
            "discount": "0",
            "discount_percentage": "0",
            "discount_commission": "0"
        },
        {
            "start_time": "03:00PM",
            "end_time": "07:00PM",
            "discount": "0",
            "discount_percentage": "0",
            "discount_commission": "0"
        },
        {
            "start_time": "07:00PM",
            "end_time": "10:00PM",
            "discount": "0",
            "discount_percentage": "0",
            "discount_commission": "0"
        },
        {
            "start_time": "10:00PM",
            "end_time": "12:00AM",
            "discount": "0",
            "discount_percentage": "0",
            "discount_commission": "0"
        }
    ];

    return defaultValue;
};

exports.discountChanges = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { is_changes_accept } = req.body;

        const restaurant = await db.restaurants.findOne( { where: { id, is_delete: false } } );
        if ( !restaurant )
        {
            return getErrorResult( res, 400, `restaurant not found with id ${ id }.` );
        }
        if ( is_changes_accept === true )
        {
            const discount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id } } );
            const updateDis = discount.changes_discount_json;

            await db.restaurant_discounts.update( {
                is_changes_accept,
                discount_json: updateDis,
                changes_discount_json: null
            }, { where: { restaurant_id: restaurant.id } } );

            const discountData = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id, is_delete: false } } );
            return getResult( res, 200, discountData, "discount changes accepted successfully." );
        } else
        {
            await db.restaurant_discounts.update( {
                is_changes_accept,
                changes_discount_json: null
            }, { where: { restaurant_id: restaurant.id } } );

            const discount = await db.restaurant_discounts.findOne( { where: { restaurant_id: restaurant.id, is_delete: false } } );
            return getResult( res, 200, discount, "discount changes declined successfully." );
        }
    } catch ( error )
    {
        console.error( "error in discount changes : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};