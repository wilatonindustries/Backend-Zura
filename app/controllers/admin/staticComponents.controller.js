const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getStaticComponents = async ( req, res ) =>
{
    try
    {
        const aboutApp = await db.static_components.findAll( {} );

        return getResult( res, 200, aboutApp ? aboutApp : [], "about app details fetched successfully" );
    } catch ( error )
    {
        console.error( "error in fetch about app details : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};

exports.updateComponents = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { about_us, terms_of_service, privacy_policy, faq } = req.body;

        const aboutApp = await db.static_components.findOne( { where: { id: id } } );

        if ( !aboutApp )
        {
            return getErrorResult( res, 404, 'not found' );
        }

        let updatedValue = {};

        if ( about_us ) { updatedValue.about_us = about_us; }
        if ( terms_of_service ) { updatedValue.terms_of_service = terms_of_service; }
        if ( privacy_policy ) { updatedValue.privacy_policy = privacy_policy; }
        if ( faq ) { updatedValue.faq = faq; }

        await db.static_components.update( updatedValue, { where: { id: id } } );

        return getResult( res, 200, 1, "about app details updated successfully" );
    } catch ( error )
    {
        console.error( "error in update about app details : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    }
};