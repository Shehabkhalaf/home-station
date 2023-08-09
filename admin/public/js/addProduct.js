const URL = 'http://127.0.0.1:8000/';
let colorsArr = [];
let imagesArr = [];
let sizeArr = [];
let priceArr = [];

// Add event listener for adding colors
const colorsInput = document.getElementById('add-color-btn');
colorsInput.addEventListener('click', addColors);

// Add event listener for form submission
const productForm = document.getElementById('product-form');
productForm.addEventListener('submit', handleSubmit);

// Add event listener for adding size & price
const addSizePriceBtn = document.getElementById('add-size-price-btn');
addSizePriceBtn.addEventListener('click', addSizeAndPrice);

// Add event listener for adding images
const imagesInput = document.getElementById('images');
imagesInput.addEventListener('change', addImages);

function handleSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById('title');
  const titleError = document.getElementById('title-error-message');

  const descriptionInput = document.getElementById('description');
  const descriptionError = document.getElementById('description-error-message');

  const categoryInput = document.getElementById('category');

  const discountInput = document.getElementById('discount');
  const discountError = document.getElementById('discount-error-message');

  const stockInput = document.getElementById('stock');
  const stockError = document.getElementById('stock-error-message');

  const priceError = document.getElementById('size-price-error-message');
  const colorsError = document.getElementById('colors-error-message');
  const imagesError = document.getElementById('images-error-message');

  const titleValue = titleInput.value.trim();
  const descriptionValue = descriptionInput.value.trim();
  const categoryValue = categoryInput.value;
  const discountValue = discountInput.value;
  const stockValue = stockInput.value;

  // Check for validation
  let isValid = true;

  if (titleValue === '') {
    titleError.textContent = 'This field is required.';
    setTimeout(() => {
      titleError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (descriptionValue === '') {
    descriptionError.textContent = 'This field is required.';
    setTimeout(() => {
      descriptionError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (discountValue === '') {
    discountError.textContent = 'This field is required.';
    setTimeout(() => {
      discountError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (stockValue === '') {
    stockError.textContent = 'This field is required.';
    setTimeout(() => {
      stockError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (sizeArr.length === 0 || priceArr.length === 0) {
    priceError.textContent = 'Both size and price are required.';
    setTimeout(() => {
      priceError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (colorsArr.length === 0) {
    colorsError.textContent = 'Please add one or more colors.';
    setTimeout(() => {
      colorsError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (imagesArr.length === 0) {
    imagesError.textContent = 'Please add one or more Image.';
    setTimeout(() => {
      imagesError.textContent = '';
    }, 4000);
    isValid = false;
  }

  if (isValid) {
    const product = {
      category_id: categoryValue,
      title: titleValue,
      description: descriptionValue,
      color: colorsArr,
      discount: discountValue,
      stock: stockValue,
      image: imagesArr,
      size: sizeArr,
      price: priceArr,
    };

    console.log({ ...product });

    addProduct(product);
  }
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

  images.forEach((image) => {
    if (
      image.type === 'image/png' ||
      image.type === 'image/svg' ||
      image.type === 'image/jpeg' ||
      image.type === 'image/gif' ||
      image.type === 'image/tiff' ||
      image.type === 'image/webp'
    ) {
      imagesArr.push(image);

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

  let index = targetArr.indexOf(value);
  if (index !== -1) {
    targetArr.splice(index, 1);
  }
}

async function addProduct(product) {
  console.log({ ...product });
  try {
    const formData = new FormData();

    formData.append('category_id', product.category_id);
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('color', product.color);
    formData.append('discount', product.discount);
    formData.append('stock', product.stock);
    formData.append('size', product.size);
    formData.append('price', product.price);

    product.image.forEach((image) => {
      formData.append('image', image);
    });

    const res = await fetch(`${URL}api/admin/add_product`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Add CAtegory Select Valuse Dynamically
 */
const categorySelect = document.getElementById('category');
let allCategories = [];
getAllCategories().then((data) => {
  data.data.forEach((cat) => {
    allCategories.push(cat);
  });

  categorySelect.innerHTML = allCategories.map((cat) => {
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
