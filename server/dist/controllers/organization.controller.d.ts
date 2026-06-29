import { Request, Response } from 'express';
export declare const createOrg: (req: Request, res: Response) => Promise<void>;
export declare const getOrg: (req: Request, res: Response) => Promise<void>;
export declare const updateOrg: (req: Request, res: Response) => Promise<void>;
export declare const deleteOrg: (req: Request, res: Response) => Promise<void>;
export declare const inviteMember: (req: Request, res: Response) => Promise<void>;
export declare const removeMember: (req: Request, res: Response) => Promise<void>;
export declare const updateMemberRole: (req: Request, res: Response) => Promise<void>;
export declare const getMembers: (req: Request, res: Response) => Promise<void>;
export declare const acceptInvitation: (req: Request, res: Response) => Promise<void>;
export declare const getUserOrganizations: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=organization.controller.d.ts.map