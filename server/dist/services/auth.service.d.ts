import { JwtPayload } from 'jsonwebtoken';
interface TokenPayload {
    id: string;
    role: string;
}
export declare const generateAccessToken: (userId: string, role: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload & TokenPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload & {
    id: string;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map