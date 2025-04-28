export type UserStatusUpdate = {
  id: string;
  isVerified: boolean;
};

export type UserCodeUpdate = {
  id: string;
  verificationCode: string;
};
