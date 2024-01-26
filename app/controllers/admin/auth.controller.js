const { getResult, getErrorResult } = require( '../../base/baseController' );
const db = require( '../../models' )
const { generateHashPwd, generateJwtToken, comparePwd } = require( "./auth.helper" );

exports.createAdmin = async () =>
{
    const mobile = "9067757747";
    const email = "admin@gmail.com";
    const password = "admin123";

    const hashedPwd = await generateHashPwd( password );
    await db.admin.create( {
        mobile,
        email,
        password: hashedPwd
    } )
}

exports.sendCode = async ( req, res ) =>
{
    try
    {
        const { email, password } = req.body;
        let code = '123456';
        let date = new Date();

        const admin = await db.admin.findOne( { where: { email: email } } )

        const verificationCode = await db.admin_verification_codes.findOne( {
            where: { nametext: admin.mobile }
        } );

        const matchPwd = await comparePwd( password, admin.password );
        if ( !matchPwd )
        {
            return getErrorResult( res, 404, 'Invalid credential.' )
        }

        if ( !verificationCode )
        {
            const createCode = await db.admin_verification_codes.create( {
                admin_id: admin.id,
                nametext: admin.mobile,
                type: 'MOBILE',
                code,
                expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
            } );

            if ( createCode )
            {
                return getResult( res, 200, 1, "code sent successfully." )
            } else
            {
                return getErrorResult( res, 500, 'somthing went wrong.' )
            }
        } else
        {
            const id = verificationCode.id
            const updateCode = await db.admin_verification_codes.update(
                {
                    admin_id: admin.id,
                    code,
                    expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 )
                },
                {
                    where: { id }
                } );

            if ( updateCode )
            {
                return getResult( res, 200, 1, "code sent successfully." )
            } else
            {
                return getErrorResult( res, 500, 'somthing went wrong.' )
            }
        }
    } catch ( error )
    {
        console.log( "error in send admin code : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    };
};

exports.resendCode = async ( req, res ) =>
{
    try
    {
        const { email, password } = req.body;
        let code = '123456';
        let date = new Date();

        const admin = await db.admin.findOne( { where: { email: email } } )

        const verificationCode = await db.admin_verification_codes.findOne( {
            attributes: [ 'id', 'expired_date' ],
            where: { nametext: admin.mobile }
        } );

        if ( !verificationCode )
        {
            const createCode = await db.admin_verification_codes.create( {
                admin_id: admin.id,
                nametext: admin.mobile,
                type: 'MOBILE',
                code,
                expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
            } );

            if ( createCode )
            {
                return getResult( res, 200, 1, "code sent successfully." )
            } else
            {
                return getResult( res, 200, 1, "code sent successfully." )
            }
        } else
        {
            const id = verificationCode.id
            const updateCode = await db.admin_verification_codes.update(
                {
                    code,
                    expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 )
                },
                {
                    where: { id }
                } );

            if ( updateCode )
            {
                return getResult( res, 200, 1, "code sent successfully." )
            } else
            {
                return getErrorResult( res, 500, 'somthing went wrong.' )
            }
        }
    } catch ( error )
    {
        console.log( "error in resend customer code : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    };
}

exports.verifyAdmin = async ( req, res ) =>
{
    const { code, mobile } = req.body;

    try
    {
        const verificationCode = await db.admin_verification_codes.findOne( {
            attributes: [ 'id', 'expired_date' ],
            where: {
                code,
                nametext: mobile
            }
        } )
        if ( !verificationCode )
        {
            return getErrorResult( res, 400, 'Invalid verification code.' )
        } else
        {
            var date = new Date();
            if (
                new Date( date.getTime() + date.getTimezoneOffset() * 60000 ) <=
                new Date( verificationCode.expired_date.getTime() + date.getTimezoneOffset() * 60000 )
            )
            {
                const admin = await db.admin.findOne( { where: { mobile } } );
                if ( !admin )
                {
                    return getErrorResult( res, 404, 'admin not found with this mobile.' )
                }

                const accessToken = generateJwtToken( admin );

                const result = {
                    accessToken: accessToken
                }

                return getResult( res, 200, result, "admin login successfully." )
            }
            else
            {
                return getErrorResult( res, 400, 'Invalid verification code.' )
            }
        }

    } catch ( error )
    {
        console.log( "error in verify admin : ", error );
        return getErrorResult( res, 500, 'somthing went wrong.' )
    };
};