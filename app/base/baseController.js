exports.getResult = ( res, code, data, message ) =>
{
    res.status( code ).json( {
        code: code,
        message: message,
        data: data
    } );
}

exports.getErrorResult = ( res, code, message ) =>
{
    res.status( code ).json( {
        code: code,
        message: message,
    } );
}