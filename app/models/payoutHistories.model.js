module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const PayoutHistories = sequelize.define(
        "payout_histories", // Model name
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
            amount: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                field: 'amount',
                defaultValue: 0.00
            },
        }
    );

    return PayoutHistories;
};
