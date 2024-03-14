--table: admins
CREATE TABLE IF NOT EXISTS admins (
  id serial PRIMARY KEY,
  email VARCHAR(100),
  mobile VARCHAR(15),
  password VARCHAR,
  is_active BOOLEAN,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: admin_verification_codes
CREATE TABLE IF NOT EXISTS admin_verification_codes (
  id serial PRIMARY KEY,
  admin_id INTEGER,
  nametext VARCHAR(100),
  type VARCHAR(10),
  code VARCHAR(4),
  otp_type VARCHAR(50),
  expired_date TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: users
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  email VARCHAR(100),
  mobile VARCHAR(15),
  is_mobile_verified BOOLEAN,
  is_email_verified BOOLEAN,
  password VARCHAR(4),
  is_pin_added boolean DEFAULT false,
  is_profile_updated boolean DEFAULT false,
  is_signup_done BOOLEAN,
  is_social BOOLEAN DEFAULT false,
  is_accept BOOLEAN DEFAULT false,
  social_type VARCHAR(50),
  device_token TEXT,
  device_name VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: user_verification_codes
CREATE TABLE IF NOT EXISTS user_verification_codes (
  id serial PRIMARY KEY,
  user_id INTEGER,
  nametext VARCHAR(100),
  type VARCHAR(10),
  code VARCHAR(4),
  otp_type VARCHAR(50),
  expired_date TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: customers
CREATE TABLE IF NOT EXISTS customers (
  id serial PRIMARY KEY,
  email VARCHAR(100),
  mobile VARCHAR(15),
  is_mobile_verified BOOLEAN,
  is_email_verified BOOLEAN,
  password VARCHAR(4),
  is_pin_added boolean DEFAULT false,
  is_profile_updated boolean DEFAULT false,
  is_signup_done BOOLEAN,
  is_social BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  social_type VARCHAR(50),
  device_token TEXT,
  device_name VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: customer_verification_codes
CREATE TABLE IF NOT EXISTS customer_verification_codes (
  id serial PRIMARY KEY,
  customer_id INTEGER,
  nametext VARCHAR(100),
  type VARCHAR(10),
  code VARCHAR(4),
  otp_type VARCHAR(50),
  expired_date TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: customer_details
CREATE TABLE IF NOT EXISTS customer_details (
  id serial PRIMARY KEY,
  customer_id INTEGER,
  area_name VARCHAR(255),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: categories
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name VARCHAR(255),
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: banners
CREATE TABLE IF NOT EXISTS banners (
  id serial PRIMARY KEY,
  name VARCHAR(255),
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id serial PRIMARY KEY,
  user_id INTEGER,
  number NUMERIC,
  store_name VARCHAR(255),
  store_number NUMERIC,
  address VARCHAR(255),
  google_link VARCHAR(255),
  short_address VARCHAR(255),
  category_id INTEGER,
  gst_rate NUMERIC,
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (category_id) REFERENCES categories(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: restaurant_bank_account_details
CREATE TABLE IF NOT EXISTS restaurant_bank_account_details (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  name VARCHAR(255),
  account_number VARCHAR(255),
  ifsc_code VARCHAR(10),
  bank_branch VARCHAR(255),
  bank_name VARCHAR(255),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: restaurant_documents
CREATE TABLE IF NOT EXISTS restaurant_documents (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  license_copy VARCHAR(255),
  pan_card_copy VARCHAR(255),
  shop_act VARCHAR(255),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: restaurant_profile_photos
CREATE TABLE IF NOT EXISTS restaurant_profile_photos (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  ambience_photo VARCHAR(255),
  offering_photo VARCHAR(255),
  set_profile_background_photo VARCHAR(255),
  set_store_thumbnail_photo VARCHAR(255),
  set_store_profile_photo VARCHAR(255),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: restaurant_discounts
CREATE TABLE IF NOT EXISTS restaurant_discounts (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  discount_json TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: orders
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  transaction_id VARCHAR(50),
  bill_amount DECIMAL(10, 2),
  discount_from_restaurant DECIMAL(10, 2),
  discount_to_customer DECIMAL(10, 2),
  discount_commision DECIMAL(10, 2),
  magic_coupon_discount DECIMAL(10, 2),
  convinence_fee DECIMAL(10, 2),
  gst DECIMAL(10, 2),
  dis_to_customer DECIMAL(10,2),
  amt_pay_by_customer DECIMAL(10, 2),
  dis_receive_by_res DECIMAL(10, 2),
  commission_by_admin DECIMAL(10, 2),
  magic_coupon_amount DECIMAL(10, 2),
  gst_rate DECIMAL(10, 2),
  gst_amt DECIMAL(10, 2),
  given_to_res DECIMAL(10, 2),
  discount_given DECIMAL(10, 2), 
  is_paid DECIMAL(10, 2),
  order_timing DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: coupons
CREATE TABLE IF NOT EXISTS coupons (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  category_id INTEGER,
  description VARCHAR(255),
  status VARCHAR(50),
  coupon_quantity NUMERIC,
  unique_coupon_codes VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: payment_orders
CREATE TABLE IF NOT EXISTS payment_orders (
  id serial PRIMARY KEY,
  customer_id INTEGER,
  restaurant_id INTEGER,
  bill_amount DECIMAL(10, 2),
  discount DECIMAL(10, 2),
  magic_coupon_discount DECIMAL(10, 2),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: configurations
CREATE TABLE IF NOT EXISTS configurations (
  id serial PRIMARY KEY,
  type VARCHAR(255),
  value DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: restaurants_payouts
CREATE TABLE IF NOT EXISTS restaurants_payouts (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  amount DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: payout_histories
CREATE TABLE IF NOT EXISTS payout_histories (
  id serial PRIMARY KEY,
  user_id INTEGER,
  restaurant_id INTEGER,
  amount DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: timing_banners
CREATE TABLE IF NOT EXISTS timing_banners (
  id serial PRIMARY KEY,
  timing VARCHAR,
  image VARCHAR,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: static_components
CREATE TABLE IF NOT EXISTS static_components (
  id serial PRIMARY KEY,
  about_us TEXT,
  terms_of_service TEXT,
  privacy_policy TEXT,
  faq TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--table: social_medias
CREATE TABLE IF NOT EXISTS social_medias (
  id serial PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status BOOLEAN DEFAULT false,
  link TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);