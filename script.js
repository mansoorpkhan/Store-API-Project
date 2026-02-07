const API = "https://fakestoreapi.com/products";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ---------- Cart Count ---------- */
function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.innerText = cart.reduce((a,c)=>a+c.qty,0);
}

/* ---------- Load Products ---------- */
async function loadProducts() {
  const res = await fetch(API);
  const products = await res.json();
  const list = document.getElementById("product-list");
  if (!list) return;

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id}, '${p.title}', ${p.price}, '${p.image}')">
        Add to Cart
      </button>
    `;
    list.appendChild(div);
  });
}

/* ---------- Add to Cart ---------- */
function addToCart(id, title, price, image) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, title, price, image, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Product added to cart");
}

/* ---------- Load Cart ---------- */
function loadCart() {
  const items = document.getElementById("cart-items");
  const total = document.getElementById("total-price");
  const count = document.getElementById("item-count");
  if (!items) return;

  let sum = 0;
  let qty = 0;
  items.innerHTML = "";

  cart.forEach(p => {
    sum += p.price * p.qty;
    qty += p.qty;

    items.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}" width="50">
        <p>${p.title}</p>
        <button onclick="changeQty(${p.id},-1)">−</button>
        <span>${p.qty}</span>
        <button onclick="changeQty(${p.id},1)">+</button>
      </div>
    `;
  });

  total.innerText = sum.toFixed(2);
  count.innerText = qty;
}

/* ---------- Quantity Change ---------- */
function changeQty(id, val) {
  cart = cart.map(p => {
    if (p.id === id) p.qty += val;
    return p;
  }).filter(p => p.qty > 0);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

updateCartCount();
loadProducts();
loadCart();
