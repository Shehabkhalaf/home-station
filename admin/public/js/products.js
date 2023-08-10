const URL = 'http://127.0.0.1:8000';
let allCategories = [];

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
    const res = await fetch(`${URL}/api/admin/all_categories`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function updateTable(id) {
  tableBody.innerHTML = `<span class="loader"></span>`;

  getAllProducts().then((data) => {
    tableBody.innerHTML = '';
    let allProducts = [];

    allProducts = data.data.filter(
      (product) => product.category_id === parseInt(id)
    );
    const catName = allProducts[0].category_name;

    if (allProducts[0].products.length > 0) {
      allProducts[0].products.forEach((product) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm">${product.product_id}</td>
        <td class="p-3 text-gray-700 text-sm flex flex-wrap">${product.images.map(
          (src) => `<img src="${URL}${src}" alt="${product.product_name}"/>`
        )}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${
          product.product_name
        }</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${catName}</td>
        <td class="p-3 text-gray-700 text-sm">${product.description}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.size).map(
          (size) => `<p>${size}</p>`
        )}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.price).map(
          (price) => `<p>${price}</p>`
        )}</td>
        <td class="p-3 text-gray-700 text-sm">${product.discount}</td>
        <td class="p-3 text-gray-700 text-sm">${product.stock}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.color).map(
          (color) => `<p>${color}</p>`
        )}</td>
          <td class="p-3 text-gray-700 text-sm"><button id="delete-product" data-id="${
            product.product_id
          }" class="cursor-pointer"><i class="fa-solid fa-trash-can text-red-500"></i></button></td>
        `;

        tableBody.append(tr);
      });

      const deleteBtns = document.querySelectorAll('#delete-product');
      const deleteSuccessEle = document.getElementById('delete');
      deleteBtns.forEach((btn) => {
        const productId = btn.dataset.id;
        btn.addEventListener('click', () => {
          deleteProduct(productId, deleteSuccessEle);
          updateTable();
        });
      });
    } else {
      tableBody.innerHTML = `<tr><td class="p-3 text-gray-700 text-lg whitespace-nowrap">Not Found!</td></tr>`;
    }
  });
}
updateTable(1);

async function getAllProducts() {
  try {
    const res = await fetch(`${URL}/api/admin/all_products`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function deleteProduct(id, deleteMsgEle) {
  try {
    const res = await fetch(`${URL}/api/admin/delete_product/${id}`);

    const resData = await res.json();

    if (resData.status === 200) {
      deleteMsgEle.innerHTML = 'Message has been deleted successfully!';
      setTimeout(() => {
        deleteMsgEle.innerHTML = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}
