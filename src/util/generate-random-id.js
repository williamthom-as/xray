export function generateRandomId() {
  let id = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 8; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
}