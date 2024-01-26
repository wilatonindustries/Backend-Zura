module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  /** DATABASE */
  db: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    dialect: "mysql",

    // pool is optional, it will be used for Sequelize connection pool configuration
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  /** AUTH KEY */
  auth: {
    secret_key: process.env.SECRET_KEY
  },

  razorpay: {
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_KEY_SECRET,
    secret: process.env.RZP_SECRET,
    currency: 'INR',
  },

  AES: {
    secretKey: process.env.ENCRYPT_SECRET_KEY || '',
    secret_iv: process.env.SECRET_IV,
    encryption_method: process.env.ENCRYPTION_METHOD
  }
};
