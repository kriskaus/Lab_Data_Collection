"use strict";
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
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = __importDefault(require("../models"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
// Parse JSON bodies
// app.use(bodyParser.json());
// // Parse URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: 'Lab_Server', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds (e.g., 1 day)
    }
}));
// Initialize Passport.js middleware
// app.use(passport .initialize());
// // Use session middleware for persisting login sessions
// app.use(passport.session());
// Configure Passport.js
passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
    try {
        // Find user by username
        const user = await models_1.default.findOne({ where: { username } });
        // If user not found or password is incorrect
        if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        // If authentication succeeds, return user
        return done(null, user);
    }
    catch (error) {
        console.error('Error authenticating user:', error);
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await models_1.default.findByPk(id);
        done(null, user);
    }
    catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});
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
// / Serve static files from the React frontend app
// app.use('/downloads', express.static(path.join(new URL('.', import.meta.url).pathname, 'downloads')));
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}
// API endpoint for uploading files
app.post('/upload', ensureAuthenticated, upload.single('file'), (req, res) => {
    console.log('File uploaded successfully:');
    res.status(200).json({ message: 'File uploaded successfully' });
});
// API endpoint for downloading files
app.get('/download/:filename', ensureAuthenticated, (req, res) => {
    console.log(__dirname, __filename);
    const filename = req.params.filename; // Extract the filename from the request parameters
    const filePath = path_1.default.join(__dirname, '../uploads', filename); // Construct the file path
    console.log(filePath, filename);
    // Check if the file exists
    if (fs_1.default.existsSync(filePath)) {
        // If the file exists, send it as a download using res.download()
        res.download(filePath, filename, (err) => {
            console.log("File download Successfully");
            if (err) {
                // If an error occurs during download, send an error response
                res.status(500).send('Error downloading file');
            }
        });
    }
    else {
        // If the file does not exist, send a 404 Not Found response
        res.status(404).send('File not found');
    }
});
// Register user route
app.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        if (req.session && req.session.id) {
            // User is authenticated, render profile page with user data
            const { username, password, email } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            const newUser = await models_1.default.User.createUser({ username, password: hashedPassword, email });
            res.send('/login');
            res.status(201).json({ message: 'User registered successfully', user: newUser });
            res.render('profile', { user: req.session.id });
        }
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.redirect('/login');
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
});
// Login route
app.post('/login', passport_1.default.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    ; // Store user data in the session
    res.redirect('/login');
    res.json({ message: 'Login successful', user: req.user });
});
// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logout successful' });
    });
});
models_1.default.sequelize.sync().then(() => {
    console.log(models_1.default.User);
    app.listen(port, () => {
        console.log(`Server is running on port  http://localhost:${port}`);
    });
});
