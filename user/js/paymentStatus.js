import {
  getData as getDataLocal,
  setDataLocal as setDataLocal,
} from './localStorage.js';

const URL = 'http://127.0.0.1:8000';

let listItems = getDataLocal();
const user = localStorage.getItem('user');
const userToken = user ? JSON.parse(user).token : null;

const currentHref = window.location.href;
const queryParams = currentHref.split('?')[1];
const searchParams = new URLSearchParams(queryParams);

// Encryption & Decryption for order ID
const orderIdBefore = searchParams.get('order_id');
const orderIdAfter = (orderIdBefore * 500) / 100;

getPaymentStatus({ order_id: orderIdAfter }).then((data) => {
  // Check if user try to access the url again
  if (data.data) {
    if (data.data.success === 'true') {
      const ordersDetails = [];
      const products = [];

      listItems.forEach((item) => {
        ordersDetails.push(
          `${item.title}, ${item.size}, ${item.color}, ${item.price}`
        );
        products.push({ product_id: item.product_id, amount: item.quantity });
      });

      const orderData = {
        order_details: JSON.stringify(ordersDetails),
        total_price: data.data.amount_cents / 100,
        paid_method: 'paid',
        products: products,
      };

      sendOrder(orderData, userToken);

      listItems = [];
      setDataLocal(listItems);

      swal('successfully Ordered', 'Success Payment.', 'success').then(() => {
        window.location.replace('./products.html');
      });
    } else {
      swal(
        'Error Accurred!',
        'Check your card and try again later',
        'error'
      ).then(() => {
        window.location.replace('./products.html');
      });
    }
  }
});

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

    if (data.status !== 200) {
      swal(
        'Error',
        'Server error, contact with us to confirm your order',
        'error'
      );
    }
  } catch (error) {
    swal(
      'Error',
      'Server error, contact with us to confirm your order',
      'error'
    );
  }
}

async function getPaymentStatus(paymentData) {
  try {
    const response = await fetch(`${URL}/api/user/pay_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (data.status !== 200) {
      swal(
        `${data.message}!`,
        'Go back to products page and make another order.',
        'error'
      ).then(() => {
        window.location.replace('./products.html');
      });
    } else {
      return data;
    }
  } catch (error) {
    swal(
      'Error',
      'Server error, contact with us to confirm your order',
      'error'
    );
  }
}
