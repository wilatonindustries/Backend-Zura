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
            changes_discount_json: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'changes_discount_json',
            },
            is_changes_accept: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'is_changes_accept',
                defaultValue: false
            },
            is_delete: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'is_delete',
                defaultValue: false
            },
        }
    );

    return RestaurantDiscounts;
};
