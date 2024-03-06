module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const RestaurantProfilePhotos = sequelize.define(
        "restaurant_profile_photos", // Model name
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
            ambience_photo_1: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ambience_photo_1'
            },
            ambience_photo_2: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ambience_photo_2'
            },
            ambience_photo_3: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ambience_photo_3'
            },
            ambience_photo_4: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ambience_photo_4'
            },
            offering_photo_1: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'offering_photo_1'
            },
            offering_photo_2: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'offering_photo_2'
            },
            offering_photo_3: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'offering_photo_3'
            },
            offering_photo_4: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'offering_photo_4'
            },
            set_profile_background_photo: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'set_profile_background_photo'
            },
            set_store_thumbnail_photo: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'set_store_thumbnail_photo'
            },
            set_store_profile_photo: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'set_store_profile_photo'
            },
            is_delete: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'is_delete',
                defaultValue: false
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return RestaurantProfilePhotos;
};
