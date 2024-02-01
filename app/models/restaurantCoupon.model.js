module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const restaurantCoupons = sequelize.define(
        "restaurant_coupons", // Model name
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
            coupon_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'coupon_id',
                references: { model: 'coupons', key: 'id' }
            },
            coupon_code: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'coupon_code'
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return restaurantCoupons;
};
