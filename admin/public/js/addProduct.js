const URL = 'http://127.0.0.1:8000/';
let colorsArr = [];
let imagesArr = [];
let sizeArr = [];
let priceArr = [];

// Add event listener for adding colors
const colorsInput = document.getElementById('add-color-btn');
colorsInput.addEventListener('click', addColors);

// Add event listener for form submission
const catForm = document.getElementById('cat-form');
catForm.addEventListener('submit', handleSubmit);

// Add event listener for adding size & price
const addSizePriceBtn = document.getElementById('add-size-price-btn');
addSizePriceBtn.addEventListener('click', addSizeAndPrice);

// Add event listener for adding images
const imagesInput = document.getElementById('images');
imagesInput.addEventListener('change', addImages);

function handleSubmit(e) {
  e.preventDefault();

  // Validation and submission logic here

  // Example: Checking if the title is empty
  const titleInput = document.getElementById('title');
  const titleValue = titleInput.value.trim();
  if (titleValue === '') {
    showError(titleInput, 'Title is required.');
  } else {
    clearError(titleInput);
  }

  // Add similar validation logic for other fields
}

// Function to handle adding size & price
function addSizeAndPrice() {
  const sizeInput = document.getElementById('size');
  const priceInput = document.getElementById('price');
  const sizePriceList = document.getElementById('size-price-list');
  const errorMessage = document.getElementById('size-price-error-message');

  const sizeValue = sizeInput.value.trim();
  const priceValue = priceInput.value.trim();

  if (sizeValue === '' || priceValue === '') {
    errorMessage.textContent = 'Both size and price are required.';
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 4000);
    return;
  }

  const listItem = document.createElement('li');
  const deleteBtn = document.createElement('button');
  deleteBtn.id = 'delete-list';
  deleteBtn.classList.add('ml-4');
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can text-red-500"></i>`;

  listItem.textContent = `${sizeValue}: $${priceValue}`;
  listItem.appendChild(deleteBtn);
  sizePriceList.appendChild(listItem);

  sizeArr.push(sizeValue);
  priceArr.push(priceValue);
  deleteBtn.addEventListener('click', () => deleteListItem(listItem));

  sizeInput.value = '';
  priceInput.value = '';
}

// Function to handle adding images
function addImages() {
  const imagesInput = document.getElementById('images');
  const imagesList = document.getElementById('images-list');
  const errorMessage = document.getElementById('images-error-message');

  const images = Array.from(imagesInput.files);
  imagesArr.push(images[0]);

  images.forEach((image) => {
    if (
      image.type === 'image/png' ||
      image.type === 'image/svg' ||
      image.type === 'image/jpeg' ||
      image.type === 'image/gif' ||
      image.type === 'image/tiff' ||
      image.type === 'image/webp'
    ) {
      const listItem = document.createElement('li');
      const deleteBtn = document.createElement('button');
      deleteBtn.id = 'delete-list';
      deleteBtn.classList.add('ml-4');
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can text-red-500"></i>`;

      listItem.textContent = image.name;
      listItem.appendChild(deleteBtn);
      imagesList.appendChild(listItem);

      deleteBtn.addEventListener('click', () => deleteListItem(listItem));
    } else {
      errorMessage.textContent = 'Please Enter Valid Image Type.';
      setTimeout(() => {
        errorMessage.textContent = '';
      }, 4000);
    }
  });

  imagesInput.value = null;
}

// Function to handle adding colors
function addColors() {
  const colorsInput = document.getElementById('colors');
  const colorsList = document.getElementById('colors-list');
  const errorMessage = document.getElementById('colors-error-message');

  const colorValue = colorsInput.value.trim();

  if (colorValue === '') {
    errorMessage.textContent = 'Please add one or more colors.';
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 4000);
    return;
  } else if (!isNaN(parseInt(colorValue))) {
    errorMessage.textContent = 'Colors must be a text.';
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 4000);
    return;
  }

  const listItem = document.createElement('li');
  const deleteBtn = document.createElement('button');
  deleteBtn.id = 'delete-list';
  deleteBtn.classList.add('ml-4');
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can text-red-500"></i>`;

  listItem.textContent = `${colorValue}`;
  listItem.appendChild(deleteBtn);
  colorsList.appendChild(listItem);

  colorsArr.push(colorValue);
  deleteBtn.addEventListener('click', () =>
    deleteListItem(listItem, colorsArr, colorValue)
  );

  colorsInput.value = '';
}

function deleteListItem(target, targetArr, value) {
  if (target) {
    target.remove();
  }

  let index = targetArr.indexof(value);
  targetArr = targetArr.filter((ele) => ele != value);

  // console.log(targetArr);
  // console.log(colorsArr);
}

async function addProduct() {
  try {
    const res = await fetch(`${URL}api/admin/add_product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        category_id: '1',
        title: 'sheat pillow',
        description: 'undefined',
      }),
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

addProduct();
