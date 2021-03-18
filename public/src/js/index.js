import "../styles/main.scss";

const tabBtns = document.querySelectorAll(".tabs__item");
const contents = document.querySelectorAll(".content__item");

const tabItemFirst = document.getElementById("tab-item-first");
const tabItemSecond = document.getElementById("tab-item-second");

tabBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((btn) => btn.classList.remove("active"));
    btn.classList.toggle("active");
  });
});
