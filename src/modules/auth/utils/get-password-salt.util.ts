import { randomBytes } from 'crypto';

export const getPasswordSalt = (): string => {
	return randomBytes(8).toString('hex');
};
