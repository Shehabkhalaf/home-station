// const URL = 'http://127.0.0.1:8000/';
// let allCategories = [];
// let allProducts = [];

// const catSelect = document.getElementById('cat-select');
const tableBody = document.getElementById('product-body');

/**
 * Filtering
 */

// getAllCategories().then((data) => {
//   data.data.forEach((cat) => {
//     allCategories.push(cat);
//   });

//   catSelect.innerHTML = allCategories.map((cat) => {
//     return `<option value="${cat.id}">${cat.title}</option>`;
//   });
// });

// async function getAllCategories() {
//   try {
//     const res = await fetch(`${URL}api/admin/all_categories`);
//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }

async function fetchProductsData() {
  try {
    const response = await fetch('json/data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of an error
  }
}

fetchProductsData().then((productsData) => {
  updateTable(productsData);
});

function updateTable(productsData) {
  tableBody.innerHTML = '';

  productsData.forEach((product) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm">${product.id}</td>
        <td class="p-3 text-gray-700 text-sm"><img src="${product.imageDetalias[0]}"/></td>
        <td class="p-3 text-gray-700 text-sm">${product.productTitle}</td>
        <td class="p-3 text-gray-700 text-sm">${product.category}</td>
        <td class="p-3 text-gray-700 text-sm">${product.description}</td>
        <td class="p-3 text-gray-700 text-sm">${product.size.map((size) => `<p>${size}</p>`)}</td>
        <td class="p-3 text-gray-700 text-sm">${product.price.map((size) => `<p>${size}</p>`)}</td>
        <td class="p-3 text-gray-700 text-sm">${product.discount.map((size) => `<p>${size}</p>`)}</td>
      `;

    tableBody.appendChild(tr);
  });
}

// function updateTable() {
//   tableBody.innerHTML = '';

//   allProducts = data.data.filter((cat) => cat.category_id == catSelect.value);
//   const catName = allProducts[0].category_name;

//   if (productsData.length > 0) {
//     productsData.forEach((product) => {
//       const tr = document.createElement('tr');
//       tr.innerHTML = `
//         <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${product.id}</td>
//         <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${product.img}</td>
//         <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${product.productTitle}</td>
//         <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${catName}</td>
//         <td class="p-3 text-gray-700 text-sm">$100</td>
//         <td class="p-3 text-gray-700 text-sm">20%</td>
//         <td class="p-3 text-gray-700 text-sm">Active</td>
//         <td class="p-3 text-gray-700 text-sm">30*20</td>
//         <td class="p-3 text-gray-700 text-sm">80%</td>
//         `;

//       tableBody.append(tr);
//     });
//   } else {
//     tableBody.innerHTML = `<tr><td class="p-3 text-gray-700 text-lg whitespace-nowrap">Not Found!</td></tr>`;
//   }
// }
// updateTable();

// async function getAllProducts() {
//   try {
//     const res = await fetch(``);
//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }
