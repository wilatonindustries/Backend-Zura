const { getResult, getErrorResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { encryptData, decryptdata } = require( "../../utils/helper" );
const { generateJwtToken } = require( "./auth.helper" );

exports.loginViaOTP = async ( req, res ) =>
{
    const mobile = req.body.mobile;

    if ( mobile.length === 10 )
    {
        try
        {
            let code = '123456';
            let date = new Date();

            const verificationCode = await db.customer_verification_codes.findOne( {
                where: { nametext: mobile }
            } );

            if ( !verificationCode )
            {
                const createCode = await db.customer_verification_codes.create( {
                    nametext: mobile,
                    type: 'MOBILE',
                    code,
                    expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
                } );

                if ( createCode )
                {
                    return getResult( res, 200, 1, "Code sent successfully" );
                } else
                {
                    return getErrorResult( res, 500, 'Somthing went wrong' );
                }
            } else
            {
                const id = verificationCode.id;
                const updateCode = await db.customer_verification_codes.update(
                    {
                        code,
                        expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 )
                    },
                    {
                        where: { id }
                    } );

                if ( updateCode )
                {
                    return getResult( res, 200, 1, "Code sent successfully" );
                } else
                {
                    return getErrorResult( res, 500, 'Somthing went wrong' );
                }
            }
        } catch ( error )
        {
            console.error( "error in send customer code : ", error );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        };
    } else
    {
        return getErrorResult( res, 400, 'Mobile number must be exactly 10 digits' );
    }
};

exports.resendCode = async ( req, res ) =>
{
    const mobile = req.body.mobile;

    if ( mobile.length === 10 )
    {
        try
        {
            let code = '123456';
            let date = new Date();

            const verificationCode = await db.customer_verification_codes.findOne( {
                attributes: [ 'id', 'expired_date' ],
                where: { nametext: mobile }
            } );

            if ( !verificationCode )
            {
                const createCode = await db.customer_verification_codes.create( {
                    nametext: mobile,
                    type: 'MOBILE',
                    code,
                    expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
                } );

                if ( createCode )
                {
                    return getResult( res, 200, 1, "Code sent successfully" );
                } else
                {
                    return getResult( res, 200, 1, "Code sent successfully" );
                }
            } else
            {
                const id = verificationCode.id;
                const updateCode = await db.customer_verification_codes.update(
                    {
                        code,
                        expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 )
                    },
                    {
                        where: { id }
                    } );

                if ( updateCode )
                {
                    return getResult( res, 200, 1, "Code sent successfully" );
                } else
                {
                    return getErrorResult( res, 500, 'Somthing went wrong' );
                }
            }
        } catch ( error )
        {
            console.error( "error in resend customer code : ", error );
            return getErrorResult( res, 500, 'Somthing went wrong' );
        };
    } else
    {
        return getErrorResult( res, 400, 'Mobile number must be exactly 10 digits' );
    }
};

