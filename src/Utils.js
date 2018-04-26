export const log = (msg, fn) => {
  if(typeof fn === 'function') {
    fn(log);
  } else {
    console.log(msg);
  }
}

export const initFloat = (num, defValue = 0) => {
  if (isNaN(num)) num = defValue;

  return parseFloat(num);
}