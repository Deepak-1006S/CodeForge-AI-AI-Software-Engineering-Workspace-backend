import { Types } from 'mongoose';
import { NotificationType } from '../types/models';
export interface CreateNotificationData {
    recipient: string | Types.ObjectId;
    sender?: string | Types.ObjectId;
    type: NotificationType;
    message: string;
    link?: string;
}
export declare const createNotification: (data: CreateNotificationData) => Promise<(import("mongoose").Document<unknown, {}, import("../types/models").INotification, {}, {}> & import("../types/models").INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const getNotifications: (userId: string, page?: number, limit?: number, unreadOnly?: boolean) => Promise<{
    notifications: (import("mongoose").FlattenMaps<import("../types/models").INotification> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../utils/pagination").PaginationMeta;
}>;
export declare const markAsRead: (notificationId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../types/models").INotification, {}, {}> & import("../types/models").INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const markAllRead: (userId: string) => Promise<number>;
export declare const deleteNotification: (notificationId: string, userId: string) => Promise<void>;
export declare const getUnreadCount: (userId: string) => Promise<number>;
//# sourceMappingURL=notification.service.d.ts.map