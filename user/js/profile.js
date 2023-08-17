const user = JSON.parse(localStorage.getItem('user'));

// Redirect to login page if not logged in
if (!user) {
  window.location = 'loginen.html';
}

const nameField = document.getElementById('name');
const mailField = document.getElementById('mail');
const phoneField = document.getElementById('phone');
const addressField = document.getElementById('address');
const userName = document.getElementById('head-user-name');

nameField.value = user.name;
mailField.value = user.email;
phoneField.value = user.phone;
addressField.value = user.location;
userName.innerHTML = user.name;
