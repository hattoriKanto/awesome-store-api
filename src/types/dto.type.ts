import { Address, User } from '@prisma/client';

export type CreateUserDto = Omit<
  User,
  'id' | 'role' | 'isVerified' | 'verificationCode' | 'createdAt' | 'updatedAt'
> &
  Omit<
    Address,
    'id' | 'label' | 'createdAt' | 'updatedAt' | 'userId' | 'isDefault'
  >;

export type CreateAddressDto = Omit<
  Address,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;

export type UpdateAddress = Omit<
  Address,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;
