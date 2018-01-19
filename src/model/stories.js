export default (sequelize, DataTypes) => {
  const Stories = sequelize.define('Stories', {
    id: {
      // Avoid usage of auto-increment numbers, UUID is a better choice
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      comment: 'User ID',
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      comment: 'Title of story',
      allowNull: false,
      // setter to standardize
      set(val) {
        this.setDataValue(
          'title',
          val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
        );
      },
    },
    shortText: {
      type: DataTypes.STRING,
      comment: 'shortText of story',
    },
    fullText: {
      type: DataTypes.STRING,
      comment: 'fullText of story',
      allowNull: false,
    },
    metaDatas: {
      type: DataTypes.JSON,
      comment: 'metaDatas of story',
    },
  });
  /* eslint func-names:off */
  Stories.associate = function(models) {
    models.Stories.belongsTo(models.Users);
  };

  return Stories;
};
