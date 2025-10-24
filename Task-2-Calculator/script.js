const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.textContent;

    if (value === 'C') {
      display.value = '';
    } 
    else if (value === '⌫') {
      display.value = display.value.slice(0, -1);
    } 
    else if (value === '=') {
      try {
        display.value = eval(display.value
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-'));
      } catch {
        display.value = 'Error';
      }
    } 
    else {
      display.value += value;
    }
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.'].includes(key)) {
    display.value += key;
  } 
  else if (key === 'Enter') {
    try {
      display.value = eval(display.value);
    } catch {
      display.value = 'Error';
    }
  } 
  else if (key === 'Backspace') {
    display.value = display.value.slice(0, -1);
  } 
  else if (key === 'Escape') {
    display.value = '';
  }
});
