module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Coupons = sequelize.define(
        "coupons", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'category_id',
                references: { model: 'categories', key: 'id' }
            },
            restaurant_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'restaurant_id',
                references: { model: 'restaurants', key: 'id' }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'description'
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'status'
            },
            coupon_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'coupon_quantity'
            },
            unique_coupon_codes: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'unique_coupon_codes'
            },
            discount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'discount',
                defaultValue: 0.00
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return Coupons;
};
