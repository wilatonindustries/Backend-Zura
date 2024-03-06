module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const RestaurantBankAccountDetails = sequelize.define(
        "restaurant_bank_account_details", // Model name
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
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'name'
            },
            account_number: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'account_number'
            },
            ifsc_code: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ifsc_code'
            },
            bank_branch: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'bank_branch'
            },
            bank_name: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'bank_name'
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

    return RestaurantBankAccountDetails;
};
