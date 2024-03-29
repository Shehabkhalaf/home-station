import {
  setData as setData,
  getData as getData,
  createProduct,
  setDataLocal,
} from './localStorage.js';
const URL = 'http://127.0.0.1:8000';
let dataProducts = [];

// Scroll Down
let btnn = document.querySelector('.scroll');
window.onscroll = function () {
  if (window.scrollY >= 400) {
    btnn.style.display = 'block';
  } else {
    btnn.style.display = 'none';
  }
  btnn.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
};

// GET Elements
let products = document.getElementById('products');
let detailsContainer = document.getElementById('details-container');
let sliderContainerParent = document.getElementById('slider-container-parent');
let count = document.getElementById('count');
let cartIcon = document.getElementById('cartIcon');
let checkOutButton = document.getElementById('checkOut');
let footerTable = document.querySelectorAll('.footerNone');

// Storage Data
let listItems = getData();

// Create Counter
let counter = listItems.length;

// Counter Cart
count.innerHTML = counter;

fetchAllProducts().then((data) => {
  dataProducts = data.data;

  // Add all Products
  function addProductsAll() {
    dataProducts.forEach((product) => {
      addProduct(product);
      let btnDetails = document.querySelectorAll('#btn-details');
      btnDetails.forEach((button) => {
        button.addEventListener('click', showDetails);
      });
      let cards = document.querySelectorAll('#card');
      cards.forEach((card) => {
        card.addEventListener('click', clickCard);
      });
      // Add To Card
      let addCard = document.querySelectorAll('#addCard');
      addCard.forEach((element) => {
        element.addEventListener('click', addCartOut);
      });

      // Filter Products
      const filtersContainer = document.getElementById('filter-container');
      getAllCategories().then((data) => {
        filtersContainer.innerHTML = `<li class="active typesProduct" id="all">All</li>
        ${data.data
          .map((cat) => {
            return `<li class="typesProduct" id="${cat.id}">${cat.title}</li>`;
          })
          .join('')}`;
        const typeProducts = document.querySelectorAll('.typesProduct');
        typeProducts.forEach((element) => {
          element.addEventListener('click', (item) => {
            if (!element.classList.contains('active')) {
              [...products.children].forEach((e) => e.remove());
              let id = element.getAttribute('id');
              if (id === 'all') {
                addProductsAll();
              } else {
                dataProducts.forEach((product) => {
                  if (product.category_id === +id) {
                    addProduct(product);
                    let btnDetails = document.querySelectorAll('#btn-details');
                    btnDetails.forEach((button) => {
                      button.addEventListener('click', showDetails);
                    });
                    let cards = document.querySelectorAll('#card');
                    cards.forEach((card) => {
                      card.addEventListener('click', clickCard);
                    });
                    // Add To Card
                    let addCard = document.querySelectorAll('#addCard');
                    addCard.forEach((element) => {
                      element.addEventListener('click', addCartOut);
                    });
                  } else {
                    products.innerHTML = `<img src="./images/coming-soon.jpg" class="w-50 m-auto" alt="Comming Soon"/>`;
                  }
                });
              }
              typeProducts.forEach((e) => e.classList.remove('active'));
              element.classList.add('active');
            }
          });
        });
      });
    });
  }

  // Add Product
  function addProduct(product) {
    let priceAfterDiscount =
      product.price[0] - product.price[0] * (product.discount / 100);
    // create div
    let div = document.createElement('div');
    // Add class
    div.setAttribute('class', 'col-lg-4 col-md-6 col-sm-12');
    div.setAttribute('category', product.category_name);
    div.setAttribute('data-id', product.product_id);
    //Add inner html
    div.innerHTML = `
                      <div class="box">
                          <div class="card overflow-hidden">
                              <div class="image overflow-hidden" id="card" data-id="${
                                product.product_id
                              }">
                                  <img src="${URL}${
      product.image[0]
    }" class="card-img-top">
                                  ${
                                    product.discount !== 0
                                      ? `<span class="discount">${product.discount}%</span>`
                                      : ''
                                  }
                                  ${
                                    product.stock === 0
                                      ? `<span class="stock">Out Of stock</span>`
                                      : ''
                                  }
                              </div>
                              <div class="card-body">
                                  <div class="title mb-4 d-flex justify-content-between align-items-center">
                                      <h5>${product.product_name}</h5>
                                      ${
                                        product.discount > 0
                                          ? `<p class="actual-price">${product.price[0]}EGP</p>`
                                          : ''
                                      }
                                  </div>
                                  <div class="buttons d-flex justify-content-start align-items-center">
                                      <button 
                                      type="button"  
                                      id="btn-details" 
                                      data-id="${product.product_id}" 
                                      class="btn btn-primary buttonStyle me-3"
                                      data-bs-toggle="offcanvas" 
                                      data-bs-target="#offcanvasBottom" 
                                      aria-controls="offcanvasBottom">
                                        <span class="me-1">EGP</span>${priceAfterDiscount}
                                      </button>
                                      <button type="button" id="addCard" data-id="${
                                        product.product_id
                                      }" class="btn  btn-primary buttonStyle"><i class="fa-solid fa-cart-plus me-2"></i>Add to Card 
                                      </button>
                                      </div>
                                      <div id="success" class="text-center"></div>
                              </div>
                          </div>
                      </div>
          `;
    products.appendChild(div);
  }

  // Show Details
  function showDetails() {
    let buttonId = +this.getAttribute('data-id');
    dataProducts.forEach((product) => {
      let priceAfterDiscount =
        product.price[0] - product.price[0] * (product.discount / 100);
      if (+product.product_id === buttonId) {
        sliderContainerParent.innerHTML += `
                      <div class="slider-container" id="slider-container">
                      ${product.image
                        .map((img) => `<img src="${URL}${img}" alt="product"/>`)
                        .join(' ')}
                      </div>
                      <div class="slider-controls">
                      <span id="indicators" class="indicators">
                      </span>
                      </div>
                      `;
        detailsContainer.innerHTML += `
                      <button class="buttonStyleBack" id="back-btnn"><i class="fa-solid fa-arrow-left"></i> Back To All
                          Products</button>
                          <h2 class="mt-5">${product.product_name}</h2>
                          ${
                            product.stock === 0
                              ? `<span class="stock">Out Of stock</span>`
                              : ''
                          }
                      <p class="price" id="discountP">${priceAfterDiscount}EGP                                 
                      ${
                        product.discount > 0
                          ? `<del id="priceDel">${product.price[0]}EGP</del>`
                          : ''
                      }</p>
                      <div class="description">${product.description}</div>
                      <div class="form">
                          <div class="row">
                              <div class="col-lg-6 col-md-12">
                                  <div class="qty">
                                      <label for="">Quantity</label>
                                      <input type="number" min="1" id="quantity" value="1" max="${
                                        product.stock
                                      }">
                                  </div>
                              </div>
                              <div class="col-lg-6 col-md-12">
                                  <div class="select">
                                      <label for="">size</label>
                                      <select class="form-select" id="selected" aria-label="Default select example">
                                          ${product.size
                                            .map(
                                              (
                                                sizetype,
                                                index
                                              ) => `<option value="${index}">${sizetype}</option>
                                          `
                                            )
                                            .join(' ')}
                                      </select>
                                  </div>
                              </div>
                          </div>
                          <div class="color mt-2 d-flex">
                          <span>color:</span>
                          <span id="chooseColor">${product.color[0]}</span>
                          </div>
                           <ul class="mt-2 colors d-flex align-items-center">
                          ${product.color
                            .map(
                              (color, index) => ` <li ${
                                index === 0 ? `class="active"` : ''
                              } id="${color.toLowerCase()}" style="background-color:${color.toLowerCase()}" ></li>
                                          `
                            )
                            .join('')}
                          </ul>
                      </div>
                      <button class="buttonStyle add-card mt-5" id="addCardd">Add To Cart <i class="fa-solid fa-cart-shopping"></i></button>
                      <div id="success" class="text-center"></div>
                      <div>
                      <img src="images/icon.avif" class="img-size img-fluid">
                      </div>
                      `;
        // Add Slider
        slider();
        // Close Page
        let btnClose = document.getElementById('btn-close');
        let btnBack = document.getElementById('back-btnn');
        btnClose.addEventListener('click', () => {
          detailsContainer.innerHTML = '';
          sliderContainerParent.innerHTML = '';
        });

        btnBack.addEventListener('click', () => {
          btnClose.click();
        });

        // Change Price
        let quantity = document.getElementById('quantity');
        quantity.addEventListener('change', (number) => {
          if (number.target.value > 0) {
            priceAfterDiscount =
              product.price[0] - product.price[0] * (product.discount / 100);
            document.getElementById('discountP').innerHTML =
              'EGP ' +
              +number.target.value * priceAfterDiscount +
              `<del id="priceDel">EGP ${
                +number.target.value * product.price[0]
              }</del>`;
          }
        });

        let selected = document.getElementById('selected');
        selected.addEventListener('change', (select) => {
          priceAfterDiscount =
            product.price[+selected.value] -
            product.price[+selected.value] * (product.discount / 100);
          document.getElementById('discountP').innerHTML =
            'EGP ' +
            +quantity.value * priceAfterDiscount +
            `<del id="priceDel">EGP ${
              +quantity.value * product.price[+selected.value]
            }</del>`;
        });

        // Choose Colors
        let itemsColor = document.querySelectorAll('ul.colors li');
        let colorChoose = 'white'; // Defualt Color
        itemsColor.forEach((itemColor) => {
          itemColor.addEventListener('click', () => {
            itemsColor.forEach((item) => item.classList.remove('active'));
            itemColor.classList.add('active');
            document.getElementById('chooseColor').innerHTML = itemColor.id;
            colorChoose = itemColor.id;
          });
        });

        // Add To Card
        let addCardd = document.getElementById('addCardd');
        addCardd.addEventListener('click', () => {
          if (product.stock === 0) {
            swal(
              'This Product Is Out Of Stock',
              'It will be back soon.',
              'error'
            );
            return;
          }
          addToCard(
            URL + product.image[0],
            product.product_name,
            product.size[+selected.value],
            priceAfterDiscount,
            +quantity.value,
            colorChoose,
            product.product_id,
            product.stock
          );
          document.getElementById('success').innerHTML = 'Product Added';
          setTimeout(() => {
            document.getElementById('success').innerHTML = '';
          }, 5000);
        });
      }
    });
  }

  // ADD To Cart
  function addToCard(
    img,
    title,
    size,
    price,
    quantity,
    color = 'white',
    product_id,
    stock
  ) {
    let id =
      listItems.length === 0 ? 0 : listItems[listItems.length - 1].id + 1;
    // Create Object Task Store Text and Place
    const newPrduct = {
      img,
      title,
      size,
      price,
      quantity,
      id,
      color,
      product_id,
      stock,
    };
    // Call Function Create Task
    createProduct(newPrduct);
    // Add Object In Array CardsData
    listItems = getData();
    listItems.push(newPrduct);
    // Add Object In Local Storage
    setDataLocal(listItems);
    count.innerHTML = listItems.length;

    swal({
      title: 'successfully added',
      icon: 'success',
      button: 'Ok',
    });
  }

  // Click Card
  function clickCard() {
    let btnDetails = document.querySelectorAll('#btn-details');
    btnDetails.forEach((button) => {
      if (+this.getAttribute('data-id') === +button.getAttribute('data-id')) {
        button.click();
      }
    });
  }

  // Add ELement Out Without Open Datelis
  function addCartOut() {
    let item = dataProducts.filter(
      (e) => +e.product_id === +this.getAttribute('data-id')
    );
    let priceAfterDiscount =
      item[0].price[0] - item[0].price[0] * (item[0].discount / 100);

    if (item[0].stock === 0) {
      swal('This Product Is Out Of Stock', 'It will be back soon.', 'error');
      return;
    }

    addToCard(
      URL + item[0].image[0],
      item[0].product_name,
      item[0].size[0],
      priceAfterDiscount,
      1,
      'white',
      item[0].product_id,
      item[0].stock
    );

    document.getElementById('success').innerHTML = 'Product Added';
    setTimeout(() => {
      document.getElementById('success').innerHTML = '';
    }, 5000);

    swal({
      title: 'successfully added',
      icon: 'success',
      button: 'Ok',
    });
  }

  addProductsAll();

  // Slider
  function slider() {
    // Get slider items
    let sliderImages = Array.from(
      document.querySelectorAll('.slider-container img')
    );

    // Get Number of Slides
    let slidesCount = sliderImages.length;

    // Set Current slide
    let currentSlide = 1;

    // Create the Main Ul Element
    let PaginationElement = document.createElement('ul');

    // Set ID on Create Ul Element
    PaginationElement.setAttribute('id', 'pagination-ul');

    // Create List Items Based On Slides Count
    for (let i = 1; i <= slidesCount; i++) {
      // Create The LI
      let PaginationItem = document.createElement('li');

      // Set Custom Attribute
      PaginationItem.setAttribute('data-index', i);

      // Append items to the Main Ul list
      PaginationElement.appendChild(PaginationItem);
    }
    // Add the cteated Ul Element to the Page
    document.getElementById('indicators').appendChild(PaginationElement);

    // Get The New Created Ul
    let PaginationUl = document.getElementById('pagination-ul');

    // Loop Through All Bullets Items
    for (let i = 0; i < PaginationUl.children.length; i++) {
      Array.from(PaginationUl.children)[i].onclick = function () {
        currentSlide = this.getAttribute('data-index');
        theChecker();
      };
    }

    // Next slide Function

    function nextSlide() {
      currentSlide++;
    }

    // previous slide Function

    function prevSlide() {
      currentSlide--;
      theChecker();
    }
    // Create the Checker Function
    function theChecker() {
      // Remove All Active Classes
      removeAllActive();

      // Set Active Class On Current Slide
      sliderImages[currentSlide - 1].classList.add('active');

      // Set Active Class on Current Pagination item
      PaginationUl.children[currentSlide - 1].classList.add('active');
    }

    // Remove All Active Classes From Images and Pagination Bullets
    function removeAllActive() {
      // loop Through images
      sliderImages.forEach((img) => img.classList.remove('active'));

      // loop Through Pagination Bullets
      Array.from(PaginationUl.children).forEach((item) =>
        item.classList.remove('active')
      );
    }

    // Trigger The Checker Function
    theChecker();
  }
});

async function fetchAllProducts() {
  try {
    const res = await fetch(`${URL}/api/user/products`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getAllCategories() {
  try {
    const res = await fetch(`${URL}/api/user/all_categories`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
