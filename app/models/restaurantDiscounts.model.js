module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const RestaurantDiscounts = sequelize.define(
        "restaurant_discounts", // Model name
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
            discount_json: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'discount_json',
            },
        }
    );

    return RestaurantDiscounts;
};
