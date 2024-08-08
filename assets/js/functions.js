function factorial(n) {
  let ans = 1;

  if (n === 0) return 1;
  for (let i = 2; i <= n; i++) ans = ans * i;
  return ans;
}

function getIntPrompt(message){
  try {
    let num = parseInt(prompt(message));
    return num;
  } catch (error) {
    return getIntPrompt(message);
  }
}