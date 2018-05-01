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

export const formatDate = preDate => {
  let date = new Date();
  if(preDate) {
    date = new Date(preDate);
  }
  const d = [date.getFullYear(), ('00' + (date.getMonth() + 1)).slice(-2), ('00' + date.getDate()).slice(-2)];
  const t = [('00' + date.getHours()).slice(-2), ('00' + date.getMinutes()).slice(-2), ('00' + date.getSeconds()).slice(-2)]
  return `${d.join('-')} ${t.join(':')}`;
}