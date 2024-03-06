const config = require( "../config/config.js" );
const { Sequelize, DataTypes, Op } = require( "sequelize" );

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.admin = require( "./admin.model.js" )( sequelize, Sequelize, DataTypes );
db.admin_verification_codes = require( "./adminVerificationCode.model.js" )( sequelize, Sequelize, DataTypes );
db.categories = require( "./categories.model.js" )( sequelize, Sequelize, DataTypes );
db.banners = require( "./banners.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurants = require( "./restaurants.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_bank_account_details = require( "./restaurantBankAccDetails.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_documents = require( "./restaurantDocuments.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_profile_photos = require( "./restaurantProfilePhotos.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_discounts = require( "./restaurantDiscounts.model.js" )( sequelize, Sequelize, DataTypes );
db.coupons = require( "./coupon.model.js" )( sequelize, Sequelize, DataTypes );
db.timing_banners = require( "./timingbanners.model.js" )( sequelize, Sequelize, DataTypes );
db.static_components = require( "./staticComponents.model.js" )( sequelize, Sequelize, DataTypes );
db.social_medias = require( "./socialMedias.model.js" )( sequelize, Sequelize, DataTypes );

db.user = require( "./users.model.js" )( sequelize, Sequelize, DataTypes );
db.user_verification_codes = require( "./userVerificationCodes.model.js" )( sequelize, Sequelize, DataTypes );

db.customer = require( "./customers.model.js" )( sequelize, Sequelize, DataTypes );
db.customer_details = require( "./customerDetails.model.js" )( sequelize, Sequelize, DataTypes );
db.customer_verification_codes = require( "./customerVerificationCodes.model.js" )( sequelize, Sequelize, DataTypes );
db.orders = require( "./orders.model.js" )( sequelize, Sequelize, DataTypes );

db.configurations = require( "./configurations.model.js" )( sequelize, Sequelize, DataTypes );

db.payment_orders = require( "./paymentOrders.model.js" )( sequelize, Sequelize, DataTypes );

db.restaurants_payouts = require( "./restaurantPayouts.model.js" )( sequelize, Sequelize, DataTypes );

db.payout_histories = require( "./payoutHistories.model.js" )( sequelize, Sequelize, DataTypes );

// associations

db.user.hasOne( db.restaurants, { foreignKey: 'user_id', as: 'restaurant' } );
db.restaurants.belongsTo( db.user, { foreignKey: 'user_id', as: 'user' } );

db.restaurants.hasOne( db.restaurant_bank_account_details, { foreignKey: 'restaurant_id', as: 'bank_details' } );
db.restaurants.hasOne( db.restaurant_documents, { foreignKey: 'restaurant_id', as: 'documents' } );
db.restaurants.hasOne( db.restaurant_profile_photos, { foreignKey: 'restaurant_id', as: 'profile_photos' } );

db.restaurants.hasOne( db.restaurant_discounts, { foreignKey: 'restaurant_id', as: 'discounts' } );
db.restaurant_discounts.belongsTo( db.restaurants, { foreignKey: 'restaurant_id', as: 'restaurant' } );

db.restaurants.hasMany( db.orders, { foreignKey: 'restaurant_id', as: 'orders' } );
db.orders.belongsTo( db.restaurants, { foreignKey: "restaurant_id", as: 'restaurant' } );

db.customer.hasMany( db.customer_details, { foreignKey: 'customer_id', as: 'customer_details' } );
db.customer_details.belongsTo( db.customer, { foreignKey: "customer_id", as: 'customer' } );

db.customer.hasMany( db.orders, { foreignKey: 'customer_id', as: 'orders' } );
db.orders.belongsTo( db.customer, { foreignKey: "customer_id", as: "customer" } );

db.restaurants.hasMany( db.payment_orders, { foreignKey: 'restaurant_id', as: 'payment_orders' } );
db.payment_orders.belongsTo( db.restaurants, { foreignKey: "restaurant_id", as: 'restaurant' } );

db.customer.hasMany( db.payment_orders, { foreignKey: 'customer_id', as: 'payment_orders' } );
db.payment_orders.belongsTo( db.customer, { foreignKey: "customer_id", as: 'customer' } );

db.restaurants.hasOne( db.restaurants_payouts, { foreignKey: 'restaurant_id', as: 'restaurants_payouts' } );
db.restaurants_payouts.belongsTo( db.restaurants, { foreignKey: "restaurant_id", as: 'restaurant' } );

db.user.hasOne( db.restaurants_payouts, { foreignKey: 'user_id', as: 'restaurants_payouts' } );
db.restaurants_payouts.belongsTo( db.user, { foreignKey: 'user_id', as: 'user' } );

db.restaurants.hasOne( db.payout_histories, { foreignKey: 'restaurant_id', as: 'payout_histories' } );
db.payout_histories.belongsTo( db.restaurants, { foreignKey: "restaurant_id", as: 'restaurant' } );

db.user.hasOne( db.payout_histories, { foreignKey: 'user_id', as: 'payout_histories' } );
db.payout_histories.belongsTo( db.user, { foreignKey: 'user_id', as: 'user' } );


module.exports = db;
