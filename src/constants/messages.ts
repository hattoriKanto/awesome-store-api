export const MESSAGES = {
  registerUser: {
    passwordPattern:
      'Password too weak. Needs upper, lower, number, and special char',
  },
  user: {
    notFound: 'User not found',
    exist: 'User with such email already exist',
    unverifiedEmail: 'Unverified email',
    invalidCredentials: 'Invalid email or password',
    accessDenied: 'Access denied',
    invalidVerificationCode: 'Invalid verification code',
    alreadyVerified: 'User is already verified',
    sucessVerification: 'Email was verified successfully',
    successCodeSend: 'New code was sent to your email',
    successDeletion: 'User succesfully deleted',
    serverError: 'Internal server error',
  },
  product: {
    notFound: 'Product not found',
    amountError: 'Not enough products in the stock',
    successDeletion: 'Product succesfully deleted',
    serverError: 'Internal server error',
  },
  address: {
    notFound: 'Address not found',
    successDeletion: 'Address succesfully deleted',
    labelPattern: 'Label must be alphanumeric and spaces only',
    longitudeLength: 'Longitude must have up to 8 decimal places',
    latitudeLength: 'Latitude must have up to 8 decimal places',
    idRequired: 'Address id is required',
    atleastOne: 'User must have atleast one address',
  },
  item: {
    notFound: 'Item not found',
    successUpdate: 'Item successfully updated',
    successDeletion: 'Item succesfully deleted',
  },
  cart: {
    notFound: 'Cart not found',
    cleaned: 'Successfully cleaned!',
    successDeletion: 'Cart succesfully deleted',
    infiniteNumber: 'Must be a finite number',
  },
};
