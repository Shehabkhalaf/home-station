const URL = 'http://127.0.0.1:8000/';
const formContainer = document.getElementById('form__container');
let allOffers = [];

const tableBody = document.getElementById('offer-body');

function updateTable() {
  tableBody.innerHTML = `<span class="loader"></span>`;

  getAllOffers().then((data) => {
    allOffers = data.data;

    if (data.data.length === 0) {
      tableBody.innerHTML = `<tr><td class="text-lg whitespace-nowrap ml-1">Not Found!</td></tr>`;
    } else {
      tableBody.innerHTML = '';
      data.data.forEach((offer, i) => {
        const tr = document.createElement('tr');

        if (++i % 2 === 0) {
          tr.classList.add('bg-gray-50');
        }

        tr.innerHTML = `
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">${offer.id}</td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
          ${offer.promocode}
        </td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
        ${offer.discount}
        </td>
        <td class="p-3 text-gray-700 text-sm whitespace-nowrap">
        ${offer.started_at}
        </td>
        <td class="p-3 text-gray-700 text-sm">${offer.expired_at}</td>
        `;

        tableBody.append(tr);
      });
    }
  });
}
updateTable();

/**
 * Handle offers Add - Update Btns
 */
const addOfferBtn = document.getElementById('add-offer');
const updateOfferBtn = document.getElementById('update-offer');
const offerBtns = document.querySelectorAll('.offer__btn');

addOfferBtn.addEventListener('click', handleAddBtn);
updateOfferBtn.addEventListener('click', handleUpdateBtn);

function handleAddBtn() {
  removeAllActive(offerBtns);
  addOfferBtn.classList.add('active');

  const formElements = `
  <form id="offer-form">
  <div class="flex flex-col">
    <label htmlFor="promocode" class="text-md mb-1"
      >Promo Code:
    </label>
    <input
      type="text"
      placeholder="Add The Offer Promo Code"
      id="promocode"
      class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
    />
    <div
      class="error-message text-red-500 text-sm mb-1"
      id="promo-error-message"
    ></div>
  </div>

  <div class="flex flex-col my-2">
    <label htmlFor="discount" class="text-md mb-1">Discount:</label>
    <input
      type="number"
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
    <label htmlFor="start-date" class="text-md mb-1"
      >Start Date:</label
    >
    <input
      type="date"
      placeholder="dd/mm/yyyy"
      id="start-date"
      class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
    />
  </div>

  <div class="flex flex-col my-2">
    <label htmlFor="expired-date" class="text-md mb-1"
      >Expired Date:</label
    >
    <input
      type="date"
      placeholder="dd/mm/yyyy"
      id="expired-date"
      class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
    />
    <div
      class="error-message text-red-500 text-sm mb-1"
      id="expired-date-error-message"
    ></div>
  </div>

  <button
    class="mt-1 py-2 px-4 hover:opacity-[80%] duration-100 ease-in bg-main rounded-md text-white"
    type="submit"
    id="offer-submit"
  >
    Submit
  </button>
  <div
    class="success-message text-green-500 text-sm mt-1"
    id="success-message"
  ></div>
  <div
    class="success-message text-red-500 text-sm mt-1"
    id="error-message"
  ></div>
</form>
  `;
  formContainer.innerHTML = formElements;

  const offerPromo = document.getElementById('promocode');
  const promoError = document.getElementById('promo-error-message');

  const offerDiscount = document.getElementById('discount');
  const discountError = document.getElementById('discount-error-message');

  const startDate = document.getElementById('start-date');
  const expiredDate = document.getElementById('expired-date');
  const expiredError = document.getElementById('expired-date-error-message');

  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.getElementById('offer-submit');
  const offerForm = document.getElementById('offer-form');

  offerForm.addEventListener('submit', (e) => handleAddSubmit(e));

  function handleAddSubmit(e) {
    e.preventDefault();

    const promo = offerPromo.value;
    const discount = offerDiscount.value;
    const start = startDate.value;
    const expired = expiredDate.value;

    const offerData = {
      promocode: promo,
      discount,
      started_at: start,
      expired_at: expired,
    };

    if (
      isValid(
        { promo, promoError },
        { discount, discountError },
        { start },
        { expired, expiredError }
      )
    ) {
      addOffer(offerData, errorMessage, successMessage, submitBtn);
      offerPromo.value = '';
      offerDiscount.value = '';
      startDate.value = '';
      expiredDate.value = '';
    }
  }
}
handleAddBtn();

function handleUpdateBtn() {
  removeAllActive(offerBtns);
  updateOfferBtn.classList.add('active');

  const formElements = `
        <form id="offer-form">
          <div class="flex flex-col">
            <label htmlFor="offer-select" class="text-md mb-1">Select Offer: </label>

            <select
              id="offer-select"
              name="offer"
              class="w-[60%] outline-none cursor-pointer border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
            >
            ${
              allOffers.count !== 0 &&
              allOffers.map((offer) => {
                return `<option id="offer-value" value="${offer.id}">${offer.promocode}</option>`;
              })
            }
            </select>
            </div>
            <div id="edit-btn" class="cursor-pointer w-[10%] mt-1 py-2 text-center hover:opacity-[80%] duration-100 ease-in bg-main rounded-md text-white">Edit</div>
          <div id="ele-container" class="mt-4"></div>
        </form>
  `;
  formContainer.innerHTML = formElements;

  const offerSelect = document.getElementById('offer-select');
  const editBtn = document.getElementById('edit-btn');
  const eleContainer = document.getElementById('ele-container');

  editBtn.addEventListener('click', () =>
    addUpdateFormElements(offerSelect.value, eleContainer)
  );
}

