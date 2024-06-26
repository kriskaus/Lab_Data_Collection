import { Sequelize, DataTypes, Model } from 'sequelize';
import connection from '../config/dbConnect';
import User from './user'; // Import the User model from your user.ts file
interface UserActivityAttributes {
    userId: number;
    loginTime: Date;
    logoutTime: Date | null;
    IPAddress: string;
    role: string;
}
// UserActivity model for storing login/logout activities
export default (sequelize: Sequelize, DataTypes: any) => {

    class UserActivity extends Model<UserActivityAttributes> implements UserActivityAttributes {
        declare userId: number;
        declare loginTime: Date;
        declare logoutTime: Date | null;
        declare IPAddress: string;
        declare role: string;
    
        static associate(models: any) {
            // Define associations here if needed
            UserActivity.hasMany(models.User, {
                foreignKey: 'userId',
                as: 'UserActivity', // Alias for the association
              });}
    }

  UserActivity.init({
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    loginTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    logoutTime: {
        type: DataTypes.DATE,
    },
    IPAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }, {
    sequelize : connection,
    modelName: 'UserActivity',
    timestamps: false,
  });
// Define associations

return UserActivity;
// Sync the models with the database
// UserActivity.sync();

// Export the models
}
