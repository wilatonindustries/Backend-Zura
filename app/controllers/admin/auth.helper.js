const config = require( "../../config/config" );
const Jwt = require( "jsonwebtoken" );
const bcrypt = require( 'bcryptjs' );
const { getErrorResult } = require( "../../base/baseController" );

exports.generateJwtToken = ( admin ) =>
{
    return Jwt.sign(
        { adminId: admin.id },
        config.auth.secret_key,
        {
            expiresIn: 5 * 100000
        }
    );
};

exports.generateHashPwd = async ( password ) =>
{
    try
    {
        const hashedPwd = await bcrypt.hash( password, 10 );

        return hashedPwd;
    } catch ( error )
    {
        console.error( "error in generate hash password : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};

exports.comparePwd = async ( Pwd, hashedPwd ) =>
{
    try
    {
        const passwordMatch = await bcrypt.compare( Pwd, hashedPwd );

        return passwordMatch;
    } catch ( error )
    {
        console.error( "error in generate hash password : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' );
    }
};