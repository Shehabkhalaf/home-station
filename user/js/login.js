const URL = 'http://127.0.0.1:8000';

const loginFrom = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const successMsg = document.getElementById('success');
const errorMsg = document.getElementById('error');

const mailField = document.getElementById('mail');
const mailError = document.getElementById('mail-error-message');

const passwordField = document.getElementById('password');
const passwordError = document.getElementById('password-error-message');

loginFrom.addEventListener('submit', (e) => handleSubmit(e));

function handleSubmit(e) {
  e.preventDefault();

  const mail = mailField.value.trim();
  const password = passwordField.value;

  if (!password) {
    showError(passwordError, 'This field is required!');
    return;
  }

  if (!validateEmail(mail)) {
    showError(mailError, 'Please enter a valid email address!');
    return;
  }

  const userData = {
    email: mail,
    password,
  };

  loginUser(userData);
}

function showError(element, message) {
  element.textContent = message;
  setTimeout(() => {
    element.innerHTML = '';
  }, 5000);
}

function validateEmail(email) {
  const emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;
  return emailRegex.test(email);
}

const togglePasswordButton = document.getElementById('togglePassword');
togglePasswordButton.addEventListener('click', () => {
  const type = passwordField.getAttribute('type');
  if (type === 'password') {
    passwordField.setAttribute('type', 'text');
    togglePasswordButton.innerHTML = '<i class="bx bx-show"></i>';
  } else {
    passwordField.setAttribute('type', 'password');
    togglePasswordButton.innerHTML = '<i class="bx bx-hide"></i>';
  }
});

async function loginUser(userData) {
  errorMsg.innerHTML = '';
  try {
    const response = await fetch(`${URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.status === 200) {
      successMsg.innerHTML = 'Login successful!';
      localStorage.setItem('user', JSON.stringify(data.data));
      setTimeout(() => {
        successMsg.innerHTML = '';
        window.location = 'profile.html';
      }, 3000);
    } else {
      errorMsg.innerHTML = 'Email or password is not correct!';
    }
  } catch (error) {
    errorMsg.innerHTML = 'An error occurred. Please try again later.';
  }
}
