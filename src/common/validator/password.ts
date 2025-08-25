import * as bcrypt from 'bcrypt';

export const validatePassword = (
  reqPassword: string,
  existPassword,
): Promise<boolean> => {
  return bcrypt.compare(reqPassword, existPassword);
};
