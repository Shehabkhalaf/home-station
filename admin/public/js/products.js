const URL = 'http://127.0.0.1:8000/';
let allCategories = [];
let allProducts = [];

const catSelect = document.getElementById('cat-select');
const tableBody = document.getElementById('product-body');

/**
 * Filtering
 */

getAllCategories().then((data) => {
  data.data.forEach((cat) => {
    allCategories.push(cat);
  });

  catSelect.innerHTML = allCategories.map((cat) => {
    return `<option value="${cat.id}">${cat.title}</option>`;
  });
});

async function getAllCategories() {
  try {
    const res = await fetch(`${URL}api/admin/all_categories`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function updateTable() {
  tableBody.innerHTML = `<span class="loader"></span>`;

  getAllProducts().then((data) => {
    console.log(data);
    tableBody.innerHTML = '';

    allProducts = data.data.filter((product) => product.category_id === 1);
    console.log(allProducts);
    const catName = allProducts[0].category_name;

    if (allProducts[0].products.length > 0) {
      allProducts[0].products.forEach((product) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm">${product.product_id}</td>
        <td class="p-3 text-gray-700 text-sm">${product.images.map(
          (img) => img
        )}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${
          product.product_name
        }</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${catName}</td>
        <td class="p-3 text-gray-700 text-sm">${product.description}</td>
        <td class="p-3 text-gray-700 text-sm">${product.size.map((size) =>
          JSON.parse(size)
        )}</td>
        <td class="p-3 text-gray-700 text-sm">${product.price.map((size) =>
          JSON.parse(size)
        )}</td>
        <td class="p-3 text-gray-700 text-sm">${product.discount}</td>
        <td class="p-3 text-gray-700 text-sm">${product.status}</td>
        <td class="p-3 text-gray-700 text-sm">${product.color.map((colors) =>
          JSON.parse(colors)
        )}</td>
        `;

        tableBody.append(tr);
      });
    } else {
      tableBody.innerHTML = `<tr><td class="p-3 text-gray-700 text-lg whitespace-nowrap">Not Found!</td></tr>`;
    }
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
