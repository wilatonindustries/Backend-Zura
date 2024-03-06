const controller = require( "../../controllers/customer/auth.controller" );
const { customerVerify } = require( "../../middlewares" );

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
        "/api/customer/auth/send-code",
        controller.loginViaOTP
    );

    app.post(
        "/api/customer/auth/resend-code",
        controller.resendCode
    );

    app.post(
        "/api/customer/auth/verify-code",
        controller.verifyCode
    );

    app.post(
        "/api/customer/auth/social-login",
        controller.socialLogin
    );

    app.post(
        "/api/customer/auth/encrypt",
        controller.dataEncrypt
    );

    app.post(
        "/api/customer/auth/update-profile",
        [ customerVerify.verifyAccessToken ],
        controller.updateProfile
    );

    app.put(
        "/api/customer/auth/manage-device-token",
        [ customerVerify.verifyAccessToken ],
        controller.manageDeviceToken
    );

};
