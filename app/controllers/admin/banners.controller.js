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
        return getResult( res, 200, data, "Banner created successfully" );
    } ).catch( err =>
    {
        console.error( "err in create banner : ", err );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    } );
};

exports.findAll = async ( req, res ) =>
{
    await db.banners.findAll()
        .then( data =>
        {
            return getResult( res, 200, data, "Get all banner successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in get all banner : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        } );
};

exports.findOne = async ( req, res ) =>
{
    const id = req.params.id;

    await db.banners.findByPk( id )
        .then( data =>
        {
            return getResult( res, 200, data, "Get banner successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in get banner by id : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        } );
};

exports.update = async ( req, res ) =>
{
    const id = req.params.id;
    let updatedValue = {};

    if ( req.body.name )
    {
        updatedValue.name = req.body.name;
    }

    const banner = await db.banners.findByPk( id );

    if ( req.file )
    {
        try
        {
            if ( banner.image === null )
            {
                updatedValue.image = `${ bannerImagePath }/${ req.file.filename }`;
            } else
            {
                fs.rmSync( `assets/${ banner.image }`, {
                    force: true,
                } );
                console.log( "Deleted previous banner image" );
                updatedValue.image = `${ bannerImagePath }/${ req.file.filename }`;
            }
        } catch ( err )
        {
            console.error( "Error deleting previous banner image file:", err );
        }
    }

    await db.banners.update( updatedValue, {
        where: { id: id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `Banner was not found with id ${ id }` );
            }
            return getResult( res, 200, 1, "Banner updated successfully" );
        } ).catch( err =>
        {
            console.error( "err in update banner : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
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
                return getErrorResult( res, 404, `Banner was not found with id ${ id }` );
            }
            return getResult( res, 200, data, "Banner deleted successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in delete banner : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        } );
};