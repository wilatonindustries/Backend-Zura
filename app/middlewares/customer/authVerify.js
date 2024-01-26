const jwt = require( "jsonwebtoken" );
const config = require( "../../config/config.js" );

verifyAccessToken = ( req, res, next ) =>
{
    let token = req.headers[ "x-access-token" ];

    if ( !token )
    {
        return res.status( 403 ).send( {
            message: "No token provided!"
        } );
    }

    jwt.verify( token, config.auth.secret_key, ( err, decoded ) =>
    {
        if ( err )
        {
            return res.status( 401 ).send( {
                message: "Unauthorized!"
            } );
        }

        req.customerId = decoded.customerId;

        next();
    } );
};

const customerVerify = {
    verifyAccessToken: verifyAccessToken,
};

module.exports = customerVerify;