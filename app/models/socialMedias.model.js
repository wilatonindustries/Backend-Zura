module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const SocialMedias = sequelize.define(
        "social_medias", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'title',
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'description',
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'status',
                defaultValue: false,
            },
            link: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'link',
            },
        }
    );

    return SocialMedias;
};
