const openSidebar = document.getElementById("open");
const closeSidebar = document.getElementById("close-side");
const navList = document.getElementById("nav-lists");

openSidebar.addEventListener("click", () => {
  navList.classList.remove("-left-[999px]")
})