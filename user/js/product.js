import { setData as setData, getData as getData , setDataLocal} from "./localStorage.js";

// GET Elements
let products = document.getElementById("products");
let detailsContainer = document.getElementById("details-container");
let sliderContainerParent = document.getElementById("slider-container-parent");
let count = document.getElementById("count");
let cartIcon = document.getElementById("cartIcon");


// Storage Data
let listItems =getData();

// Create Counter
// let counter = listItems.length;

// count.innerHTML = counter;

// Call Data From File Json
let dataProducts = await fetch("json/data.json").then(
    (result) => result.json()
).then(
    (data) => {
        return data;
    }
);

// Add all Products 
function addProductsAll() {
    dataProducts.forEach((product) => {
        addProduct(product);
        // Show Details
        let btnDetails = document.querySelectorAll("#btn-details");
        btnDetails.forEach(button => {
            button.addEventListener("click", showDetails)
        })
        // Add To Card
        let addCard = document.querySelectorAll("#addCard");
        addCard.forEach(element => {
            element.addEventListener("click", addCartOut)
        })
        
        let openDAImg = document.querySelectorAll(".overlay")
        openDAImg.forEach(item=>{
            item.addEventListener("click",showDetails)
        })

        let openDAtitle = document.querySelectorAll(".titleName")
        openDAtitle.forEach(item=>{
            item.addEventListener("click",showDetails)
        })
    })
}

// Add Product
function addProduct(product) {
    // create div
    let div = document.createElement("div");
    // Add class
    div.setAttribute('class', "col-lg-4 col-md-6 col-sm-12")
    div.setAttribute('data-id', product.id)
    //Add inner html
    div.innerHTML = `
                <div class="product-item">
                    <div class="overlay" data-id="${product.id}"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
                        <img src="${product.imageDetalias[0]}"
                        alt="" />
                        <span class="discount">${product.discountPercent}</span>
                    </div>
                    <div class="product-info">
                        <button class="titleName" data-id="${product.id}"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">${product.productTitle}</button>
                        <span class="product_price"><span id="pricel1" class="price">${product.discount[0]}EGP</span><span id="actualpricel1"
                        class="actual-price">${product.price[0]}EGP</span></span>
                    </div>
                    <ul class="icons">
                        <li><i class="bx bx-heart"></i></li>
                        <li id="btn-details" data-id="${product.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom"><i class="bx bx-search"></i></li>
                        <li id="addCard" data-id="${product.id}"><i class="bx bx-cart"></i></li>
                    </ul>
                </div>
        `
    products.appendChild(div);
}


// Show Details
function showDetails() {
    let buttonId = +this.getAttribute("data-id");
    dataProducts.forEach(product => {
        if (+product.id === buttonId) {
            sliderContainerParent.innerHTML += `
                    <div class="slider-container" id="slider-container">
                    ${product.imageDetalias.map(img => `<img src=${img} >`).join(" ")}
                    </div>
                    <div class="slider-controls">
                    <span id="indicators" class="indicators">
                    </span>
                    </div>
                    `
            detailsContainer.innerHTML += `
                    <button class="buttonStyleBack" id="back-btnn"><i class="fa-solid fa-arrow-left"></i> Back To All
                        Products</button>
                    <h2 class="mt-5">${product.productTitle}</h2>
                    <p class="price" id="discountP">EGP ${product.discount[0]} <del id="priceDel">EGP ${product.price[0]}</del></p>
                    <div class="description pt-4 pb-4">${product.description}</div>
                    <div class="form">
                        <div class="row">
                            <div class="col-lg-6 col-md-12">
                                <div class="qty">
                                    <label for="">Quantity</label>
                                    <input type="number" min="1" id="quantity" value="1">
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12">
                                <div class="select">
                                    <label for="">size</label>
                                    <select class="form-select" id="selected" aria-label="Default select example">
                                        ${product.size.map((sizetype, index) => `<option value="${index}">${sizetype}</option>
                                        `).join(" ")}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="buttonStyle add-card mt-5" id="addCardd">Add To Cart <i class="fa-solid fa-cart-shopping"></i></button>
                    <div class="icon">
                    </div>
                    `
            // Add Slider
            slider();
            // Close Page
            let btnClose = document.getElementById("btn-close");
            let btnBack = document.getElementById("back-btnn");
            btnClose.addEventListener("click", () => {
                detailsContainer.innerHTML = "";
                sliderContainerParent.innerHTML = "";
            })

            btnBack.addEventListener("click", () => {
                btnClose.click();
            })

            // Change Price 
            let quantity = document.getElementById("quantity");
            quantity.addEventListener("change", (number) => {
                if (number.target.value > 0) {
                    document.getElementById("discountP").innerHTML = "EGP " + (+number.target.value * product.discount[0]) + `<del id="priceDel">EGP ${+number.target.value * product.price[0]}</del>`;
                }
            })

            let selected = document.getElementById("selected");
            selected.addEventListener("change", (select) => {
                document.getElementById("discountP").innerHTML = "EGP " + (+quantity.value * product.discount[+selected.value]) + `<del id="priceDel">EGP ${+quantity.value * product.price[+selected.value]}</del>`;
            })

            // Add To Card
            let addCardd = document.getElementById("addCardd");
            addCardd.addEventListener("click", () => {
                addToCard(product.productTitle, product.size[+selected.value], product.discount[+selected.value], +quantity.value , product.imageDetalias[0])
            })
        }
    })
}

