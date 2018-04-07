export const log = (msg, fn) => {
  if(typeof fn === 'function') {
    fn(log);
  } else {
    console.log(msg);
  }
}