const config = require( "../../config/config" );
const Jwt = require( "jsonwebtoken" );

exports.generateJwtToken = ( customer ) =>
{
    return Jwt.sign(
        { customerId: customer.id },
        config.auth.secret_key,
        {
            expiresIn: 5 * 100000
        }
    );
};
