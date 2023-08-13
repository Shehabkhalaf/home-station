const URL = 'http://127.0.0.1:8000';

// Check if admin already loggedin
const admin = localStorage.getItem("admin");
if (admin) {
  window.location = "./";
}

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

  if (!mail) {
    showError(mailError, 'This field is required!');
    return;
  }

  const adminData = {
    username: mail,
    password,
  };

  loginUser(adminData);
}

function showError(element, message) {
  element.textContent = message;
  setTimeout(() => {
    element.innerHTML = '';
  }, 5000);
}

const togglePasswordButton = document.getElementById('togglePassword');
togglePasswordButton.addEventListener('click', () => {
  const type = passwordField.getAttribute('type');
  if (type === 'password') {
    passwordField.setAttribute('type', 'text');
    togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
  } else {
    passwordField.setAttribute('type', 'password');
    togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  }
});

async function loginUser(adminData) {
  errorMsg.innerHTML = '';
  try {
    const response = await fetch(`${URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (data.status === 201) {
      successMsg.innerHTML = 'Login successful!';
      localStorage.setItem('admin', JSON.stringify(data.data));
      setTimeout(() => {
        successMsg.innerHTML = '';
        window.location = './';
      }, 3000);
    } else {
      errorMsg.innerHTML = 'Email or password is not correct!';
    }
  } catch (error) {
    errorMsg.innerHTML = 'An error occurred. Please try again later.';
  }
}
