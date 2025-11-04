// app.js - React 없이 순수 JavaScript로 구현한 간단 예제

const products = [
  { id: 1, name: "상품 A", price: 10000 },
  { id: 2, name: "상품 B", price: 20000 },
  { id: 3, name: "상품 C", price: 30000 },
];

let cart = [];

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ${product.price}원`;
    const button = document.createElement("button");
    button.textContent = "장바구니에 담기";
    button.onclick = () => addToCart(product.id);
    li.appendChild(button);
    productList.appendChild(li);
  });
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price}원`;
    cartList.appendChild(li);
  });
  document.getElementById("total-price").textContent = `총 합계: ${cart.reduce((sum, i) => sum + i.price, 0)}원`;
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  cart.push(product);
  renderCart();
}

function init() {
  const app = document.getElementById("root");
  app.innerHTML = `
    <h1>간단 전자상거래 쇼핑몰</h1>
    <h2>상품 목록</h2>
    <ul id="product-list"></ul>
    <h2>장바구니</h2>
    <ul id="cart-list"></ul>
    <div id="total-price">총 합계: 0원</div>
  `;
  renderProducts();
  renderCart();
}

window.onload = init;
