export function generateSecureOTP() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return (array[0] % 900000 + 100000).toString();
}