module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Admin = sequelize.define(
        "admin", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'email'
            },
            mobile: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'mobile'
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'password'
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'is_active',
                defaultValue: true
            },
        },
        {
            underscrored: true,
        }
    );

    return Admin;
};
