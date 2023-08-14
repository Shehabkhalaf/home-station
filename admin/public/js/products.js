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
    const catId = allProducts[0].category_id;

    if (allProducts[0].products.length > 0) {
      allProducts[0].products.forEach((product, i) => {
        const tr = document.createElement('tr');

        if (++i % 2 === 0) {
          tr.classList.add('bg-gray-50');
        }

        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm">${product.product_id}</td>
        <td class="p-3 text-gray-700 text-sm flex flex-wrap">${product.images
          .map(
            (src) => `<img src="${URL}${src}" alt="${product.product_name}"/>`
          )
          .join('')}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${
          product.product_name
        }</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${catName}</td>
        <td class="p-3 text-gray-700 text-sm">${product.description}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${JSON.parse(
          product.size
        )
          .map((size) => `<p>${size}</p>`)
          .join('-')}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.price)
          .map((price) => `<p>${price}</p>`)
          .join('-')}</td>
        <td class="p-3 text-gray-700 text-sm">${product.discount}</td>
        <td class="p-3 text-gray-700 text-sm">${product.stock}</td>
        <td class="p-3 text-gray-700 text-sm">${JSON.parse(product.color)
          .map((color) => `<p>${color}</p>`)
          .join('-')}</td>
          <td class="p-3 text-gray-700 text-sm"><button id="delete-product" data-id="${
            product.product_id
          }" data-category="${catId}" class="cursor-pointer"><i class="fa-solid fa-trash-can text-red-500"></i></button></td>
          <td class="p-3 text-gray-700 text-sm"><button id="edit-product" data-id="${
            product.product_id
          }" class="cursor-pointer"><i class="fa-regular fa-pen-to-square text-green-500"></i></button></td>
        `;

        tableBody.append(tr);
      });

      const deleteBtns = document.querySelectorAll('#delete-product');
      const deleteSuccessEle = document.getElementById('delete');
      deleteBtns.forEach((btn) => {
        const productId = btn.dataset.id;
        const catId = btn.dataset.category;
        btn.addEventListener('click', () => {
          deleteProduct(productId, deleteSuccessEle);
          updateTable(catId);
        });
      });

      const editBtns = document.querySelectorAll('#edit-product');
      editBtns.forEach((btn) => {
        const productId = btn.dataset.id;
        btn.addEventListener('click', () => {
          editProduct(productId);
        });
      });
    } else {
      tableBody.innerHTML = `<tr><td class="p-3 text-gray-700 text-lg whitespace-nowrap">Not Found!</td></tr>`;
    }
  });
}
updateTable(1);

function editProduct(productId) {
  let colorsArr = [];
  let imagesArr = [];
  let sizeArr = [];
  let priceArr = [];

  const editFormContainer = document.getElementById('edit-container');
  getSingleProduct(productId).then(({ data }) => {
    colorsArr = data.color;
    sizeArr = data.size;
    priceArr = data.price;

    let sizeAndPrice = [];
    sizeArr.forEach((size, i) => {
      sizeAndPrice.push(`${size}: ${priceArr[i]}EGP`);
    });
    console.log(data.image);
    data.image.forEach((img, i) => {
      const imageType = img.substring(img.lastIndexOf('.'));
      const blob = new Blob([img], { type: `image/${imageType}` });
      const imageFile = new File([blob], `image${i + 1}${imageType}`, {
        type: `image/${imageType.slice(1)}`,
      });
      imagesArr.push(imageFile);
    });
    console.log(imagesArr);

    editFormContainer.innerHTML = `
    <form id="product-form" enctype="multipart/form-data">
    <div class="flex flex-col">
      <label htmlFor="title" class="text-md mb-1">Product Name: </label>
      <input
        type="text"
        value="${data.product_name}"
        placeholder="Add The Product Name"
        id="title"
        class="w-[90%] sm:w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
      />
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="title-error-message"
      ></div>
    </div>

    <div class="flex flex-col my-2">
      <label htmlFor="description" class="text-md mb-1"
        >Product Description:
      </label>
      <textarea
        type="text"
        placeholder="Add The Product Description"
        id="description"
        class="w-[90%] sm:w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
      >${data.description}</textarea>
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="description-error-message"
      ></div>
    </div>

    <div class="flex flex-col my-2">
      <label htmlFor="category" class="text-md mb-1"
        >Select Product Category:
      </label>

      <select
        id="category"
        name="category"
        class="w-[90%] sm:w-[60%] outline-none cursor-pointer border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
      >
      <option value="${data.category_id}">${data.category_name}</option>
      ${allCategories
        .filter((cat) => cat.id !== data.category_id)
        .map((cat) => {
          return `<option value="${cat.id}">${cat.title}</option>`;
        })}
      </select>
    </div>

    <div class="flex flex-col my-2">
      <label htmlFor="discount" class="text-md mb-1">Discount:</label>
      <input
        type="number"
        value="${data.discount}"
        min="0"
        placeholder="Add Discount Percentage"
        id="discount"
        class="w-[90%] sm:w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
      />
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="discount-error-message"
      ></div>
    </div>

    <div class="flex flex-col my-2">
      <label htmlFor="stock" class="text-md mb-1">Stock:</label>
      <input
        type="number"
        value="${data.stock}"
        min="0"
        placeholder="Add Stock Quantity"
        id="stock"
        class="w-[90%] sm:w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
      />
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="stock-error-message"
      ></div>
    </div>

    <div class="flex flex-col my-2">
      <label htmlFor="size-price" class="text-md mb-1"
        >Size & Price: You can add more than one size & price</label
      >
      <div
        class="flex flex-col justify-between gap-3 sm:gap-0 sm:flex-row sm:justify-normal sm:space-x-2"
      >
        <input
          type="text"
          placeholder="Size"
          id="size"
          class="outline-none w-[90%] sm:w-auto border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
        />
        <input
          type="number"
          min="0"
          placeholder="Price"
          id="price"
          class="outline-none w-[90%] sm:w-auto border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
        />
        <div
          class="w-[90%] cursor-pointer sm:w-auto py-1 px-2 bg-main text-white rounded-md hover:opacity-[80%]"
          id="add-size-price-btn"
        >
          Add
        </div>
      </div>
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="size-price-error-message"
      ></div>
      <ul id="size-price-list" class="list-disc ml-6 mt-1">${sizeAndPrice
        .map((size, i) => {
          return `<li><span>${size}</span><i data-index="${i}" data-type="size" id="delete-list" class="fa-solid fa-trash-can text-red-500 ml-4 cursor-pointer"></i></li>`;
        })
        .join('')}</ul>
    </div>

    <div class="flex flex-col my-2">
      <label htmlFor="colors" class="text-md mb-1"
        >Colors: You can add more than one color</label
      >
      <div
        class="flex flex-col justify-between gap-3 sm:gap-0 sm:flex-row sm:justify-normal sm:space-x-2"
      >
        <input
          type="text"
          placeholder="Add a Color"
          id="colors"
          class="w-[90%] sm:w-auto outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
        />
        <div
          class="w-[90%] cursor-pointer sm:w-auto py-1 px-2 bg-main text-white rounded-md hover:opacity-[80%]"
          id="add-color-btn"
        >
          Add
        </div>
      </div>
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="colors-error-message"
      ></div>
      <ul id="colors-list" class="list-disc ml-6 mt-1">
      ${colorsArr
        .map((color) => {
          return `<li><span>${color}</span><i data-type="color" id="delete-list" class="fa-solid fa-trash-can text-red-500 ml-4 cursor-pointer"></i></li>`;
        })
        .join('')}
      </ul>
    </div>

    <div class="flex flex-col">
      <label htmlFor="images" class="text-md mb-1"
        >Images: You can add only 5 images</label
      >
      <input
        type="file"
        id="images"
        name="image"
        class="w-[90%] sm:w-[60%] cursor-pointer outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main"
        accept="image/*"
      />
      <div
        class="error-message text-red-500 text-sm mb-1"
        id="images-error-message"
      ></div>
      <ul id="images-list" class="list-disc ml-6 mt-1">
      ${imagesArr
        .map((img, i) => {
          return `<li><img src="${URL}${data.image[i]}" alt="product" class="w-[50px]"/><span>${img.name}</span><i data-index="${i}" data-type="img" id="delete-list" class="fa-solid fa-trash-can text-red-500 ml-4 cursor-pointer"></i></li>`;
        })
        .join('')}
      </ul>
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
    <div
      class="form-error-message text-red-500 text-sm mt-1"
      id="form-error-message"
    ></div>
  </form>
    `;

    const alldeleteBtns = document.querySelectorAll('#delete-list');
    alldeleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const btnType = btn.dataset.type;
        if (btnType === 'img') {
          deleteListItem(
            e.target.parentElement,
            imagesArr,
            imagesArr[btn.dataset.index]
          );
        } else if (btnType === 'color') {
          deleteListItem(
            e.target.parentElement,
            colorsArr,
            e.target.parentElement.children[0].innerHTML
          );
        } else {
          deleteListItem(
            e.target.parentElement,
            sizeArr,
            sizeArr[btn.dataset.index]
          );
          deleteListItem(null, priceArr, priceArr[btn.dataset.index]);
        }
      });
    });

    const imagesList = document.getElementById('images-list');
    const sizePriceList = document.getElementById('size-price-list');
    const colorsList = document.getElementById('colors-list');

    const titleInput = document.getElementById('title');
    const titleError = document.getElementById('title-error-message');

    const descriptionInput = document.getElementById('description');
    const descriptionError = document.getElementById(
      'description-error-message'
    );

    const categoryInput = document.getElementById('category');

    const discountInput = document.getElementById('discount');
    const discountError = document.getElementById('discount-error-message');

    const stockInput = document.getElementById('stock');
    const stockError = document.getElementById('stock-error-message');

    const priceError = document.getElementById('size-price-error-message');
    const colorsError = document.getElementById('colors-error-message');
    const imagesError = document.getElementById('images-error-message');

    const formSuccessMsg = document.getElementById('success-message');
    const formErrorMsg = document.getElementById('form-error-message');

    // Add event listener for adding colors
    const colorsInput = document.getElementById('add-color-btn');
    colorsInput.addEventListener('click', addColors);

    // Add event listener for form submission
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', (e) => handleSubmit(e, productId));

    // Add event listener for adding size & price
    const addSizePriceBtn = document.getElementById('add-size-price-btn');
    addSizePriceBtn.addEventListener('click', addSizeAndPrice);

    // Add event listener for adding images
    const imagesInput = document.getElementById('images');
    imagesInput.addEventListener('change', addImages);

    function handleSubmit(e, productId) {
      e.preventDefault();

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
          id: productId,
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

        addProduct(product, formSuccessMsg, formErrorMsg);
      }
    }

    // Function to handle adding size & price
    function addSizeAndPrice() {
      const sizeInput = document.getElementById('size');
      const priceInput = document.getElementById('price');
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

      listItem.textContent = `${sizeValue}: ${priceValue}EGP`;
      listItem.appendChild(deleteBtn);
      sizePriceList.appendChild(listItem);

      sizeArr.push(sizeValue);
      priceArr.push(priceValue);
      deleteBtn.addEventListener('click', () => {
        deleteListItem(listItem, sizeArr, sizeValue);
        deleteListItem(null, priceArr, priceValue);
      });

      sizeInput.value = '';
      priceInput.value = '';
    }

    // Function to handle adding images
    function addImages() {
      const imagesInput = document.getElementById('images');
      const errorMessage = document.getElementById('images-error-message');

      const images = Array.from(imagesInput.files);

      if (imagesArr.length === 5) {
        errorMessage.textContent = 'You can only add 5 images.';
        setTimeout(() => {
          errorMessage.textContent = '';
        }, 4000);

        imagesInput.value = null;
        return;
      }

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

          deleteBtn.addEventListener('click', () =>
            deleteListItem(listItem, imagesArr, image)
          );
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

    function resetForm() {
      titleInput.value = '';
      discountInput.value = '';
      descriptionInput.value = '';
      categoryInput.value = '';
      stockInput.value = '';
      colorsArr = [];
      imagesArr = [];
      sizeArr = [];
      priceArr = [];
      colorsList.innerHTML = '';
      sizePriceList.innerHTML = '';
      imagesList.innerHTML = '';
    }

    async function addProduct(product, formSuccessMsg, formErrorMsg) {
      try {
        const formData = new FormData();

        formData.append('id', product.id);
        formData.append('category_id', product.category_id);
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('color', JSON.stringify(product.color));
        formData.append('discount', product.discount);
        formData.append('stock', product.stock);
        formData.append('size', JSON.stringify(product.size));
        formData.append('price', JSON.stringify(product.price));

        product.image.forEach((image, i) => {
          formData.append(`image${i + 1}`, image);
        });

        const res = await fetch(`${URL}/api/admin/update_product`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.status === 201) {
          formSuccessMsg.innerHTML = 'Product has been Updated successfully!';
          setTimeout(() => {
            formSuccessMsg.innerHTML = '';
          }, 4000);

          resetForm();
          setTimeout(() => {
            editFormContainer.innerHTML = '';
            updateTable(product.category_id);
          }, 2000);
        } else {
          formErrorMsg.innerHTML = 'Sorry, Error Happened!';
          setTimeout(() => {
            formErrorMsg.innerHTML = '';
          }, 4000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
}

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

async function getSingleProduct(id) {
  try {
    const res = await fetch(`${URL}/api/admin/show_product/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
