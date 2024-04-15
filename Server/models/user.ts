'use strict';

import { Model } from 'sequelize';
import connection from '../config/dbConnect'
import { UserAttributes } from '../interface/UserAttributes';
 

export default (sequelize:any, DataTypes:any) => {
  class User extends Model<UserAttributes> 
    implements UserAttributes{
    declare username: string; // Note that the `null assertion` `!` is required
    declare password: string;
    declare email: string;
    declare id: number;
    declare role: string

    // static async createUser(username: string, email: string, password: string): Promise<User> {
    //   // Use the Sequelize create method to insert a new record into the database
    //   const newUser = await User.create({ username, email, password });
    //   return newUser;
    // }


    static associate(models :any) {
      // define association here
      User.belongsToMany(models.Project,{
        through: 'ProjectAssignments'
      })

      User.hasMany(models.UserActivity, {
        foreignKey: 'userId',
        as: 'user',
      })

      User.hasMany(models.FileActivity, {
        foreignKey: 'userId',
        as: 'user',
      })
    }
  }
  User.init({
    id:{
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    role:{
      type:DataTypes.STRING,
      allowNull:false,
    }
  }, {
    sequelize : connection,
    modelName: 'User',
  });
  return User;
}

// 'use strict';

// import { Model, DataTypes, Sequelize } from 'sequelize';
// import connection from '../config/dbConnect'

// interface UserAttributes {
//   username: string;
//   password: string;
//   email: string;
// }

// interface UserModel extends Model<UserAttributes>, UserAttributes {
//   // Add class methods here if needed
// }

// export default (sequelize: Sequelize, DataType: any) => {
//   class User extends Model<UserModel, UserAttributes> implements UserAttributes {
//     public username!: string;
//     public password!: string;
//     public email!: string;

//     static async createUser(username: string, email: string, password: string): Promise<UserModel> {
//       const newUser = await User.create({ username, email, password });
//       return newUser;
//     }

//     static associate(models: any) {
//       // Define associations here if needed
//       User.belongsToMany(models.Project, {
//         through: 'ProjectAssignments'
//       });
//     }
//   }

//   User.init({
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     }
//   }, {
//     sequelize: connection,
//     modelName: 'User',
//   });

//   return User;
// };