function addUpdateFormElements(id, eleContainer) {
  getSingleOffer(id).then(({ data }) => {
    eleContainer.innerHTML = `  <div class="flex flex-col">
    <label htmlFor="promocode" class="text-md mb-1"
      >Promo Code:
    </label>
    <input
      type="text"
      placeholder="Add The Offer Promo Code"
      id="promocode"
      value="${data.promocode}"
      class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
    />
    <div
      class="error-message text-red-500 text-sm mb-1"
      id="promo-error-message"
    ></div>
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
    <label htmlFor="start-date" class="text-md mb-1"
      >Start Date:</label
    >
    <input
      type="date"
      value="${data.started_at}"
      placeholder="dd/mm/yyyy"
      id="start-date"
      class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
    />
  </div>

  <div class="flex flex-col my-2">
    <label htmlFor="expired-date" class="text-md mb-1"
      >Expired Date:</label
    >
    <input
      type="date"
      value="${data.expired_at}"
      placeholder="dd/mm/yyyy"
      id="expired-date"
      class="w-[60%] outline-none border-2 rounded-md border-black/20 py-1 pl-3 transition-all duration-300 ease-linear focus:border-main hover:border-main placeholder:focus:opacity-0 placeholder:focus:duration-200 placeholder:focus:ease-in"
    />
    <div
      class="error-message text-red-500 text-sm mb-1"
      id="expired-date-error-message"
    ></div>
  </div>

  <button
    class="mt-1 py-2 px-4 hover:opacity-[80%] duration-100 ease-in bg-main rounded-md text-white"
    type="submit"
    id="offer-submit"
  >
    Submit
  </button>
  <div
    class="success-message text-green-500 text-sm mt-1"
    id="success-message"
  ></div>
  <div
    class="success-message text-red-500 text-sm mt-1"
    id="error-message"
  ></div>`;

    const offerPromo = document.getElementById('promocode');
    const promoError = document.getElementById('promo-error-message');

    const offerDiscount = document.getElementById('discount');
    const discountError = document.getElementById('discount-error-message');

    const startDate = document.getElementById('start-date');
    const expiredDate = document.getElementById('expired-date');
    const expiredError = document.getElementById('expired-date-error-message');

    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('offer-submit');
    const offerForm = document.getElementById('offer-form');

    offerForm.addEventListener('submit', (e) => handleAddSubmit(e));

    function handleAddSubmit(e) {
      e.preventDefault();

      const promo = offerPromo.value;
      const discount = offerDiscount.value;
      const start = startDate.value;
      const expired = expiredDate.value;

      const offerData = {
        id,
        promocode: promo,
        discount,
        started_at: start,
        expired_at: expired,
      };

      if (
        isValid(
          { promo, promoError },
          { discount, discountError },
          { start },
          { expired, expiredError }
        )
      ) {
        UpdateOffer(offerData, successMessage, submitBtn);
        eleContainer.innerHTML = '';
      }
    }
  });
}

/**
 * Handle Add Form
 */
async function addOffer(data, errorMessageELe, successMessage, submitBtn) {
  console.log(data);
  try {
    submitBtn.innerHTML = 'Submitting...';
    submitBtn.disabled = true;

    const res = await fetch(`${URL}api/admin/add_offer`, {
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
      successMessage.textContent = 'Offer has been Added.';
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
async function UpdateOffer(data, successMessage, submitBtn) {
  try {
    submitBtn.innerHTML = 'Submitting...';
    submitBtn.disabled = true;

    const res = await fetch(`${URL}api/admin/update_offer`, {
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
      successMessage.innerHTML = 'Offer has been Updated.';
      updateTable();
      setTimeout(() => {
        successMessage.innerHTML = '';
      }, 4000);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getAllOffers() {
  try {
    const res = await fetch(`${URL}api/admin/all_offers`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getSingleOffer(id) {
  try {
    const res = await fetch(`${URL}api/admin/show_offer/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function removeAllActive(target) {
  target.forEach((button) => {
    button.classList.remove('active');
  });
}

function isValid(promo, discount, start, expire) {
  if (promo.promo === '') {
    promo.promoError.textContent = 'This field is required.';
    setTimeout(() => {
      promo.promoError.textContent = '';
    }, 4000);
    return flase;
  }

  if (discount.discount === '') {
    discount.discountError.textContent = 'This field is required.';
    setTimeout(() => {
      discount.discountError.textContent = '';
    }, 4000);
    return flase;
  }

  if (
    discount.discount < 0 ||
    discount.discount > 100 ||
    isNaN(discount.discount)
  ) {
    discount.discountError.textContent = 'Enter a valid discount percentage.';
    setTimeout(() => {
      discount.discountError.textContent = '';
    }, 4000);
    return flase;
  }

  const startDate = new Date(start.start);
  const expiredDate = new Date(expire.expired);

  if (start.start === '' || expire.expired === '') {
    expire.expiredError.textContent = 'Start & Expired Date are required.';
    setTimeout(() => {
      expire.expiredError.textContent = '';
    }, 4000);
    return false;
  } else {
    if (startDate > expiredDate) {
      expire.expiredError.textContent =
        'Start Date must be before Expired Date.';
      setTimeout(() => {
        expire.expiredError.textContent = '';
      }, 4000);
      return flase;
    }
  }

  return true;
}
