const controller = require( "../../controllers/restaurant/auth.controller" );
const { authVerify } = require( "../../middlewares" );

module.exports = function ( app )
{
    app.use( function ( req, res, next )
    {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    } );

    app.post(
        "/api/restaurant/auth/send-code",
        controller.sendCode
    );

    app.post(
        "/api/restaurant/auth/resend-code",
        controller.resendCode
    );

    app.post(
        "/api/restaurant/auth/login",
        controller.loginViaOtp
    );

    app.post(
        "/api/restaurant/auth/social-login",
        controller.socialLogin
    );

    app.post(
        "/api/restaurant/auth/encrypt",
        controller.dataEncrypt
    );

    app.post(
        "/api/restaurant/auth/update-profile",
        [ authVerify.verifyAccessToken ],
        controller.updateProfile
    );

};
