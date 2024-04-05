'use strict';

import { Model } from 'sequelize';
import connection from '../config/dbConnect'
 interface UserAttributes{
  username: string;
  password: string;
  email:string;
 }

export default (sequelize:any, DataTypes:any) => {
  class User extends Model<UserAttributes> 
    implements UserAttributes{
    public username!: string; // Note that the `null assertion` `!` is required
    public password!: string;
    public email!: string;

    static async createUser(username: string, email: string, password: string): Promise<User> {
      // Use the Sequelize create method to insert a new record into the database
      const newUser = await User.create({ username, email, password });
      return newUser;
    }


    static associate(models :any) {
      // define association here
      User.belongsToMany(models.Project,{
        through: 'ProjectAssignments'
      })
    }
  }
  User.init({
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
