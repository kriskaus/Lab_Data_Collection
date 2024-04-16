"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = __importDefault(require("../models"));
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const passportConfig_1 = __importDefault(require("./passportConfig"));
const SequelizeStore = require("connect-session-sequelize")(express_session_1.default.Store);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: 'Lab_Server',
    store: new SequelizeStore({
        db: dbConnect_1.default
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds (e.g., 1 day)
    }
}));
// Initialize Passport.js middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.authenticate('session'));
(0, passportConfig_1.default)(passport_1.default);
let id = "";
let ipAddress;
// Configure Passport.js
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
//Middleware to see how the params are populated by Passport
let count = 1;
const printData = (req, res, next) => {
    console.log("\n==============================");
    console.log(`------------>  ${count++}`);
    console.log(`req.body.username -------> ${req.body.username}`);
    console.log(`req.body.password -------> ${req.body.password}`);
    console.log(req.user);
    console.log(`\n req.session.passport -------> `);
    console.log(req.session);
    console.log(`\n req.user -------> `);
    console.log(req.user);
    console.log("\n Session and Cookie");
    console.log(`req.session.id -------> ${req.session.id}`);
    console.log(`req.session.cookie -------> `);
    console.log(req.session.cookie);
    console.log("===========================================\n");
    next();
};
app.use(printData);
// / Serve static files from the React frontend app
// app.use('/downloads', express.static(path.join(new URL('.', import.meta.url).pathname, 'downloads')));
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.session);
        return next();
    }
    res.status(401).send('Unauthorized');
}
// API endpoint for uploading files
app.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract relevant information from the request
        const userId = id;
        console.log("user iddddddddddddddd", id);
        const filename = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const uploadTime = new Date();
        const IPAddress = req.ip; // Get the client's IP address from the request
        console.log(userId, filename, uploadTime, IPAddress);
        // Create a new FileActivity record in the database
        const newFileActivity = yield models_1.default.FileActivity.create({
            userId,
            uploadTime,
            filename,
            IPAddress,
        });
        // Log a message to indicate that the file was uploaded successfully
        console.log('File uploaded successfully');
        // Send a response to the client
        res.status(200).json({ message: 'File uploaded successfully', fileActivity: newFileActivity });
    }
    catch (error) {
        // If an error occurs, log the error and send a 500 internal server error response
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading file' });
    }
}));
// API endpoint for downloading files
app.get('/download/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(__dirname, __filename);
    const filename = req.params.filename; // Extract the filename from the request parameters
    const filePath = path_1.default.join(__dirname, '../uploads', filename); // Construct the file path
    console.log(filePath, filename);
    // Check if the file exists
    if (fs_1.default.existsSync(filePath)) {
        try {
            // Find the user activity entry for the logged-in user and the current session
            const fileActivity = yield models_1.default.FileActivity.findOne({
                where: {
                    userId: id,
                    filename: filename,
                    downloadTime: null // Assuming logoutTime is a field that indicates whether the user has already logged out
                }
            });
            console.log(fileActivity);
            if (fileActivity) {
                // Update the user activity entry with the logout time
                fileActivity.downloadTime = new Date();
                yield fileActivity.save();
            }
        }
        catch (error) {
            console.error('Error uploading file:', error);
            return res.status(500).json({ error: 'An error occurred while downloading file' });
        }
        // If the file exists, send it as a download using res.download()
        res.download(filePath, filename, (err) => {
            console.log("File download Successfully");
            if (err) {
                // If an error occurs during download, send an error response
                return res.status(500).send('Error downloading file');
            }
        });
    }
    else {
        // If the file does not exist, send a 404 Not Found response
        return res.status(404).send('File not found');
    }
}));
// Register user route
// Register user route
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const existingUser = yield models_1.default.User.findOne({ where: { username } });
        if (existingUser) {
            // If user already exists, send response indicating user already exists
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const newUser = yield models_1.default.User.create({ username, password: hashedPassword, email, role }); // Use `create` instead of `createUser`
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
}));
// Login route
app.post('/login', passport_1.default.authenticate('local'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // req.session.save()
    ipAddress = req.body.IPAddress;
    const newUserActivity = yield models_1.default.UserActivity.create({
        userId: id,
        loginTime: new Date(),
        IPAddress: ipAddress,
    });
    req.session.regenerate(function (err) {
        if (err) {
            next(err);
            return;
        } // Ensure the function returns after calling next(err)
        req.session.save(function (err) {
            if (err) {
                next(err);
                return;
            } // Ensure the function returns after calling next(err)
            //   res.redirect('/'); //
            return res.status(200).json({ message: 'Login successful', user: req.user, userActivity: newUserActivity });
        });
    });
}));
// Logout route
// Logout route
app.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user activity entry for the logged-in user and the current session
        const userActivity = yield models_1.default.UserActivity.findOne({
            where: {
                userId: id,
                logoutTime: null // Assuming logoutTime is a field that indicates whether the user has already logged out
            }
        });
        if (userActivity) {
            // Update the user activity entry with the logout time
            userActivity.logoutTime = new Date();
            yield userActivity.save();
        }
        // Perform logout actions
        req.logout(() => {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).json({ message: 'Error logging out' });
                }
                else {
                    res.json({ message: 'Logout successful' });
                }
            });
        });
    }
    catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
}));
app.get('/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database to get all files
        const files = yield models_1.default.FileActivity.findAll({ where: { userId: id } });
        console.log(files);
        // If there are no files, return a 404 error
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files found' });
        }
        // If files are found, return them in the response
        res.json(files);
        console.log(files);
    }
    catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.query.username;
        console.log("1122220", username, req.query.username);
        const newUser = yield models_1.default.User.findOne({ where: { username } }); // Use `create` instead of `createUser`
        if (newUser === null) {
            // throw new Error('User Not Found !');
            return res.status(404).json({ error: 'User Not Found !' });
        }
        return res.status(201).json({ message: 'User find successfully', user: newUser });
    }
    catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ error: 'User Not Found !' });
    }
}));
app.delete('/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const newUser = yield models_1.default.User.destroy({ where: { username } }); // Use `create` instead of `createUser`
        res.status(201).json({ message: 'User deleted successfully', user: newUser });
    }
    catch (error) {
        console.error('Error finding user:', error);
        res.status(404).json({ error: 'User Not Found !' });
    }
}));
// Define the route handler for updating a user
app.put('/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        console.log(username);
        const { password, email } = req.body;
        console.log(email, username, password);
        // Validate input to prevent SQL injection
        // if (!newUsername || !newPassword || !newEmail) {
        //   return res.status(400).json({ error: 'At least one field (username, password, email) must be provided for update' });
        // }
        // Construct the update object based on provided fields
        const updateObject = {};
        if (username)
            updateObject['username'] = username;
        if (password)
            updateObject['password'] = bcryptjs_1.default.hashSync(password, 10);
        ;
        if (email)
            updateObject['email'] = email;
        // Update the user in the database
        const [updatedRowsCount] = yield models_1.default.User.update(updateObject, { where: { username } });
        console.log(updatedRowsCount, updateObject);
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Send a success response
        return res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'An error occurred while updating user' });
    }
}));
app.get('/users/role/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const users = yield models_1.default.User.findOne({ where: { username } });
        res.json(users.role);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
}));
models_1.default.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port  http://localhost:${port}`);
    });
});
