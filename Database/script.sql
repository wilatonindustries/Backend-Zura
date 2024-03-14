ALTER TABLE customers
ADD COLUMN is_active BOOLEAN default false;

ALTER TABLE users
ADD COLUMN is_active BOOLEAN default false;

ALTER TABLE admin
ADD COLUMN is_active BOOLEAN default false;

ALTER TABLE customer_details
DROP COLUMN mobile;

ALTER TABLE customer_details
DROP COLUMN email;

ALTER TABLE customer_details
DROP COLUMN name;

ALTER TABLE customers
ADD COLUMN name VARCHAR(250) default 'customer';

ALTER TABLE users
DROP COLUMN name;

-- 25/01/2024
DROP TABLE user_detail;

DROP TABLE users;

-- 27/01/2024
ALTER TABLE users
ADD COLUMN is_active BOOLEAN default false;

ALTER TABLE users
DROP COLUMN is_active;

ALTER TABLE users
ADD COLUMN is_active BOOLEAN default true;

ALTER TABLE restaurant_discounts
ADD COLUMN is_changes_accept BOOLEAN default false;

-- 29/01/2024
ALTER TABLE restaurants
ALTER COLUMN number VARCHAR(10);

ALTER TABLE restaurants
ALTER COLUMN store_number VARCHAR(10);

-- 30/01/2024
ALTER TABLE coupons
DROP FOREIGN KEY user_id;

ALTER TABLE coupons
DROP FOREIGN KEY restaurant_id;

ALTER TABLE coupons
DROP FOREIGN KEY category_id;

-- 31/01/2024
ALTER TABLE orders
ADD COLUMN magic_coupon_amount DECIMAL(10,2) DEFAULT NULL;

ALTER TABLE restaurant_discounts
ADD COLUMN changes_discount_json TEXT DEFAULT NULL;

-- 01/02/2024
ALTER TABLE coupons
ADD COLUMN discount DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE orders
ADD COLUMN discount_from_restaurant DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE orders
ADD COLUMN discount_commision DECIMAL(10,2) DEFAULT 0.00;

-- 02/02/2024
ALTER TABLE orders
ADD COLUMN magic_coupon_discount DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE orders
ADD COLUMN is_paid BOOLEAN DEFAULT false;

-- 03/02/2024
ALTER TABLE orders
ADD COLUMN discount_given DECIMAL(10,2) DEFAULT 0.00;

-- 06/02/2024
ALTER TABLE payment_orders
ADD COLUMN order_id VARCHAR(255);

ALTER TABLE payment_orders
ADD COLUMN order_timing VARCHAR(255);

-- 12/02/2024
DROP TABLE restaurant_coupons;

ALTER TABLE payment_orders
DROP COLUMN magic_coupon_discount;

ALTER TABLE payment_orders
ADD COLUMN coupon_id INT,
ADD CONSTRAINT fk_coupon_id
FOREIGN KEY (coupon_id)
REFERENCES coupons(id);

-- 20/02/2024
ALTER TABLE restaurants
ADD COLUMN is_delete BOOLEAN DEFAULT false;

ALTER TABLE restaurant_bank_account_details
ADD COLUMN is_delete BOOLEAN DEFAULT false;

ALTER TABLE restaurant_profile_photos
ADD COLUMN is_delete BOOLEAN DEFAULT false;

ALTER TABLE restaurant_documents
ADD COLUMN is_delete BOOLEAN DEFAULT false;

ALTER TABLE restaurant_discounts
ADD COLUMN is_delete BOOLEAN DEFAULT false;

-- 22/02/2024
ALTER TABLE coupons
ADD COLUMN restaurant_id INT,
ADD CONSTRAINT fk_restaurant_id
FOREIGN KEY (restaurant_id)
REFERENCES restaurants(id);

ALTER TABLE coupons
ADD COLUMN category_id INT,
ADD CONSTRAINT fk_category_id
FOREIGN KEY (category_id)
REFERENCES categories(id);

-- 27/02/2024
ALTER TABLE customers
ADD COLUMN fcm_token TEXT DEFAULT NULL;

ALTER TABLE restaurants
ADD COLUMN longitude DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE restaurants
ADD COLUMN latitude DECIMAL(10,2) DEFAULT 0.00;

-- 28/02/2024
ALTER TABLE customers
ADD COLUMN is_notified BOOLEAN DEFAULT false;
