const fs = require( 'fs' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const { bannerImagePath } = require( "../../config/config_constant" );
const db = require( "../../models" );

exports.create = async ( req, res ) =>
{
    await db.banners.create( {
        name: req.body.name,
        image: req.file ? `${ bannerImagePath }/${ req.file.filename }` : null,
    } ).then( data =>
    {
        return getResult( res, 200, data, "banner created successfully." )
    } ).catch( err =>
    {
        console.log( "err in create banner : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    } )
}

exports.findAll = async ( req, res ) =>
{
    await db.banners.findAll()
        .then( data =>
        {
            return getResult( res, 200, data, "get all banner successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in get all banner : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
};

exports.findOne = async ( req, res ) =>
{
    const id = req.params.id;

    await db.banners.findByPk( id )
        .then( data =>
        {
            return getResult( res, 200, data, "get banner successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in get banner by id : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
};

exports.update = async ( req, res ) =>
{
    const id = req.params.id;
    let updatedValue = {}

    if ( req.body.name )
    {
        updatedValue.name = req.body.name;
    }

    const banner = await db.banners.findByPk( id );

    if ( req.file )
    {
        try
        {
            fs.rmSync( `assets/${ banner.image }`, {
                force: true,
            } );
            console.log( "Deleted previous banner image" );
        } catch ( err )
        {
            console.error( "Error deleting previous banner image file:", err );
        }
        updatedValue.image = `${ bannerImagePath }/${ req.file.filename }`;
    }

    await db.banners.update( updatedValue, {
        where: { id: id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `banner was not found with id ${ id }` )
            }
            return getResult( res, 200, 1, "banner updated successfully." )
        } ).catch( err =>
        {
            console.log( "err in update banner : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
};

exports.deleteById = async ( req, res ) =>
{
    const id = req.params.id;

    await db.banners.destroy( {
        where: { id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `banner was not found with id ${ id }` )
            }
            return getResult( res, 200, data, "banner deleted successfully." )
        } )
        .catch( err =>
        {
            console.log( "err in delete banner : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' )
        } );
};