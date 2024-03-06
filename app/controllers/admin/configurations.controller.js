const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getConfigurations = async ( req, res ) =>
{
    try
    {
        const configurations = await db.configurations.findAll();

        return getResult( res, 200, configurations ? configurations : [], "configurations list fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch configurations : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.updateConfigurations = async ( req, res ) =>
{
    try
    {
        const { type, value } = req.body;

        const configuration = await db.configurations.findOne( { where: { type: type } } );

        if ( !configuration )
        {
            return getErrorResult( res, 404, `configuration not found with type ${ type }` );
        }

        await db.configurations.update( { value: value }, { where: { type: type } } );

        return getResult( res, 200, 1, "configuration updated successfully." );
    } catch ( error )
    {
        console.error( "error in update configurations : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};