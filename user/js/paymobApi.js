import {
  getData as getDataLocal,
  setDataLocal as setDataLocal,
} from './localStorage.js';

const URL = 'http://127.0.0.1:8000';

let listItems = getDataLocal();
const user = localStorage.getItem('user');
const userToken = user ? JSON.parse(user).token : null;

// Get Elements
const nameI = document.getElementById('nameInput');
const phone = document.getElementById('phoneInput');
const email = document.getElementById('emailInput');
const address = document.getElementById('addressInput');
const governorates = document.getElementById('selectedGon');

const promocode = document.getElementById('inputPassword2');
const applyPromocode = document.getElementById('apply-promo');
const promoMsg = document.querySelector('.promo');

// Storage Values
let nameValue;
let phoneValue;
let emailValue;
let addressVAlue;
let governoratesValue;
let promoValue;

let sentPromoValue;
let promoName = '';

governorates.addEventListener('change', (e) => {
  governoratesValue = e.target.value;
});

applyPromocode.addEventListener('click', (e) => handlePromo(e));

function handlePromo(e) {
  e.preventDefault();

  promoValue = promocode.value;
  applyPromocode.disabled = false;

  if (promoValue === '') {
    return;
  } else {
    getAllOffers().then((data) => {
      let totalPrice =
        listItems
          .map((e) => +e.quantity * +e.price)
          .reduce((acc, ele) => acc + ele) + 60;

      promoMsg.innerHTML = '';
      for (const offer of data.data) {
        if (promoValue.trim().toLowerCase() === offer.promocode) {
          totalPrice = totalPrice * (1 - +offer.discount / 100);
          sentPromoValue = +offer.discount;
          promoName = promoValue.trim().toLowerCase();
          promoMsg.innerHTML = `
            <p>You have used <span>${offer.promocode}</span> promocode with discount:</p>
            <span>${offer.discount}%</span>
            <p>Total price will be: <span>${totalPrice}</span></p>
          `;
          applyPromocode.disabled = true;
          break;
        } else {
          sentPromoValue = 0;
        }
      }

      if (!promoMsg.innerHTML) {
        promoMsg.innerHTML = `
          There is no promocode: ${promoValue}
        `;
      }

      promocode.value = '';
    });
  }
}

// Click Button Check Out
document.getElementById('checkOut').addEventListener('click', () => {
  if (!userToken) {
    swal(
      'Please, login first',
      'You cant check out without login or register!',
      'error'
    );
    setTimeout(() => {
      window.location = './loginen.html';
    }, 2000);
    return;
  }

  nameValue = nameI.value;
  phoneValue = phone.value;
  emailValue = email.value;
  addressVAlue = address.value;

  if (nameValue.trim()) {
    nameI.classList.add('right');
    nameI.classList.remove('wrong');
  } else {
    nameI.classList.add('wrong');
    nameI.classList.remove('right');
  }

  if (phoneValue.trim()) {
    phone.classList.remove('wrong');
    phone.classList.add('right');
  } else {
    phone.classList.add('wrong');
    phone.classList.remove('right');
  }

  if (emailValue.trim()) {
    email.classList.remove('wrong');
    email.classList.add('right');
  } else {
    email.classList.add('wrong');
    email.classList.remove('right');
  }

  if (addressVAlue.trim()) {
    address.classList.remove('wrong');
    address.classList.add('right');
  } else {
    address.classList.add('wrong');
    address.classList.remove('right');
  }

  if (governoratesValue) {
    governorates.classList.remove('wrong');
    governorates.classList.add('right');
  } else {
    governorates.classList.add('wrong');
    governorates.classList.remove('right');
  }

  if (!validateEmail(emailValue)) {
    email.classList.add('wrong');
    email.classList.remove('right');
  } else {
    email.classList.remove('wrong');
    email.classList.add('right');
  }

  if (!validatePhone(phoneValue)) {
    phone.classList.add('wrong');
    phone.classList.remove('right');
  } else {
    phone.classList.remove('wrong');
    phone.classList.add('right');
  }

  if (
    nameValue.trim() &&
    emailValue.trim() &&
    phoneValue.trim() &&
    addressVAlue.trim() &&
    governoratesValue
  ) {
    document.querySelector('.offcanvasTopButton').click();
  }
});

let option = 'option1';

let radio = document.querySelectorAll('.radio');

radio.forEach((ele) => {
  ele.addEventListener('change', (event) => {
    option = event.target.value;
  });
});

let frameId;
let integration_id;

document.querySelectorAll('#checkoutFinal').forEach((item) => {
  item.addEventListener('click', () => {
    if (option === 'option1') {
      integration_id = 3925798;
      frameId = '767482';
      firstStep();
    } else if (option === 'option3') {
      integration_id = 4086195;
      frameId = '779852';
      firstStep();
    } else {
      SendProduct(listItems, userToken);
    }
  });
});

