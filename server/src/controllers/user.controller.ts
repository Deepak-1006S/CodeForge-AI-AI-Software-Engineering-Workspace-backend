import { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  res.status(200).json(new ApiResponse(200, { user }, 'Profile retrieved successfully'));
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { name, avatar } = req.body;

  const allowedUpdates: Record<string, unknown> = {};
  if (name !== undefined) allowedUpdates.name = name;
  if (avatar !== undefined) allowedUpdates.avatar = avatar;

  if (Object.keys(allowedUpdates).length === 0) {
    throw new ApiError(400, 'No valid fields provided for update.');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: allowedUpdates },
    { new: true, runValidators: true },
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully'));
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided. Please upload an image.');
  }

  const { mimetype, buffer, size } = req.file;

  // Convert to base64 data URL for storage
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: dataUrl } },
    { new: true },
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { user, fileSize: size },
      'Avatar uploaded successfully',
    ),
  );
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req);
  const { search, role } = req.query;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role && ['Admin', 'Manager', 'Developer'].includes(role as string)) {
    filter.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    User.countDocuments(filter),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  res.status(200).json(new ApiResponse(200, { users }, 'Users retrieved successfully', meta));
};
