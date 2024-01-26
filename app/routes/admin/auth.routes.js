const controller = require( "../../controllers/admin/auth.controller" );

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
    "/api/admin/send-code",
    controller.sendCode
  );

  app.post(
    "/api/admin/resend-code",
    controller.resendCode
  );

  app.post(
    "/api/admin/login",
    controller.verifyAdmin
  );

};
