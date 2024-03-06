module.exports = ( sequelize, Sequelize, DataTypes ) =>
{
    const TimingBanners = sequelize.define(
        "timing_banners", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'id'
            },
            timing: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'timing'
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'image'
            }
        },
        {
            // Options
            underscrored: true,
        }
    );

    return TimingBanners;
};
