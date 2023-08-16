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

const isSuccess = searchParams.get('success');
const totalPrice = searchParams.get('amount_cents');

if (isSuccess === 'true') {
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
    total_price: totalPrice / 100,
    paid_method: 'paid',
    products: products,
  };

  sendOrder(orderData, userToken);
  
    listItems = [];
    setDataLocal(listItems);

  swal('successfully Ordered',"Success Payment.", 'success').then(() => {
    window.location = './products.html';
  });

} else {
  swal('Error Accurred!', 'Check your card and try again later', 'error').then(() => {
    window.location = './products.html';
  });
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
