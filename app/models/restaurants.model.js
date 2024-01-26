module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Restaurants = sequelize.define(
        "restaurants", // Model name
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
            number: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'number'
            },
            store_name: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'store_name'
            },
            store_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'store_number'
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'address'
            },
            google_link: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'google_link'
            },
            short_address: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'short_address'
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'category_id',
                references: { model: 'categories', key: 'id' }
            },
            gst_rate: {
                type: DataTypes.FLOAT,
                allowNull: true,
                field: 'gst_rate'
            }
        }
    );

    return Restaurants;
};
