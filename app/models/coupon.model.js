module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const Coupons = sequelize.define(
        "coupons", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'description'
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'status'
            },
            coupon_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'coupon_quantity'
            },
            unique_coupon_codes: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'unique_coupon_codes'
            },
        },
        {
            // Options
            underscrored: true,
        }
    );

    return Coupons;
};
