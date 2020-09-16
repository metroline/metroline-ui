export const EMAIL_PATTERN = /^.+@.+$/;
export const MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 5;

export const required = {
  value: true,
  message: 'Input is required',
};

export const isEmail = {
  value: EMAIL_PATTERN,
  message: 'Invalid email',
};

export function maxLength(l?: number) {
  const max = l ?? MAX_LENGTH;
  return {
    value: max,
    message: `Max length is ${max}`,
  };
}

export function minLength(l: number) {
  return {
    value: l,
    message: `Min length is ${l}`,
  };
}
