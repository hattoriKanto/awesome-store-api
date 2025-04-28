import { randomInt } from 'crypto';

export const generateVerificationCode = (): string => {
	const code = randomInt(1000, 9999).toString();
	return code;
};
