const hamburer = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

if (hamburer) {
  hamburer.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

// Cart Count
const count = document.getElementById('count');
const products = JSON.parse(localStorage.getItem('products'));
if (products) {
  count.innerHTML = `${products.length}`;
}
