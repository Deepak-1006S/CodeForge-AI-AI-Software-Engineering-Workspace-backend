"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.uploadAvatar = exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const getProfile = async (req, res) => {
    const user = await User_1.User.findById(req.user._id).select('-password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { user }, 'Profile retrieved successfully'));
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const { name, avatar } = req.body;
    const allowedUpdates = {};
    if (name !== undefined)
        allowedUpdates.name = name;
    if (avatar !== undefined)
        allowedUpdates.avatar = avatar;
    if (Object.keys(allowedUpdates).length === 0) {
        throw new ApiError_1.ApiError(400, 'No valid fields provided for update.');
    }
    const user = await User_1.User.findByIdAndUpdate(req.user._id, { $set: allowedUpdates }, { new: true, runValidators: true }).select('-password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { user }, 'Profile updated successfully'));
};
exports.updateProfile = updateProfile;
const uploadAvatar = async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'No image file provided. Please upload an image.');
    }
    const { mimetype, buffer, size } = req.file;
    // Convert to base64 data URL for storage
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimetype};base64,${base64}`;
    const user = await User_1.User.findByIdAndUpdate(req.user._id, { $set: { avatar: dataUrl } }, { new: true }).select('-password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { user, fileSize: size }, 'Avatar uploaded successfully'));
};
exports.uploadAvatar = uploadAvatar;
const getUsers = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
    const { search, role } = req.query;
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    if (role && ['Admin', 'Manager', 'Developer'].includes(role)) {
        filter.role = role;
    }
    const [users, total] = await Promise.all([
        User_1.User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        User_1.User.countDocuments(filter),
    ]);
    const meta = (0, pagination_1.buildPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { users }, 'Users retrieved successfully', meta));
};
exports.getUsers = getUsers;
