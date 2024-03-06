module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Configurations = sequelize.define(
        "configurations", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'type'
            },
            value: {
                type: DataTypes.FLOAT,
                allowNull: true,
                field: 'value'
            }
        },
        {
            // Options
            underscrored: true,
        }
    );

    return Configurations;
};
