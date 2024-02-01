const { getErrorResult, getResult } = require( "../../base/baseController" );
const db = require( "../../models" );
const { encryptData, decryptdata } = require( "../../utils/helper" );
const { generateJwtToken } = require( "./auth.helper" );

exports.sendCode = async ( req, res ) =>
{
  try
  {
    const mobile = req.body.mobile;

    if ( mobile.length === 10 )
    {
      let code = '123456';
      let date = new Date();

      const user = await db.user.findOne( { where: { owner_mobile: mobile, is_accept: true, is_active: true } } );

      if ( user )
      {
        const verificationCode = await db.user_verification_codes.findOne( {
          where: { nametext: user.owner_mobile }
        } );

        if ( !verificationCode )
        {
          const createCode = await db.user_verification_codes.create( {
            user_id: user.id,
            nametext: user.owner_mobile,
            type: 'MOBILE',
            code,
            expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
          } );

          if ( createCode )
          {
            return getResult( res, 200, 1, "code sent successfully." );
          } else
          {
            return getErrorResult( res, 500, 'somthing went wrong.' );
          }
        }
        else
        {
          const id = verificationCode.id;
          const updateCode = await db.user_verification_codes.update(
            {
              code,
              expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 )
            },
            {
              where: { id }
            } );

          if ( updateCode )
          {
            return getResult( res, 200, 1, "code sent successfully." );
          } else
          {
            return getErrorResult( res, 500, 'somthing went wrong.' );
          }
        }
      } else
      {
        const createUser = await db.user.create( { owner_mobile: mobile } );

        const createCode = await db.user_verification_codes.create( {
          user_id: createUser?.id,
          nametext: createUser?.owner_mobile,
          type: 'MOBILE',
          code,
          expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
        } );

        if ( createCode )
        {
          return getResult( res, 200, 1, "code sent successfully." );
        } else
        {
          return getErrorResult( res, 500, 'somthing went wrong.' );
        }
      }
    } else
    {
      return getErrorResult( res, 400, 'Mobile number must be exactly 10 digits.' );
    }
  } catch ( error )
  {
    console.error( "error in send code : ", error );
    return getErrorResult( res, 500, 'somthing went wrong.' );
  };
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

      const user = await db.user.findOne( { where: { owner_mobile: mobile, is_accept: true, is_active: true } } );

      if ( !user )
      {
        await db.user.create( { owner_name, owner_mobile, is_accept: true } );
      }

      const verificationCode = await db.user_verification_codes.findOne( {
        attributes: [ 'id', 'expired_date' ],
        where: { nametext: user.owner_mobile }
      } );

      if ( !verificationCode )
      {
        const createCode = await db.user_verification_codes.create( {
          user_id: user.id,
          nametext: user.owner_mobile,
          type: 'MOBILE',
          code,
          expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 ),
        } );

        if ( createCode )
        {
          return getResult( res, 200, 1, "code sent successfully." );
        } else
        {
          return getErrorResult( res, 500, 'somthing went wrong.' );
        }
      } else
      {
        const id = verificationCode.id;
        const updateCode = await db.user_verification_codes.update(
          {
            code,
            expired_date: date.setTime( date.getTime() + 5 * 60 * 1000 )
          },
          {
            where: { id }
          } );

        if ( updateCode )
        {
          return getResult( res, 200, 1, "code sent successfully." );
        } else
        {
          return getErrorResult( res, 500, 'somthing went wrong.' );
        }
      }
    } catch ( error )
    {
      console.error( "error in resend code : ", error );
      return res.status( 500 ).json( { message: 'somthing went wrong' } );
    };
  } else
  {
    return getErrorResult( res, 400, 'Mobile number must be exactly 10 digits.' );
  }
};

