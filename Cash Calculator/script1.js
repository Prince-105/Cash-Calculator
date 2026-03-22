const denominations = [
    { id: 'no100', value: 100, out: 'txt100' },
    { id: 'no50', value: 50, out: 'txt50' },
    { id: 'no10', value: 10, out: 'txt10' },
    { id: 'no5', value: 5, out: 'txt5' },
    { id: 'no1', value: 1, out: 'txt1' },
    { id: 'nocoin50', value: 0.50, out: 'txt1coin50' },
    { id: 'nocoin5', value: 0.25, out: 'txt1coin5' },
    { id: 'nocoin2', value: 0.10, out: 'txt1coin2' },
    { id: 'nocoin1', value: 0.01, out: 'txt1coin1' },
];

const totalDisplay = document.getElementById('txtFinalCash');
const totalInWords = document.getElementById('txtFinalCashInWords');
const resetButton = document.getElementById('btnReset');

function formatNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString('en-US') : '0';
}

function toWords(num) {
  if (num === 0) return 'Zero';
  const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b = ['','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

  function chunk(n) {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n) str += ' and ';
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)];
      if (n % 10) str += ' ' + a[n % 10];
    } else if (n) {
      str += a[n];
    }
    return str;
  }

  const parts = [];
  const scales = ['Thousand', ''];
  const divisors = [1000, 1];
  let remainder = num;

  divisors.forEach((div, idx) => {
    if (remainder >= div) {
      const value = Math.floor(remainder / div);
      remainder %= div;
      const wordPart = chunk(value);
      if (wordPart) {
        parts.push(wordPart + (scales[idx] ? ' ' + scales[idx] : ''));
      }
    }
  });

  return parts.join(' ').trim();
}

function updateTotals() {
  let total = 0;
  denominations.forEach((denom) => {
    const inEl = document.getElementById(denom.id);
    const outEl = document.getElementById(denom.out);
    if (!inEl || !outEl) return;
    let n = parseInt(inEl.value, 10);
    if (!Number.isFinite(n) || n < 0) n = 0;
    inEl.value = n;
    const sub = n * denom.value;
    outEl.textContent = formatNumber(sub);
    total += sub;
  });

  if (totalDisplay) {
    totalDisplay.textContent = `Total Amount : ${formatNumber(total)}`;
  }
  if (totalInWords) {
    totalInWords.textContent = toWords(Math.floor(total)) + ' Dollars';
  }
}

function resetAll() {
  denominations.forEach((denom) => {
    const inEl = document.getElementById(denom.id);
    const outEl = document.getElementById(denom.out);
    if (inEl) inEl.value = '';
    if (outEl) outEl.textContent = '0';
  });

  if (totalDisplay) totalDisplay.textContent = 'Total Amount : 0';
  if (totalInWords) totalInWords.textContent = 'Zero';
}

window.addEventListener('DOMContentLoaded', () => {
  const optionBtn = document.getElementById('option');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (optionBtn && dropdownMenu) {
    // Toggle dropdown on button click
    optionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });
  } else if (optionBtn) {
    // index1.html or pages without dropdown: use button as navigation back to main calculator
    optionBtn.addEventListener('click', () => {
      window.location.href = 'Cash Calculator/Index.html';
    });
  }

  // India option navigates to Index.html while keeping dropdown label behavior
  const indiaOption = document.getElementById('indiaOption');
  if (indiaOption) {
    indiaOption.addEventListener('click', (e) => {
      e.preventDefault();
      selectCountry('India');
      window.location.href = 'Cash Calculator/Index.html';
    });
  }

  denominations.forEach((denom) => {
    const inputEl = document.getElementById(denom.id);
    if (inputEl) {
      inputEl.addEventListener('input', updateTotals);
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', resetAll);
  }

  resetAll();
});

function selectCountry(country) {
  console.log('Selected country: ' + country);
  const optionBtn = document.getElementById('option');
  optionBtn.textContent = country + ' ▼';
  document.getElementById('dropdownMenu').classList.remove('show');
}
