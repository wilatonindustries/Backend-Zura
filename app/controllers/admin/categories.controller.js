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
            return getResult( res, 200, data, "Category created successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in create category : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        } );
};

exports.findAll = async ( req, res ) =>
{
    await db.categories.findAll()
        .then( data =>
        {
            return getResult( res, 200, data, "Get all category successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in get all category : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        } );
};

exports.findOne = async ( req, res ) =>
{
    const id = req.params.id;

    await db.categories.findByPk( id )
        .then( data =>
        {
            return getResult( res, 200, data, "Get category successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in get category by id : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
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
            if ( category.image === null )
            {
                updatedValue.image = `${ categoryImagePath }/${ req.file.filename }`;
            } else
            {
                fs.rmSync( `assets/${ category.image }`, {
                    force: true,
                } );
                console.log( "Deleted previous category image" );
                updatedValue.image = `${ categoryImagePath }/${ req.file.filename }`;
            }
        } catch ( err )
        {
            console.error( "Error deleting previous category image file:", err );
        }
    }

    await db.categories.update( updatedValue, {
        where: { id: id },
    } )
        .then( data =>
        {
            if ( !data )
            {
                return getErrorResult( res, 404, `Category was not found with id ${ id }` );
            }
            return getResult( res, 200, 1, "Category updated successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in update category : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
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
                return getErrorResult( res, 404, `Category was not found with id ${ id }` );
            }
            return getResult( res, 200, data, "Category deleted successfully" );
        } )
        .catch( err =>
        {
            console.error( "err in delete category : ", err );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        } );
};