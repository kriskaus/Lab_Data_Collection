"use strict";
// import express from "express";
// import bcrypt from 'bcryptjs';
// import db from "../models";
// let router = express.Router();
// // router.get("/", (req, res) => {
// //     res.send("Hello World!");
// // });
// // Register user route
// router.post('/register', async (req, res) => {
//     try {
//       const { username, password, email } = req.body;
//       if (!username || !email || !password) {
//         return res.status(400).json({ error: 'Missing required fields' });
//       }
//       const hashedPassword = bcrypt.hashSync(password, 10);
//       const newUser = await db.User.create({ username, password: hashedPassword, email }); // Use `create` instead of `createUser`
//       res.status(201).json({ message: 'User registered successfully', user: newUser });
//     } catch (error) {
//       console.error('Error registering user:', error);
//       res.status(500).json({ error: 'An error occurred while registering user' });
//     }
//   });
// export default router;
