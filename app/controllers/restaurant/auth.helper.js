const config = require( "../../config/config" );
const Jwt = require( "jsonwebtoken" );

exports.generateJwtToken = ( user ) =>
{
    return Jwt.sign(
        { userId: user.id },
        config.auth.secret_key,
        {
            expiresIn: 5 * 100000
        }
    );
};
