function factorial(n) {
  let ans = 1;

  if (n === 0) return 1;
  for (let i = 2; i <= n; i++) ans = ans * i;
  return ans;
}

function log(n, base = 10) {
  return Math.log(n) / Math.log(base);
}

function ln(n) {
  return Math.log(n);
}

function sin(n){
  return Math.sin(n);
}

function cos(n){
  return Math.cos(n);
}

function tan(n){
  return Math.tan(n);
}

function sqrt(n){
  return Math.sqrt(n);
}

function getIntPrompt(message){
  try {
    let num = parseInt(prompt(message));
    return num;
  } catch (error) {
    return getIntPrompt(message);
  }
}