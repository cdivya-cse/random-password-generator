/**
 * script.js
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Frontend API Integration: Uses vanilla JS fetch() to talk to Java HttpServer endpoints.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Checker
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const clearPasswordBtn = document.getElementById('clearPasswordBtn');
  const checkPasswordBtn = document.getElementById('checkPasswordBtn');
  const checkBtnText = document.getElementById('checkBtnText');
  const checkSpinner = document.getElementById('checkSpinner');
  const strengthLevelText = document.getElementById('strengthLevelText');
  const scoreValue = document.getElementById('scoreValue');
  const strengthMeter = document.getElementById('strengthMeter');
  const entropyValue = document.getElementById('entropyValue');
  const crackTimeValue = document.getElementById('crackTimeValue');
  const suggestionsList = document.getElementById('suggestionsList');

  // Requirement items
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqNumber = document.getElementById('reqNumber');
  const reqSpecial = document.getElementById('reqSpecial');

  // DOM Elements - Generator
  const generatedPasswordDisplay = document.getElementById('generatedPasswordDisplay');
  const copyPasswordBtn = document.getElementById('copyPasswordBtn');
  const regenPasswordBtn = document.getElementById('regenPasswordBtn');
  const copyToast = document.getElementById('copyToast');
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthValueDisplay = document.getElementById('lengthValueDisplay');
  const includeUpper = document.getElementById('includeUpper');
  const includeLower = document.getElementById('includeLower');
  const includeNumbers = document.getElementById('includeNumbers');
  const includeSpecial = document.getElementById('includeSpecial');
  const generatePasswordBtn = document.getElementById('generatePasswordBtn');
  const genBtnText = document.getElementById('genBtnText');
  const genSpinner = document.getElementById('genSpinner');
  const genStrengthNotice = document.getElementById('genStrengthNotice');
  const genStrengthText = document.getElementById('genStrengthText');

  // 1. Toggle Password Visibility
  let isPasswordVisible = false;
  togglePasswordBtn.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
  });

  // 2. Clear Password
  clearPasswordBtn.addEventListener('click', () => {
    passwordInput.value = '';
    resetCheckerUI();
  });

  // 3. Password Input Event (Debounced live check)
  let debounceTimeout = null;
  passwordInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      checkPassword();
    }, 250);
  });

  checkPasswordBtn.addEventListener('click', () => {
    checkPassword();
  });

  async function checkPassword() {
    const password = passwordInput.value;
    if (!password) {
      resetCheckerUI();
      return;
    }

    setCheckerLoading(true);

    try {
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      updateCheckerUI(result);
    } catch (err) {
      console.error('Password checking failed:', err);
      strengthLevelText.textContent = 'Check Failed';
      strengthLevelText.style.color = '#ef4444';
      suggestionsList.innerHTML = '<li>Unable to connect to Java backend. Ensure PasswordServer is running on port 8085.</li>';
    } finally {
      setCheckerLoading(false);
    }
  }

  function updateCheckerUI(result) {
    const score = result.score || 0;
    const level = result.strengthLevel || 'Very Weak';

    scoreValue.textContent = score;
    strengthLevelText.textContent = level;
    strengthMeter.style.width = Math.max(5, score) + '%';

    // Color code based on strength
    let color = '#ef4444'; // Red
    if (level === 'Weak') color = '#f97316'; // Orange
    else if (level === 'Medium') color = '#f59e0b'; // Amber
    else if (level === 'Strong') color = '#10b981'; // Emerald
    else if (level === 'Very Strong') color = '#06b6d4'; // Cyan

    strengthLevelText.style.color = color;
    strengthMeter.style.backgroundColor = color;

    // Metrics
    entropyValue.textContent = (result.entropyBits || 0).toFixed(1) + ' bits';
    crackTimeValue.textContent = result.crackTimeDisplay || 'Instant';

    // Checklist
    updateRequirement(reqLength, result.meetsLength);
    updateRequirement(reqUpper, result.hasUppercase);
    updateRequirement(reqLower, result.hasLowercase);
    updateRequirement(reqNumber, result.hasNumber);
    updateRequirement(reqSpecial, result.hasSpecial);

    // Suggestions
    suggestionsList.innerHTML = '';
    if (result.suggestions && result.suggestions.length > 0) {
      result.suggestions.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        suggestionsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'Password satisfies all security benchmarks!';
      suggestionsList.appendChild(li);
    }
  }

  function updateRequirement(el, isMet) {
    if (isMet) {
      el.classList.add('met');
    } else {
      el.classList.remove('met');
    }
  }

  function resetCheckerUI() {
    scoreValue.textContent = '0';
    strengthLevelText.textContent = 'Very Weak';
    strengthLevelText.style.color = 'var(--text-muted)';
    strengthMeter.style.width = '5%';
    strengthMeter.style.backgroundColor = '#ef4444';
    entropyValue.textContent = '0.0 bits';
    crackTimeValue.textContent = 'Instant';

    [reqLength, reqUpper, reqLower, reqNumber, reqSpecial].forEach(el => el.classList.remove('met'));
    suggestionsList.innerHTML = '<li>Enter a password to begin real-time security analysis.</li>';
  }

  function setCheckerLoading(isLoading) {
    if (isLoading) {
      checkSpinner.classList.remove('hidden');
      checkBtnText.textContent = 'Analyzing...';
      checkPasswordBtn.disabled = true;
    } else {
      checkSpinner.classList.add('hidden');
      checkBtnText.textContent = 'Analyze Password';
      checkPasswordBtn.disabled = false;
    }
  }

  // 4. Generator Controls
  lengthSlider.addEventListener('input', () => {
    lengthValueDisplay.textContent = `${lengthSlider.value} characters`;
  });

  generatePasswordBtn.addEventListener('click', generatePassword);
  regenPasswordBtn.addEventListener('click', generatePassword);

  async function generatePassword() {
    const length = parseInt(lengthSlider.value, 10);
    const uppercase = includeUpper.checked;
    const lowercase = includeLower.checked;
    const numbers = includeNumbers.checked;
    const special = includeSpecial.checked;

    if (!uppercase && !lowercase && !numbers && !special) {
      alert('Please select at least one character category (uppercase, lowercase, numbers, or special).');
      return;
    }

    setGenLoading(true);

    try {
      const response = await fetch('/api/generate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length,
          uppercase,
          lowercase,
          numbers,
          special,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      generatedPasswordDisplay.textContent = data.password;

      // Show strength notice
      if (data.analysis) {
        genStrengthNotice.classList.remove('hidden');
        genStrengthText.textContent = `${data.analysis.strengthLevel} (Score: ${data.analysis.score}/100, Entropy: ${data.analysis.entropyBits} bits)`;
      }
    } catch (err) {
      console.error('Password generation failed:', err);
      generatedPasswordDisplay.textContent = 'Generation Failed';
    } finally {
      setGenLoading(false);
    }
  }

  function setGenLoading(isLoading) {
    if (isLoading) {
      genSpinner.classList.remove('hidden');
      genBtnText.textContent = 'Generating...';
      generatePasswordBtn.disabled = true;
    } else {
      genSpinner.classList.add('hidden');
      genBtnText.textContent = 'Generate Secure Password';
      generatePasswordBtn.disabled = false;
    }
  }

  // 5. Copy to Clipboard
  copyPasswordBtn.addEventListener('click', async () => {
    const text = generatedPasswordDisplay.textContent;
    if (!text || text === 'Click Generate Below' || text === 'Generation Failed') {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      copyToast.classList.remove('hidden');
      setTimeout(() => {
        copyToast.classList.add('hidden');
      }, 2000);
    } catch (err) {
      console.warn('Clipboard write failed, using fallback', err);
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyToast.classList.remove('hidden');
      setTimeout(() => {
        copyToast.classList.add('hidden');
      }, 2000);
    }
  });

  // Automatically generate an initial password on load
  generatePassword();
});
