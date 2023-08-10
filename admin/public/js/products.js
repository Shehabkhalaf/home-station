const URL = 'http://127.0.0.1:8000/';
let allCategories = [];
let allProducts = [];

const catSelect = document.getElementById('cat-select');
const filterBtn = document.getElementById('filter-btn');
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

  filterBtn.addEventListener('click', () => {
    updateTable(catSelect.value);
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

function updateTable(id) {
  tableBody.innerHTML = `<span class="loader"></span>`;

  getAllProducts().then((data) => {
    console.log(data);
    tableBody.innerHTML = '';

    allProducts = data.data.filter(
      (product) => product.category_id === parseInt(id)
    );
    console.log(allProducts);
    const catName = allProducts[0].category_name;

    if (allProducts[0].products.length > 0) {
      allProducts[0].products.forEach((product) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm">${product.product_id}</td>
        <td class="p-3 text-gray-700 text-sm flex flex-wrap">${product.images.map(
          (src) => `<img src="${src}" alt="${product.product_name}"/>`
        )}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${
          product.product_name
        }</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${catName}</td>
        <td class="p-3 text-gray-700 text-sm">${product.description}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.size).map((size) =>
          `<p>${size}</p>`
        )}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.price).map((price) =>
          `<p>${price}</p>`
        )}</td>
        <td class="p-3 text-gray-700 text-sm">${product.discount}</td>
        <td class="p-3 text-gray-700 text-sm">${product.stock}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.color).map((color) =>
          `<p>${color}</p>`
        )}</td>
        `;

        tableBody.append(tr);
      });
    } else {
      tableBody.innerHTML = `<tr><td class="p-3 text-gray-700 text-lg whitespace-nowrap">Not Found!</td></tr>`;
    }
  });
}
updateTable(1);

async function getAllProducts() {
  try {
    const res = await fetch(`${URL}api/admin/all_products`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
