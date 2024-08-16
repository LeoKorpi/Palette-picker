/**
 * funktion som förhindrar att en funktion kallas på igen tills
 * att wait-tiden har löpt ut
 */
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
