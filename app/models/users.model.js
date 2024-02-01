module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
  const User = sequelize.define(
    "users", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      owner_name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'owner_name'
      },
      owner_mobile: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'owner_mobile'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'email'
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
      is_accept: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'is_accept',
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'is_active',
        defaultValue: true
      },
    },
    {
      // Options
      underscrored: true,
    }
  );

  return User;
};