function dataApi() {
  let list = [];
  listItems.forEach((item) => {
    let x = {
      name: item.title,
      amount_cents: String(item.price),
      description: item.title + item.size + item.price + item.color,
      quantity: String(item.quantity),
    };
    list.push(x);
  });
  return list;
}

// Paymob
const API =
  'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RJMU1UUTVMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuYi14V1NwbHhmbUVlYnUwWDZxTk5ZMi1Ba1hrZldjaFZrQ0JtZ3NaenAyQ0JBTEQxWFR4eW4tYm9WYkRFc0NfYmEzOTMtRmliVmtJXzM3WEJKUHJsS1E='; // your api here

async function firstStep() {
  let data = {
    api_key: API,
  };

  let request = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  let response = await request.json();

  let token = response.token;

  secondStep(token);
}

async function secondStep(token) {
  let data = {
    auth_token: token,
    delivery_needed: 'false',
    amount_cents:
      (getDataLocal()
        .map((e) => +e.quantity * +e.price)
        .reduce((acc, ele) => acc + ele) +
        60) *
        (1 - (sentPromoValue ? sentPromoValue : 0) / 100) ===
      60
        ? '0'
        : (getDataLocal()
            .map((e) => +e.quantity * +e.price)
            .reduce((acc, ele) => acc + ele) +
            60) *
          (1 - (sentPromoValue ? sentPromoValue : 0) / 100) *
          100,
    currency: 'EGP',
    items: dataApi(),
  };

  let request = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  let response = await request.json();

  let id = response.id;

  thirdStep(token, id);
}

async function thirdStep(token, id) {
  let data = {
    auth_token: token,
    amount_cents:
      (getDataLocal()
        .map((e) => +e.quantity * +e.price)
        .reduce((acc, ele) => acc + ele) +
        60) *
        (1 - (sentPromoValue ? sentPromoValue : 0) / 100) ===
      60
        ? '0'
        : (getDataLocal()
            .map((e) => +e.quantity * +e.price)
            .reduce((acc, ele) => acc + ele) +
            60) *
          (1 - (sentPromoValue ? sentPromoValue : 0) / 100) *
          100,
    expiration: 3600,
    order_id: `${id}`,
    billing_data: {
      apartment: '803',
      email: emailValue,
      floor: '42',
      first_name: nameValue,
      street: addressVAlue,
      building: '8028',
      phone_number: phoneValue,
      shipping_method: 'PKG',
      postal_code: '01898',
      city: governoratesValue,
      country: 'CR',
      last_name: nameValue,
      state: 'Utah',
    },
    currency: 'EGP',
    integration_id: integration_id,
  };

  let request = await fetch(
    'https://accept.paymob.com/api/acceptance/payment_keys',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );

  let response = await request.json();

  let TheToken = response.token;

  cardPayment(TheToken);
}

async function cardPayment(token) {
  let iframURL = `https://accept.paymob.com/api/acceptance/iframes/${frameId}?payment_token=${token}`;
  window.open(iframURL, '_blank');
}

function SendProduct(listItems, userToken) {
  const ordersDetails = [];
  const products = [];

  listItems.forEach((item) => {
    ordersDetails.push(
      `${item.title}, ${item.size}, ${item.color}, ${item.price}`
    );
    products.push({ product_id: item.product_id, amount: item.quantity });
  });

  let totalPrice =
    listItems
      .map((e) => +e.quantity * +e.price)
      .reduce((acc, ele) => acc + ele) + 60;

  totalPrice =
    totalPrice - totalPrice * ((sentPromoValue ? sentPromoValue : 0) / 100);

  const orderData = {
    order_details: JSON.stringify(ordersDetails),
    total_price: totalPrice,
    paid_method: 'cash',
    products: products,
  };

  promoName && (orderData.promocode = promoName);

  sendOrder(orderData, userToken);
}

function validateEmail(email) {
  const emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^(\+?\d{12}|\d{11})$/;
  return phoneRegex.test(phone);
}

async function getAllOffers() {
  try {
    const res = await fetch(`${URL}/api/user/all_offers`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function sendOrder(orderData, UserToken) {
  try {
    const response = await fetch(`${URL}/api/user/make_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${UserToken}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (data.status === 200) {
      swal(
        'successfully Ordered',
        'Well, you will be contacted within 48 hours. If there is no response, please contact us 0109-833-6319',
        'success'
      );

      listItems = [];
      setDataLocal(listItems);

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } else {
      swal('Error', 'An error occurred. Please try again later.', 'error');
    }
  } catch (error) {
    swal('Error', 'An error occurred. Please try again later.', 'error');
  }
}
