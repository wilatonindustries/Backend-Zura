module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Categories = sequelize.define(
        "categories", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'name'
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'image'
            }
        },
        {
            // Options
            underscrored: true,
        }
    );

    return Categories;
};
