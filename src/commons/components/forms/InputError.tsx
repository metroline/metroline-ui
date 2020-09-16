import React from 'react';

export function InputError({ error, className }: { error: any; className?: string }) {
  return error ? <small className={`text-danger ${className}`}>{error.message}</small> : null;
}
