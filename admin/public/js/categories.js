const URL = 'http://127.0.0.1:8000/';
const formContainer = document.getElementById('form__container');
let allCategories = [];

/**
 * Adding Table Data
 */
const tableBody = document.getElementById('cat-body');

function updateTable() {
  tableBody.innerHTML = `<span class="loader"></span>`;
  getAllCategories().then((data) => {
    allCategories = data.data;

    if (allCategories.count === 0) {
      tableBody.innerHTML = `<tr><td class="text-lg whitespace-nowrap">Not Found!</td></tr>`;
    } else {
      tableBody.innerHTML = '';
      data.data.forEach((cat) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="p-3 text-gray-700 whitespace-nowrap">${cat.id}</td>
        <td class="p-3 text-gray-700 whitespace-nowrap">${cat.title}</td>
        <td class="p-3 text-gray-700 whitespace-nowrap">
          ${cat.status}
        </td>
        `;

        tableBody.append(tr);
      });
    }
  });
}
updateTable();

async function getAllCategories() {
  try {
    const res = await fetch(`${URL}api/admin/all_categories`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Handle Categories Add - Update Btns
 */
const addCatBtn = document.getElementById('add-category');
const updateCatBtn = document.getElementById('update-category');
const catBtns = document.querySelectorAll('.cat__btn');

addCatBtn.addEventListener('click', handleAddBtn);
updateCatBtn.addEventListener('click', handleUpdateBtn);

function handleAddBtn() {
  removeAllActive(catBtns);
  addCatBtn.classList.add('active');

  const formElements = `
        <form id="cat-form">
          <div class="flex flex-col">
            <label htmlFor="cat-name" class="text-md mb-1">Category Name: </label>
            <input
              type="text"
              placeholder="Add The Category Name"
              id="cat-name"
              class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
            />
          </div>
          <div
            class="error-message text-red-500 text-sm mb-1"
            id="error-message"
          ></div>
          <div class="flex flex-col my-3">
            <label htmlFor="cat-status" class="text-md mb-1">Status: </label>

            <select
              id="cat-status"
              name="select"
              class="w-[60%] outline-none cursor-pointer border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
            >
              <option value="active">Active</option>
              <option value="not active">Not Active</option>
            </select>
          </div>
          <button
            class="mt-1 py-2 px-4 hover:opacity-[80%] duration-100 ease-in bg-main rounded-md text-white"
            type="submit"
            id="cat-btn"
          >
            Submit
          </button>
          <div
          class="success-message text-green-500 text-sm mt-1"
          id="success-message"
        ></div>
        </form>
  `;
  formContainer.innerHTML = formElements;

  const catNameInput = document.getElementById('cat-name');
  const catStatusSelect = document.getElementById('cat-status');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  const catSubmitBtn = document.getElementById('cat-btn');
  const catForm = document.getElementById('cat-form');

  catForm.addEventListener('submit', (e) => handleAddSubmit(e));

  function handleAddSubmit(e) {
    e.preventDefault();

    const catName = catNameInput.value;
    const catStatus = catStatusSelect.value;
    const catData = { title: catName, status: catStatus };

    if (catName === '') {
      errorMessage.textContent = 'Category name cannot be empty.';
      setTimeout(() => {
        errorMessage.textContent = '';
      }, 4000);
      return;
    }

    AddCategory(catData, errorMessage, successMessage, catSubmitBtn);
    catNameInput.value = '';
  }
}
handleAddBtn();

function handleUpdateBtn() {
  removeAllActive(catBtns);
  updateCatBtn.classList.add('active');

  const formElements = `
        <form id="cat-form">
          <div class="flex flex-col">
            <label htmlFor="cat-select" class="text-md mb-1">Select Category: </label>

            <select
              id="cat-select"
              name="category"
              class="w-[60%] outline-none cursor-pointer border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
            >
            ${
              allCategories.count !== 0 &&
              allCategories.map((cat) => {
                return `<option value="${cat.id}">${cat.title}</option>`;
              })
            }
            </select>
          </div>
          <div class="flex flex-col my-3">
            <label htmlFor="cat-status" class="text-md mb-1">Status: </label>

            <select
              id="cat-status"
              name="select"
              class="w-[60%] outline-none cursor-pointer border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
            >
              <option value="active">Active</option>
              <option value="not active">Not Active</option>
            </select>
          </div>
          <button
            class="mt-1 py-2 px-4 hover:opacity-[80%] duration-100 ease-in bg-main rounded-md text-white"
            type="submit"
            id="cat-btn"
          >
            Submit
          </button>
          <div class="success-message text-green-500 text-sm mt-1"
          id="success-message"
        ></div>
        </form>
  `;
  formContainer.innerHTML = formElements;

  const catNameSelect = document.getElementById('cat-select');
  const catStatusSelect = document.getElementById('cat-status');
  const successMessage = document.getElementById('success-message');
  const catSubmitBtn = document.getElementById('cat-btn');
  const catForm = document.getElementById('cat-form');

  catForm.addEventListener('submit', (e) => handleUpdateSubmit(e));

  function handleUpdateSubmit(e) {
    e.preventDefault();

    const catId = catNameSelect.value;
    const catStatus = catStatusSelect.value;
    const catData = { status: catStatus };

    UpdateCategory(catData, catId, successMessage, catSubmitBtn);
  }
}

function removeAllActive(target) {
  target.forEach((button) => {
    button.classList.remove('active');
  });
}

/**
 * Handle Add Form
 */
async function AddCategory(data, errorMessageELe, successMessage, submitBtn) {
  try {
    submitBtn.innerHTML = 'Submitting...';
    submitBtn.disabled = true;

    const res = await fetch(`${URL}api/admin/add_category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    submitBtn.innerHTML = 'Submit';
    submitBtn.disabled = false;

    const resData = await res.json();

    if (resData.status !== 201) {
      errorMessageELe.textContent = resData.data['title'][0];
      setTimeout(() => {
        errorMessageELe.textContent = '';
      }, 4000);
    } else {
      successMessage.textContent = 'Category has been Added.';
      updateTable();
      setTimeout(() => {
        successMessage.textContent = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Handle Update Form
 */
async function UpdateCategory(data, id, successMessage, submitBtn) {
  try {
    submitBtn.innerHTML = 'Submitting...';
    submitBtn.disabled = true;

    const res = await fetch(`${URL}api/admin/update_category/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    submitBtn.innerHTML = 'Submit';
    submitBtn.disabled = false;

    const resData = await res.json();

    if (resData.status === 201) {
      successMessage.innerHTML = 'Category has been Updated.';
      updateTable();
      setTimeout(() => {
        successMessage.innerHTML = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}
