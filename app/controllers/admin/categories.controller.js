const fs = require( 'fs' );
const { getErrorResult, getResult } = require( "../../base/baseController" );
const { categoryImagePath } = require( "../../config/config_constant" );
const db = require( "../../models" );

exports.create = async ( req, res ) =>
{
    await db.categories.create( {
        name: req.body.name,
        image: req.file ? `${ categoryImagePath }/${ req.file.filename }` : null,
    } )
        .then( data =>
        {
            return getResult( res, 200, data, "category created successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in create category : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.findAll = async ( req, res ) =>
{
    await db.categories.findAll()
        .then( data =>
        {
            return getResult( res, 200, data, "get all category successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in get all category : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.findOne = async ( req, res ) =>
{
    const id = req.params.id;

    await db.categories.findByPk( id )
        .then( data =>
        {
            return getResult( res, 200, data, "get category successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in get category by id : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.update = async ( req, res ) =>
{
    const id = req.params.id;

    const updatedValue = {};

    if ( req.body.name )
    {
        updatedValue.name = req.body.name;
    }

    const category = await db.categories.findByPk( id );

    if ( req.file )
    {
        try
        {
            fs.rmSync( `assets/${ category.image }`, {
                force: true,
            } );
            console.log( "Deleted previous category image" );
        } catch ( err )
        {
            console.error( "Error deleting previous category image file:", err );
        }
        updatedValue.image = `${ categoryImagePath }/${ req.file.filename }`;
    }

    await db.categories.update( updatedValue, {
        where: { id: id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `category was not found with id ${ id }` );
            }
            return getResult( res, 200, 1, "category updated successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in update category : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};

exports.deleteById = async ( req, res ) =>
{
    const id = req.params.id;

    await db.categories.destroy( {
        where: { id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `category was not found with id ${ id }` );
            }
            return getResult( res, 200, data, "category deleted successfully." );
        } )
        .catch( err =>
        {
            console.error( "err in delete category : ", err );
            return getErrorResult( res, 500, 'somthing went wrong.' );
        } );
};