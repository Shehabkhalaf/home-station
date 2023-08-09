const URL = 'http://127.0.0.1:8000/';

const tableBody = document.getElementById('product-body');

function updateTable() {
  tableBody.innerHTML = '';

  getAllProducts().then((data) => {
    console.log(data.data);
  });
}
updateTable();

async function getAllProducts() {
  try {
    const res = await fetch(`${URL}api/admin/all_products`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
