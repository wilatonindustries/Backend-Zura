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

db.user = require( "./users.model.js" )( sequelize, Sequelize, DataTypes );
db.user_verification_codes = require( "./userVerificationCodes.model.js" )( sequelize, Sequelize, DataTypes );

db.customer = require( "./customers.model.js" )( sequelize, Sequelize, DataTypes );
db.customer_details = require( "./customerDetails.model.js" )( sequelize, Sequelize, DataTypes );
db.customer_verification_codes = require( "./customerVerificationCodes.model.js" )( sequelize, Sequelize, DataTypes );


db.restaurants = require( "./restaurants.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_bank_account_details = require( "./restaurantBankAccDetails.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_documents = require( "./restaurantDocuments.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_profile_photos = require( "./restaurantProfilePhotos.model.js" )( sequelize, Sequelize, DataTypes );
db.restaurant_discounts = require( "./restaurantDiscounts.model.js" )( sequelize, Sequelize, DataTypes );
db.orders = require( "./orders.model.js" )( sequelize, Sequelize, DataTypes );


// associations

db.user.hasOne( db.restaurants, { foreignKey: 'user_id', as: 'restaurant' } )
db.restaurants.belongsTo( db.user, { foreignKey: 'user_id', as: 'user' } )

db.restaurants.hasOne( db.restaurant_bank_account_details, { foreignKey: 'restaurant_id', as: 'bank_details' } );
db.restaurants.hasOne( db.restaurant_documents, { foreignKey: 'restaurant_id', as: 'documents' } );
db.restaurants.hasOne( db.restaurant_profile_photos, { foreignKey: 'restaurant_id', as: 'profile_photos' } );

db.restaurants.hasOne( db.restaurant_discounts, { foreignKey: 'restaurant_id', as: 'discounts' } );
db.restaurant_discounts.belongsTo( db.restaurants, { foreignKey: 'restaurant_id', as: 'restaurant' } );

db.restaurants.hasMany( db.orders, { foreignKey: 'restaurant_id', as: 'orders' } );
db.orders.belongsTo( db.restaurants, { foreignKey: "restaurant_id", as: 'restaurant' } )

db.customer.hasMany( db.customer_details, { foreignKey: 'customer_id' } );
db.customer_details.belongsTo( db.customer, { foreignKey: "customer_id" } )

db.customer.hasMany( db.orders, { foreignKey: 'customer_id', as: 'orders' } );
db.orders.belongsTo( db.customer, { foreignKey: "customer_id", as: "customer" } )

module.exports = db;
