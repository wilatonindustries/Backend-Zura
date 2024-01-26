const authVerify = require( "./restaurant/authVerify" );
const customerVerify = require( "./customer/authVerify" );
const adminVerify = require( "./admin/authVerify" );

module.exports = {
  authVerify,
  customerVerify,
  adminVerify
};
