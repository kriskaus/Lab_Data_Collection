import { Sequelize, DataTypes, Model } from 'sequelize';
import connection from '../config/dbConnect';
import User from './user'; // Import the User model from your user.ts file
interface UserActivityAttributes {
    userId: number;
    loginTime: Date;
    logoutTime: Date | null;
    IPAddress: string;
}
// UserActivity model for storing login/logout activities
export default (sequelize: Sequelize, DataTypes: any) => {
    class UserActivity extends Model<UserActivityAttributes> implements UserActivityAttributes {
        public userId!: number;
        public loginTime!: Date;
        public logoutTime!: Date | null;
        public IPAddress!: string;
    
        static associate(models: any) {
            // Define associations here if needed
            UserActivity.hasMany(models.User, {
                foreignKey: 'userId',
                // as: 'userActivities', // Alias for the association
              });}
    }

  UserActivity.init({
    userId: {
        type: DataTypes.INTEGER,
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
  }, {
    sequelize : connection,
    tableName: 'UserActivity',
  });
// Define associations

return UserActivity;
// Sync the models with the database
// UserActivity.sync();

// Export the models
}
