const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );

exports.getSocialMedias = async ( req, res ) =>
{
    try
    {
        const socialMedia = await db.social_medias.findAll( {} );

        return getResult( res, 200, socialMedia ? socialMedia : [], "social media's details fetched successfully." );
    } catch ( error )
    {
        console.error( "error in fetch social media's details : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.updateSocialMedias = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const { description, status, link } = req.body;

        const socialMedia = await db.social_medias.findOne( { where: { id: id } } );

        if ( !socialMedia )
        {
            return getErrorResult( res, 404, 'not found.' );
        }

        let updatedValue = {};

        if ( description ) { updatedValue.description = description; }
        if ( status !== undefined ) { updatedValue.status = status; }
        if ( link ) { updatedValue.link = link; }

        await db.social_medias.update( updatedValue, { where: { id: id } } );

        return getResult( res, 200, 1, "social media's details updated successfully." );
    } catch ( error )
    {
        console.error( "error in update social media's details : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};