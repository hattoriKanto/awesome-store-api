import { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto implements Pick<User, 'verificationCode'> {
	@IsString()
	@IsNotEmpty()
	verificationCode: string;
}
