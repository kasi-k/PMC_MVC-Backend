const UserService = require("../Service/user_service");
const path = require("path");

exports.createUser = async (req, res, next) => {
    try {
        const { email, fname, lname, phone, dob, type } = req.body;
        const newUser = await UserService.createUser({
            email,
            fname,
            lname,
            phone,
            dob,
            type,
        });

        res.status(200).json({
            success: true,
            message: "An email has been sent to your account. Please verify.",
            userId: newUser._id,
        });
    } catch (error) {
        next(error);
    }
};

exports.signInUser = async (req, res, next) => {
    try {
        const { phone } = req.body;

        const user = await UserService.signInUser(phone);

        res.status(200).json({
            success: true,
            message: "Sign-in successful",
            userId: user._id,
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await UserService.verifyEmail(token);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            userId: user._id,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();

        res.status(200).json({
            success: true,
            user: users,
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.query;

        const user = await UserService.getUserById(id);

        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.query;

        const result = await UserService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateEmail = async (req, res, next) => {
    try {
        const { phone } = req.query;
        const { email } = req.body;

        const result = await UserService.updateEmail(phone, email);

        res.status(200).json({
            success: true,
            message: "Email updated successfully",
            updatedTicketsCount: result.updatedTicketsCount,
            updatedCoursesCount: result.updatedCoursesCount,
        });
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                error: "USER_NOT_FOUND",
                message: "User not found",
            });
        } else if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                success: false,
                error: "EMAIL_ALREADY_EXISTS",
                message: "User with this email already exists",
            });
        }
        next(error);
    }
};

exports.updatePhone = async (req, res, next) => {
    try {
        const { email } = req.query;
        const { phone } = req.body;

        const result = await UserService.updatePhone(email, phone);

        res.status(200).json({
            success: true,
            message: "Phone updated successfully",
            updatedTicketsCount: result.updatedTicketsCount,
            updatedCoursesCount: result.updatedCoursesCount,
        });
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                error: "USER_NOT_FOUND",
                message: "User not found",
            });
        } else if (error.message === "PHONE_ALREADY_EXISTS") {
            return res.status(409).json({
                success: false,
                error: "PHONE_ALREADY_EXISTS",
                message: "User with this phone already exists",
            });
        }
        next(error);
    }
};

exports.uploadCSV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = path.join(__dirname, "./excel", req.file.filename);

        const result = await UserService.uploadCSV(filePath);

        res.status(200).json({
            success: true,
            message: "Data uploaded successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};