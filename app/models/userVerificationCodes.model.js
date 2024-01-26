module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const UserVerificationCodes = sequelize.define(
        "user_verification_codes", // Model name
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

    return UserVerificationCodes;
};
