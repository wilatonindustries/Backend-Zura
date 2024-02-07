module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Orders = sequelize.define(
        "orders", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'user_id',
                references: { model: 'users', key: 'id' }
            },
            restaurant_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'restaurant_id',
                references: { model: 'restaurants', key: 'id' }
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'customer_id',
                references: { model: 'customers', key: 'id' }
            },
            order_date: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'order_date'
            },
            transaction_id: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'transaction_id'
            },
            bill_amount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'bill_amount'
            },
            gst: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'gst'
            },
            discount_to_customer: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount_to_customer',
                defaultValue: 0
            },
            discount_given_by_customer: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount_given_by_customer'
            },
            order_timing: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'order_timing'
            },
            our_profit: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'our_profit'
            },
            magic_coupon_amount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'magic_coupon_amount',
                defaultValue: 0.00
            },
            discount_from_restaurant: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount_from_restaurant',
                defaultValue: 0.00
            },
            discount_commision: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount_commision',
                defaultValue: 0.00
            },
            magic_coupon_discount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'magic_coupon_discount',
                defaultValue: 0.00
            },
            is_paid: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'is_paid',
                defaultValue: false,
            },
            discount_given: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount_given',
                defaultValue: 0.00
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return Orders;
};