exports.verifyCode = async ( req, res ) =>
{
    const { mobile, code, device_name, device_token } = req.body;

    await db.customer_verification_codes.findOne( {
        attributes: [ 'id', 'expired_date' ],
        where: {
            code,
            nametext: mobile
        }
    } ).then( async ( verficationCode ) => 
    {
        if ( !verficationCode )
        {
            return getErrorResult( res, 400, 'Invalid verification code' );
        } else
        {
            var date = new Date();
            if (
                new Date( date.getTime() + date.getTimezoneOffset() * 60000 ) <=
                new Date( verficationCode.expired_date.getTime() + date.getTimezoneOffset() * 60000 )
            )
            {
                const customer = await db.customer.findOne( { where: { mobile } } );

                let accessToken = null;

                if ( !customer )
                {
                    const createCustomer = await db.customer.create( {
                        mobile,
                        is_mobile_verified: true,
                    } );

                    const createCustomerDetail = await db.customer_details.create( {
                        customer_id: createCustomer?.id,
                    } );

                    accessToken = generateJwtToken( createCustomer );
                    const result = {
                        is_mobile_verified: true,
                        accessToken: accessToken,
                        is_social: createCustomer.is_social,
                        device_token: device_token || null,
                        device_name: device_name || null,
                        name: createCustomer?.name || null,
                        area_name: createCustomerDetail?.area_name || null,
                        email: createCustomer?.email || null,
                        is_notified: createCustomer?.is_notified
                    };
                    return getResult( res, 200, result, "Mobile verified successfully" );
                }
                if ( customer.is_active === false )
                {
                    return getErrorResult( res, 400, 'Customer blocked' );
                }
                accessToken = generateJwtToken( customer );

                const customerId = customer.id;
                const customerDetail = await db.customer_details.findOne( {
                    attributes: [ 'id', 'customer_id', "area_name" ],
                    where: {
                        customer_id: customerId
                    }
                } );

                const result = {
                    is_mobile_verified: true,
                    accessToken: accessToken,
                    is_social: customer.is_social,
                    device_token: device_token || null,
                    device_name: device_name || null,
                    name: customer.name || null,
                    area_name: customerDetail?.area_name || null,
                    email: customer.email || null,
                    is_notified: customer.is_notified
                };
                return getResult( res, 200, result, "Mobile verified successfully" );
            } else
            {
                return getErrorResult( res, 400, 'Invalid verification code' );
            }
        }
    } ).catch( error =>
    {
        console.error( "error in verify customer code : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    } );
};

exports.updateProfile = async ( req, res ) =>
{
    try
    {
        const { name, area_name, email, mobile, is_notified } = req.body;

        let updatedValue = {}, updateDetails = {};

        const customerId = req.customerId;
        const customerAuth = await db.customer.findOne( { where: { id: customerId } } );

        if ( !customerAuth )
        {
            return getErrorResult( res, 404, 'Not found' );
        }

        if ( customerAuth.is_active === false )
        {
            return getErrorResult( res, 400, 'Customer blocked' );
        }

        if ( area_name ) { updateDetails.area_name = area_name; }

        const updateCustomerDetail = await db.customer_details.update( updateDetails, { where: { customer_id: customerId } } );

        if ( name ) { updatedValue.name = name; }

        if ( email )
        {
            const customer = await db.customer.findOne( { where: { email: email } } );

            if ( customer )
            {
                return getErrorResult( res, 403, 'Already exists ' );
            }
            updatedValue.email = customerAuth.email === null ? email : customerAuth.email;
        }

        if ( mobile )
        {
            const customer = await db.customer.findOne( { where: { mobile: mobile } } );

            if ( customer )
            {
                return getErrorResult( res, 403, 'Already exists ' );
            }
            updatedValue.mobile = customerAuth.mobile === null ? mobile : customerAuth.mobile;
        }

        if ( is_notified !== undefined ) { updatedValue.is_notified = is_notified; }

        const updateCustomer = await db.customer.update( updatedValue, { where: { id: customerId } } );

        if ( !updateCustomer || !updateCustomerDetail )
        {
            return getErrorResult( res, 500, 'Somthing went wrong' );
        }
        await db.customer.update( {
            is_profile_updated: true,
        },
            {
                where: { id: customerId }
            } );

        return getResult( res, 200, 1, "Profile updated successfully" );
    } catch ( error )
    {
        console.error( "error in update customer profile : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    };
};

exports.socialLogin = async ( req, res ) =>
{
    try
    {
        const data = req.body;
        const decryptedData = await decryptdata( data.data );
        const parsedData = decryptedData;

        const customer = await db.customer.findOne( { where: { email: parsedData } } );

        let customer_id;
        let accessToken = null;
        if ( customer )
        {
            customer_id = customer.id;

            let customerDetail = await db.customer_details.findOne( {
                attributes: [ 'id', 'area_name', "customer_id" ],
                where: { customer_id }
            } );

            await db.customer.update( {
                is_social: true,
            }, {
                where: { id: customer.id }
            } );

            accessToken = generateJwtToken( customer );

            const resultnew = {
                is_email_verified: customer.is_email_verified,
                is_profile_updated: customer.is_profile_updated,
                accessToken: accessToken,
                name: customer.name || null,
                mobile: customer.mobile || null,
                email: customer.email || null,
                is_social: customer.is_social,
                is_notified: customer.is_notified
            };
            return getResult( res, 200, resultnew, "Customer social login successfully" );
        } else
        {
            const createCustomer = await db.customer.create( {
                email: parsedData,
                is_email_verified: true,
                is_social: true
            } );

            await db.customer_details.create( {
                customer_id: createCustomer?.id
            } );

            accessToken = generateJwtToken( createCustomer );

            const resultnew = {
                is_email_verified: true,
                is_profile_updated: false,
                accessToken: accessToken,
                name: createCustomer?.name || null,
                mobile: createCustomer?.mobile || null,
                email: createCustomer?.email || null,
                is_social: createCustomer.is_social,
                is_notified: createCustomer?.is_notified
            };
            return getResult( res, 200, resultnew, "Customer social login successfully" );
        }
    } catch ( error )
    {
        console.error( "error in customer social login : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    };
};

exports.dataEncrypt = async ( req, res ) =>
{
    try
    {
        const email = req.body.email;
        const encryptedData = await encryptData( JSON.stringify( email ) );
        return getResult( res, 200, encryptedData, "data encrypted successfully" );
    } catch ( error )
    {
        console.error( "error in customer data encrypt : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    };

};

exports.manageDeviceToken = async ( req, res ) =>
{
    try
    {
        const { token } = req.body;

        const customerId = req.customerId;
        const customer = await db.customer.findOne( { where: { id: customerId } } );

        if ( !customer )
        {
            return getErrorResult( res, 404, `Customer not found.` );
        }

        await db.customer.update( { fcm_token: token }, { where: { id: customerId } } );
        return getResult( res, 200, 1, "Device token managed successfully" );
    } catch ( error )
    {
        console.error( "error in manage device token : ", error );
        return getErrorResult( res, 500, 'Somthing went wrong' );
    };

};