module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
  const Customer = sequelize.define(
    "customers", // Model name
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
      is_mobile_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'is_mobile_verified'
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'is_email_verified'
      },
      is_profile_updated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'is_profile_updated'
      },
      is_social: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'is_social'
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'is_active',
        defaultValue: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'name'
      },
      fcm_token: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fcm_token'
      },
      is_notified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'is_notified'
      },
    },
    {
      // Options

      underscrored: true,
    }
  );

  return Customer;
};
