module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
  const CustomerDetails = sequelize.define(
    "customer_details", // Model name
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
      area_name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'area_name'
      },
    },
    {
      // Options
      underscrored: true,
    }
  );

  return CustomerDetails;
};
