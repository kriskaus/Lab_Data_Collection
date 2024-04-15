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
    declare userId: number;
    declare uploadTime: Date;
    declare downloadTime: Date | null;
    declare filename: string;
    declare IPAddress: string;

    static associate(models: any) {
        // Define associations here if needed
        FileActivity.hasMany(models.User, {
            foreignKey: 'userId',
            as: 'FileActivity', // Alias for the association
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