// ADD To Cart
function addToCard(title, size, discount, quantity , img ) {
    let id = listItems.length === 0 ? 0 : listItems[listItems.length - 1].id + 1;
    // Create Object Task Store Text and Place
    const newPrduct = { title, size, discount, quantity, id , img };
    // Add Object In Array CardsData
    listItems = getData();
    listItems.push(newPrduct);
    // Add Object In Local Storage
    setDataLocal(listItems);
    count.innerHTML = listItems.length ;
}

// Add ELement Out Without Open Datelis
function addCartOut() {
    let item = dataProducts.filter(e => +e.id === +this.getAttribute("data-id"))
    console.log(item[0])
    addToCard(item[0].productTitle, item[0].size[0], item[0].discount[0], 1 , item[0].imageDetalias[0])
}


addProductsAll();


// Slider 
function slider() {
    // Get slider items
    let sliderImages = Array.from(document.querySelectorAll(".slider-container img"));

    // Get Number of Slides
    let slidesCount = sliderImages.length;

    // Set Current slide 
    let currentSlide = 1;

    // Create the Main Ul Element
    let PaginationElement = document.createElement("ul");

    // Set ID on Create Ul Element 
    PaginationElement.setAttribute("id", "pagination-ul");

    // Create List Items Based On Slides Count
    for (let i = 1; i <= slidesCount; i++) {
        // Create The LI
        let PaginationItem = document.createElement("li");

        // Set Custom Attribute
        PaginationItem.setAttribute("data-index", i);

        // Append items to the Main Ul list
        PaginationElement.appendChild(PaginationItem)
    }
    // Add the cteated Ul Element to the Page
    document.getElementById("indicators").appendChild(PaginationElement);

    // Get The New Created Ul
    let PaginationUl = document.getElementById("pagination-ul");

    // Loop Through All Bullets Items
    for (let i = 0; i < PaginationUl.children.length; i++) {
        Array.from(PaginationUl.children)[i].onclick = function () {
            currentSlide = this.getAttribute("data-index");
            theChecker();
        }
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
        sliderImages[currentSlide - 1].classList.add("active");

        // Set Active Class on Current Pagination item
        PaginationUl.children[currentSlide - 1].classList.add("active");
    }

    // Remove All Active Classes From Images and Pagination Bullets
    function removeAllActive() {

        // loop Through images
        sliderImages.forEach((img) => img.classList.remove("active"));

        // loop Through Pagination Bullets
        Array.from(PaginationUl.children).forEach((item) => item.classList.remove("active"));
    }

    // Trigger The Checker Function
    theChecker();
}