const fs = require( 'fs' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const { timingBannerImagePath } = require( "../../config/config_constant" );
const db = require( "../../models" );

exports.create = async ( req, res ) =>
{
    await db.timing_banners.create( {
        timing: req.body.timing,
        image: req.file ? `${ timingBannerImagePath }/${ req.file.filename }` : null,
    } ).then( data =>
    {
        return getResult( res, 200, data, "timing banner created successfully." );
    } ).catch( err =>
    {
        console.error( "err in create timing banner : ", err );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    } );
};

exports.findAll = async ( req, res ) =>
{
    await db.timing_banners.findAll()
        .then( data =>
        {
            return getResult( res, 200, data, "get all timing banner successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in get all timing banner : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.findOne = async ( req, res ) =>
{
    const id = req.params.id;

    await db.timing_banners.findByPk( id )
        .then( data =>
        {
            return getResult( res, 200, data, "get timing banner successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in get timing banner by id : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.update = async ( req, res ) =>
{
    const id = req.params.id;
    let updatedValue = {};

    if ( req.body.timing )
    {
        updatedValue.timing = req.body.timing;
    }

    const timing_banner = await db.timing_banners.findByPk( id );

    if ( req.file )
    {
        try
        {
            if ( timing_banner.image === null )
            {
                updatedValue.image = `${ timingBannerImagePath }/${ req.file.filename }`;
            } else
            {
                fs.rmSync( `assets/${ timing_banner.image }`, {
                    force: true,
                } );
                console.log( "Deleted previous timing banner image" );
                updatedValue.image = `${ timingBannerImagePath }/${ req.file.filename }`;
            }
        } catch ( err )
        {
            console.error( "Error deleting previous timing banner image file:", err );
        }
    }

    await db.timing_banners.update( updatedValue, {
        where: { id: id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `timing banner was not found with id ${ id }` );
            }
            return getResult( res, 200, 1, " timing banner updated successfully." );
        } ).catch( err =>
        {
            console.error( "err in update timing banner : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.deleteById = async ( req, res ) =>
{
    const id = req.params.id;

    await db.timing_banners.destroy( {
        where: { id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, ` timing banner was not found with id ${ id }` );
            }
            return getResult( res, 200, data, "timing banner deleted successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in delete banner : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};