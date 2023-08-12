const URL = 'http://127.0.0.1:8000';

// Cheack if user is already logged in
const user = localStorage.getItem('user');
if (user) {
  window.location = 'profile.html';
}

const registerFrom = document.getElementById('register-form');
const registerBtn = document.getElementById('register-btn');
const successMsg = document.getElementById('success');
const errorMsg = document.getElementById('error');

const nameField = document.getElementById('name');
const nameError = document.getElementById('name-error-message');

const mailField = document.getElementById('mail');
const mailError = document.getElementById('mail-error-message');

const passwordField = document.getElementById('password');
const passwordError = document.getElementById('password-error-message');

const confirmPasswordField = document.getElementById('confirm-password');
const confirmPasswordError = document.getElementById(
  'confirm-password-error-message'
);

const phoneField = document.getElementById('phone');
const phoneError = document.getElementById('phone-error-message');

const addressField = document.getElementById('address');
const addressError = document.getElementById('address-error-message');

registerFrom.addEventListener('submit', (e) => handleSubmit(e));

function handleSubmit(e) {
  e.preventDefault();

  const name = nameField.value.trim();
  const mail = mailField.value.trim();
  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;
  const phone = phoneField.value.trim();
  const address = addressField.value.trim();

  if (!name) {
    showError(nameError, 'This field is required!');
    return;
  }

  if (!password) {
    showError(passwordError, 'This field is required!');
    return;
  }

  if (!confirmPassword) {
    showError(confirmPasswordError, 'This field is required!');
    return;
  }

  if (!phone) {
    showError(phoneError, 'This field is required!');
    return;
  }

  if (!address) {
    showError(addressError, 'This field is required!');
    return;
  }

  if (!validateEmail(mail)) {
    showError(mailError, 'Please enter a valid email address!');
    return;
  }

  if (!validatePassword(password)) {
    showError(
      passwordError,
      'Password must be at least 8 characters long and contain numbers!'
    );
    return;
  }

  if (password !== confirmPassword) {
    showError(confirmPasswordError, 'Passwords do not match!');
    return;
  }

  if (!validatePhone(phone)) {
    showError(phoneError, 'Please enter a valid phone number!');
    return;
  }

  const userData = {
    name,
    email: mail,
    phone,
    password,
    address,
  };

  registerUser(userData);
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

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

function validatePhone(phone) {
  const phoneRegex = /^(\+?\d{12}|\d{11})$/;
  return phoneRegex.test(phone);
}

const togglePasswordButton = document.querySelectorAll('#togglePassword');
togglePasswordButton.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.id === 'pass') {
      const type = passwordField.getAttribute('type');
      if (type === 'password') {
        passwordField.setAttribute('type', 'text');
        btn.innerHTML = '<i class="bx bx-show"></i>';
      } else {
        passwordField.setAttribute('type', 'password');
        btn.innerHTML = '<i class="bx bx-hide"></i>';
      }
    } else {
      const type = confirmPasswordField.getAttribute('type');
      if (type === 'password') {
        confirmPasswordField.setAttribute('type', 'text');
        btn.innerHTML = '<i class="bx bx-show"></i>';
      } else {
        confirmPasswordField.setAttribute('type', 'password');
        btn.innerHTML = '<i class="bx bx-hide"></i>';
      }
    }
  });
});

async function registerUser(userData) {
  errorMsg.innerHTML = '';
  try {
    const response = await fetch(`${URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.status === 201) {
      successMsg.innerHTML = 'Registration successful!';
      localStorage.setItem('user', JSON.stringify(data.data));
      setTimeout(() => {
        successMsg.innerHTML = '';
        window.location = 'profile.html';
      }, 3000);
    } else {
      if (data.data['email']) {
        errorMsg.innerHTML = data.data['email'][0];
      } else {
        errorMsg.innerHTML = data.data['phone'][0];
      }
    }
  } catch (error) {
    errorMsg.innerHTML = 'An error occurred. Please try again later.';
  }
}
