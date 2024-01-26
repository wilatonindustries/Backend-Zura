module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const CustomerVerificationCode = sequelize.define(
        "customer_verification_codes", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'customer_id',
                references: { model: 'customers', key: 'id' }
            },
            nametext: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'nametext'
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'type'
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'code'
            },
            otp_type: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'otp_type'
            },
            expired_date: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'expired_date'
            },
        }
    );

    return CustomerVerificationCode;
};
