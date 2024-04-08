import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../config/dbConnect';
import User from './user';

interface FileActivityAttributes {
  userId: number;
  uploadTime: Date;
  downloadTime: Date | null;
  filename: string;
  IPAddress: string;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class FileActivity extends Model<FileActivityAttributes> implements FileActivityAttributes {
    public userId!: number;
    public uploadTime!: Date;
    public downloadTime!: Date | null;
    public filename!: string;
    public IPAddress!: string;

    static associate(models: any) {
        // Define associations here if needed
        FileActivity.hasMany(models.User, {
            foreignKey: 'userId',
            // as: 'fileActivities', // Alias for the association
          });
    }
  }

  FileActivity.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploadTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    downloadTime: {
      type: DataTypes.DATE,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IPAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize: connection,
    modelName: 'FileActivity',
  });

  return FileActivity; // Ensure that FileActivity is returned as a constructor function
};
