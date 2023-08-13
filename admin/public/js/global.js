const openSidebar = document.getElementById('open');
const closeSidebar = document.getElementById('close-side');
const navList = document.getElementById('nav-lists');
const overlay = document.getElementById('overlay');

openSidebar.addEventListener('click', () => {
  navList.classList.remove('-left-[999px]');
  navList.classList.add('left-0');
  overlay.classList.remove('hidden');
  overlay.classList.add('block');
});

closeSidebar.addEventListener('click', () => {
  navList.classList.add('-left-[999px]');
  navList.classList.remove('left-0');
  overlay.classList.remove('block');
  overlay.classList.add('hidden');
});

// Check if admin logged in
const admin = localStorage.getItem("admin");
if (!admin) {
  window.location = 'login.html';
}