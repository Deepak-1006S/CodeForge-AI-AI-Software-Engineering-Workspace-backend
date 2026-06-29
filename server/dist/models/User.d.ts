import { Model } from 'mongoose';
import { IUser } from '../types/models';
interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}
export declare const User: IUserModel;
export {};
//# sourceMappingURL=User.d.ts.map