exports.loginViaOtp = async ( req, res ) =>
{
  const { code, mobile } = req.body;

  await db.user_verification_codes.findOne( {
    attributes: [ 'id', 'expired_date' ],
    where: {
      code,
      nametext: mobile
    }
  } ).then( async ( verficationCode ) => 
  {
    if ( !verficationCode )
    {
      return getErrorResult( res, 400, 'Invalid verification code.' );
    } else
    {
      var date = new Date();
      if (
        new Date( date.getTime() + date.getTimezoneOffset() * 60000 ) <=
        new Date( verficationCode.expired_date.getTime() + date.getTimezoneOffset() * 60000 )
      )
      {
        const user = await db.user.findOne( { where: { owner_mobile: mobile, is_active: true } } );

        let accessToken = null;

        if ( !user )
        {
          return getErrorResult( res, 400, 'Invalid credential.' );
        }

        const restaurant = await db.restaurants.findOne( { where: { user_id: user.id } } );

        accessToken = generateJwtToken( user );

        const result = {
          is_mobile_verified: true,
          accessToken: accessToken,
          owner_name: user.owner_name || null,
          owner_mobile: user.owner_mobile || null,
          is_social: user.is_social,
          restaurant_id: restaurant?.id || null,
          restaurant_name: restaurant?.store_name || null,
          store_number: restaurant?.store_number || null
        };
        return getResult( res, 200, result, "mobile verified successfully." );
      } else
      {
        return getErrorResult( res, 400, 'Invalid verification code.' );
      }
    }
  } ).catch( error =>
  {
    console.error( "error in verify code : ", error );
    return getErrorResult( res, 500, 'somthing went wrong.' );
  } );
};

exports.updateProfile = async ( req, res ) =>
{
  try
  {
    const { owner_name, owner_mobile } = req.body;

    const userId = req.userId;

    const userAuth = await db.user.findOne( { where: { id: userId } } );
    if ( userAuth )
    {
      if ( userAuth.email === null )
      {
        let updateUser = await db.user.update( {
          owner_name: owner_name,
          owner_mobile: owner_mobile,
          is_profile_updated: true,
        },
          {
            where: {
              id: userId
            }
          } );
        if ( !updateUser )
        {
          return getErrorResult( res, 500, 'somthing went wrong.' );
        }
      } else
      {
        let updateUser = await db.user.update( {
          owner_name: owner_name,
          owner_mobile: owner_mobile,
          is_profile_updated: true,
        },
          {
            where: {
              id: userId
            }
          } );
        if ( !updateUser )
        {
          return getErrorResult( res, 500, 'somthing went wrong.' );
        }
      }
    }
    return getResult( res, 200, 1, "profile updated successfully." );
  } catch ( error )
  {
    console.error( "error in update profile : ", error );
    return getErrorResult( res, 500, 'somthing went wrong.' );
  };
};

exports.socialLogin = async ( req, res ) =>
{
  try
  {
    const data = req.body;
    const decryptedData = await decryptdata( data.data );
    const parsedData = decryptedData;

    const user = await db.user.findOne( { where: { email: parsedData, is_active: true } } );

    let accessToken = null;
    if ( !user )
    {
      return getErrorResult( res, 400, 'Invalid credential.' );
    } else
    {
      await db.user.update( {
        is_social: true,
      }, {
        where: { id: user.id }
      } );

      const restaurant = await db.restaurants.findOne( { where: { user_id: user.id } } );

      accessToken = generateJwtToken( user );

      const resultnew = {
        is_email_verified: user.is_email_verified,
        is_profile_updated: user.is_profile_updated,
        accessToken: accessToken,
        owner_name: user.owner_name || null,
        is_social: user.is_social,
        restaurant_id: restaurant?.id || null,
        restaurant_name: restaurant?.store_name || null,
        store_number: restaurant?.store_number || null
      };
      return getResult( res, 200, resultnew, "user social login successfully." );
    }
  } catch ( error )
  {
    console.error( "error in social login : ", error );
    return getErrorResult( res, 500, 'somthing went wrong.' );
  };
};

exports.dataEncrypt = async ( req, res ) =>
{
  try
  {
    const email = req.body.email;
    const encryptedData = await encryptData( JSON.stringify( email ) );
    return getResult( res, 200, encryptedData, "data encrypted successfully." );
  } catch ( error )
  {
    console.error( "error in data encrypt : ", error );
    return getErrorResult( res, 500, 'somthing went wrong.' );
  };
};