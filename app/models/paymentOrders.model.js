module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const PaymentOrders = sequelize.define(
        "payment_orders", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'customer_id',
                references: { model: 'customers', key: 'id' }
            },
            restaurant_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'restaurant_id',
                references: { model: 'restaurants', key: 'id' }
            },
            bill_amount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'bill_amount',
                defaultValue: 0.00
            },
            discount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount',
                defaultValue: 0.00
            },
            coupon_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'coupon_id',
                references: { model: 'coupons', key: 'id' }
            },
            order_id: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'order_id'
            },
            order_timing: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'order_timing'
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return PaymentOrders;
};
