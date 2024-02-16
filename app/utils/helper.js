const CryptoJS = require( 'crypto-js' );
const moment = require( 'moment' );
const config = require( "../config/config" );

exports.getDataForFilter = ( filter ) =>
{
    const currentDate = moment();
    let startDate, endDate;

    switch ( filter )
    {
        case 'last_week':
            startDate = currentDate.clone().subtract( 6, 'days' );
            endDate = currentDate.clone();
            break;
        case 'this_month':
            startDate = currentDate.clone().startOf( 'month' ).add( 1, 'day' );
            endDate = currentDate.clone().add( 1, 'day' );
            break;
        case 'last_month':
            startDate = currentDate.clone().subtract( 1, 'months' );
            endDate = currentDate.clone();
            break;
        case 'last_three_months':
            startDate = currentDate.clone().subtract( 3, 'months' );
            endDate = currentDate.clone();
            break;
        case 'last_six_months':
            startDate = currentDate.clone().subtract( 6, 'months' );
            endDate = currentDate.clone();
            break;
        case 'last_year':
            startDate = currentDate.clone().subtract( 1, 'year' );
            endDate = currentDate.clone();
            break;
        default:
            throw new Error( 'Invalid filter' );

    }
    return [ startDate, endDate ];
};


exports.encryptData = async ( data ) =>
{
    try
    {
        const encryptedData = CryptoJS.AES.encrypt( data, config.AES.secretKey ).toString();
        return encryptedData;
    } catch ( error )
    {
        console.log( 'error in encryption : ', error );
    }
};

exports.decryptdata = async ( data ) =>
{
    try
    {
        const bytes = CryptoJS.AES.decrypt( data, config.AES.secretKey );

        if ( !bytes )
        {
            throw new Error( "Decryption failed" );
        }

        const originalText = bytes.toString( CryptoJS.enc.Utf8 );

        return originalText;
    } catch ( error )
    {
        console.log( 'error in decryption : ', error );
    }
};

exports.generateTransactionId = () =>
{
    const prefix = 'ZUR';
    const timestamp = Date.now();
    const transactionId = `${ prefix }${ timestamp }`;
    return transactionId;
};
