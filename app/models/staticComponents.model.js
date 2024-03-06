module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const StaticComponents = sequelize.define(
        "static_components", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            about_us: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'about_us',
            },
            terms_of_service: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'terms_of_service',
            },
            privacy_policy: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'privacy_policy',
            },
            faq: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'faq',
            },
        }
    );

    return StaticComponents;
};
