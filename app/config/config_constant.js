const config = require( "./config" );

const baseUrl = ( path = null ) =>
{
    let url = `http://${ config.HOST }:${ config.PORT }`;
    if ( process.env.isSSLEnable === "true" )
    {
        url = `https://${ config.HOST }:${ config.PORT }`;
    }
    return url + ( path ? `/${ path }` : "" );
};

const categoryImagePath = "uploads/category";
const bannerImagePath = "uploads/banner";
const timingBannerImagePath = "uploads/timingBanner";
const restaurantDocsImagePath = "uploads/restaurant/documents";
const restaurantProfileImagePath = "uploads/restaurant/profilePhotos";

module.exports = {
    baseUrl,
    categoryImagePath,
    bannerImagePath,
    restaurantDocsImagePath,
    restaurantProfileImagePath,
    timingBannerImagePath
};