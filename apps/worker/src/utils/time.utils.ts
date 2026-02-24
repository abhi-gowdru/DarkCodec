export const getExpirationTimestamp = (expiresInHours: number): number => {
  return Math.floor(Date.now() / 1000) + (expiresInHours * 3600);
};

export const getNow = (): number => {
  return Math.floor(Date.now() / 1000);
};