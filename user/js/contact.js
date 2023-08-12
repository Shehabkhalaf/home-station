const URL = 'http://127.0.0.1:8000';

const contactForm = document.getElementById('contact-form');
const contactBtn = document.getElementById('contact-btn');
const successMsg = document.getElementById('success');
const errorMsg = document.getElementById('error');

const nameField = document.getElementById('name');
const nameError = document.getElementById('name-error-message');

const mailField = document.getElementById('mail');
const mailError = document.getElementById('mail-error-message');

const phoneField = document.getElementById('phone');
const phoneError = document.getElementById('phone-error-message');

const msgField = document.getElementById('msg');
const msgError = document.getElementById('msg-error-message');

contactForm.addEventListener('submit', (e) => handleSubmit(e));

function handleSubmit(e) {
  e.preventDefault();

  const name = nameField.value;
  const mail = mailField.value;
  const phone = phoneField.value;
  const msg = msgField.value;

  if (name === '') {
    nameError.innerHTML = 'This field is required!';
    setTimeout(() => {
      nameError.innerHTML = '';
    }, 4000);
    return;
  }

  if (mail === '') {
    mailError.innerHTML = 'This field is required!';
    setTimeout(() => {
      mailError.innerHTML = '';
    }, 4000);
    return;
  }
  if (!isValidEmail(mail)) {
    mailError.innerHTML = 'Please enter a valid email address!';
    setTimeout(() => {
      mailError.innerHTML = '';
    }, 4000);
    return;
  }

  if (phone === '') {
    phoneError.innerHTML = 'This field is required!';
    setTimeout(() => {
      nameError.innerHTML = '';
    }, 4000);
    return;
  }

  if (msg === '') {
    msgError.innerHTML = 'This field is required!';
    setTimeout(() => {
      msgError.innerHTML = '';
    }, 4000);
    return;
  }

  const data = { name, email: mail, phone, message: msg };
  sendMsg(data, errorMsg, successMsg, contactBtn);
  nameField.value = '';
  mailField.value = '';
  phoneField.value = '';
  msgField.value = '';
}

function isValidEmail(email) {
  const emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;

  return emailPattern.test(email);
}

async function sendMsg(data, errorMessageELe, successMessage, submitBtn) {
  try {
    submitBtn.innerHTML = 'Submitting...';
    submitBtn.disabled = true;

    const res = await fetch(`${URL}/api/user/Contact_Us`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    submitBtn.innerHTML = 'Send Now';
    submitBtn.disabled = false;

    const resData = await res.json();

    if (resData.status !== 201) {
      errorMessageELe.textContent = resData.data['promocode'][0];
      setTimeout(() => {
        errorMessageELe.textContent = '';
      }, 4000);
    } else {
      successMessage.textContent = 'Message has been Sent.';
      setTimeout(() => {
        successMessage.textContent = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}