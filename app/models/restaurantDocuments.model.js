module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const RestaurantDocuments = sequelize.define(
        "restaurant_documents", // Model name
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
            license_copy: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'license_copy'
            },
            pan_card_copy: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'pan_card_copy'
            },
            shop_act: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'shop_act'
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return RestaurantDocuments;
};
