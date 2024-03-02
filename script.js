let logindata = JSON.parse(localStorage.getItem("LoginData")) || [];
let data = JSON.parse(localStorage.getItem("Products")) || [];
let LoggedUser = JSON.parse(sessionStorage.getItem("currentUser")) || [];
let cart = JSON.parse(localStorage.getItem("Cart")) || [];

//ADMIN
let serialNumber;

if (Object.keys(data).length > 0) {
  serialNumber = Math.max(...data.map((item) => item.serialNumber)) + 1;
} else {
  serialNumber = 1;
}
let displayNumberOfProducts = 5;
function generateProductId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  const productId = `${timestamp}${randomNum}`;

  return productId;
}
function addData() {
  const Productname = document.getElementById("Name").value;
  const ProductQuantity = parseInt(document.getElementById("Quantity").value);
  const ProductPrice = parseFloat(document.getElementById("Price").value);
  const ProductDescription = document.getElementById("Description").value;
  const ProductImage = document.getElementById("Image").value;
  if (
    Productname &&
    ProductQuantity &&
    !isNaN(ProductQuantity) &&
    ProductPrice &&
    !isNaN(ProductPrice) &&
    ProductDescription
  ) {
    const alreadyexists = data.findIndex((x) => x.Productname === Productname);
    const pid = generateProductId();
    const obj = {
      pid,
      serialNumber,
      Productname,
      ProductImage,
      ProductPrice,
      ProductQuantity,
      ProductDescription,
    };
    if (alreadyexists === -1) {
      data.push(obj);
      localStorage.setItem("Products", JSON.stringify(data));
      serialNumber++;
      document.getElementById("Name").value = "";
      document.getElementById("Description").value = "";
      document.getElementById("Price").value = "";
      document.getElementById("Quantity").value = "";
      document.getElementById("Image").value = "";
      addToTable(obj);
    } else {
      alert("Product already exists!");
    }
  } else {
    alert("Please fill in all the fields.");
  }
}
function showMore() {
  displayNumberOfProducts += 5;
  displayNumberOfProducts = Math.min(displayNumberOfProducts, data.length);

  refreshProductList();
}
function showLess() {
  if (displayNumberOfProducts < 10) displayNumberOfProducts = 5;
  else displayNumberOfProducts -= 5;
  refreshProductList();
}

function removeProduct(id) {
  data = data.filter((item) => item.pid !== id);
  if (data.length !== 0 && data[0].serialNumber !== 1) data[0].serialNumber = 1;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].serialNumber != data[i + 1].serialNumber - 1) {
      data[i + 1].serialNumber = data[i].serialNumber + 1;
    }
  }
  if (data.length === 0) {
    serialNumber = 1;
  } else serialNumber = data[data.length - 1].serialNumber + 1;
  localStorage.setItem("Products", JSON.stringify(data));

  refreshProductList();
  window.location.href = "Admin.html";
}

function updateProduct(id) {
  const modal = document.getElementById("updateModal");
  const productIndex = data.findIndex((x) => x.pid === id);
  if (productIndex !== -1) {
    const product = data[productIndex];

    document.getElementById("updatedName").value = product.Productname;
    document.getElementById("updatedPrice").value = product.ProductPrice;
    document.getElementById("updatedQuantity").value = product.ProductQuantity;
    document.getElementById("updatedDescription").value = product.ProductDescription;
    document.getElementById("updatedImage").value = product.ProductImage;

    modal.style.display = "block";

    document.getElementById("updateButton").onclick = function () {
      const updatedName = document.getElementById("updatedName").value;
      const updatedPrice = parseFloat(
        document.getElementById("updatedPrice").value
      );
      const updatedQuantity = parseInt(
        document.getElementById("updatedQuantity").value
      );
      const updatedDescription =
        document.getElementById("updatedDescription").value;
      const updatedImage = document.getElementById("updatedImage").value
      if (
        updatedName !== "" &&
        !isNaN(updatedPrice) &&
        !isNaN(updatedQuantity)
      ) {
        data[productIndex].Productname = updatedName;
        data[productIndex].ProductPrice = updatedPrice;
        data[productIndex].ProductQuantity = updatedQuantity;
        data[productIndex].ProductDescription = updatedDescription;
        data[productIndex].ProductImage = updatedImage;

        localStorage.setItem("Products", JSON.stringify(data));

        modal.style.display = "none";
        refreshProductList();
      } else {
        alert("Invalid input. Product was not updated.");
      }
    };
  }
  displayCart();
}

function closeUpdateModal() {
  const modal = document.getElementById("updateModal");
  modal.style.display = "none";
}
function addToTable(obj) {
  const tableBody = document.getElementById("ProductsBody");
  const row = tableBody.insertRow();
  row.insertCell(0).innerText = obj.serialNumber;
  const productImageCell = row.insertCell(1);
      const image = obj.ProductImage;
      productImageCell.innerHTML = `<img src="${image}" alt="Product Image" style="width:100px; height: 150px;;">`;
      row.insertCell(2).innerText = obj.Productname;
      row.insertCell(3).innerText = `Rs.${obj.ProductPrice}`;
      row.insertCell(4).innerText = obj.ProductQuantity;
      row.insertCell(5).innerText = obj.ProductDescription;
      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      removeButton.addEventListener("click", function () {
        removeProduct(obj.pid);
      });

      const updateButton = document.createElement("button");
      updateButton.innerText = "Update";
      updateButton.addEventListener("click", function () {
        updateProduct(obj.pid);
      });

      const cell = row.insertCell(6);

      cell.appendChild(removeButton);
      cell.appendChild(updateButton);
  }

function refreshProductList(obj) {
  const tableBody = document.getElementById("ProductsBody");
   tableBody.innerHTML = "";
  if (LoggedUser.accountType === "Admin") {
    if(tableBody !== null) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      const row = tableBody.insertRow();
      row.insertCell(0).innerText = item.serialNumber;
      const productImageCell = row.insertCell(1);
      const image = item.ProductImage;
      productImageCell.innerHTML = `<img src="${image}" alt="Product Image" style="width:100px; height: 150px;;">`;
      row.insertCell(2).innerText = item.Productname;
      row.insertCell(3).innerText = `Rs.${item.ProductPrice}`;
      row.insertCell(4).innerText = item.ProductQuantity;
      row.insertCell(5).innerText = item.ProductDescription;

      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      removeButton.addEventListener("click", function () {
        removeProduct(item.pid);
      });

      const updateButton = document.createElement("button");
      updateButton.innerText = "Update";
      updateButton.addEventListener("click", function () {
        updateProduct(item.pid);
      });

      const cell = row.insertCell(6);

      cell.appendChild(removeButton);
      cell.appendChild(updateButton);
    }
  } else {
    
  }
  } else {
    const showMoreButton = document.getElementById("ShowMore");
    const showLessButton = document.getElementById("ShowLess");
    if (data.length > 5) {
      showMoreButton.style.display = "block";
      showLessButton.style.display = "block";
    }
    if (displayNumberOfProducts <= 5) {
      showLessButton.style.display = "none";
    }
    if (data.length === displayNumberOfProducts || data.length <= 5) {
      showMoreButton.style.display = "none";
    }

    for (let i = 0; i < Math.min(displayNumberOfProducts, data.length); i++) {
      let item = data[i];
      const row = tableBody.insertRow();
      row.insertCell(0).innerText = item.serialNumber;
      const productImageCell = row.insertCell(1);
      const image = item.ProductImage;
      productImageCell.innerHTML = `<img src="${image}" alt="Product Image" style="width:200px; height: 150px; object-fit: contain;">`;
      row.insertCell(2).innerText = item.Productname;
      row.insertCell(3).innerText = `Rs.${item.ProductPrice}`;
      row.insertCell(4).innerText = item.ProductDescription;

      const cell = row.insertCell(5);
      const addtoCartbtn = document.createElement("button");
      addtoCartbtn.innerText = "Add to Cart";
      addtoCartbtn.addEventListener("click", function () {
        addToCart(item.pid);
      });
      cell.appendChild(addtoCartbtn);
      row.classList.add("card");
    }
  }

  localStorage.setItem("Products", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", function () {

  const currentPage = window.location.pathname.split("/").pop();
  if (
    LoggedUser.length === 0 &&
    currentPage !== "login.html" &&
    currentPage !== "register.html" &&
    currentPage !== "User.html"
  ) {
    window.location.href = "login.html";
  } else {
    refreshProductList();
  }
});
function login() {
  const loginForm = document.querySelector("#loginform");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    let n = logindata.length;
    let flag = false;
    for (let i = 0; i < n; i++) {
      if (
        (logindata[i].email === emailInput.value ||
          logindata[i].uname == emailInput.value) &&
        logindata[i].password === passwordInput.value
      ) {
        if (logindata[i].accountType === "Admin") {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify({
              uname: logindata[i].uname,
              email: logindata[i].email,
              password: logindata[i].password,
              accountType: "Admin",
            })
          );

          window.location.href = "Admin.html";
          flag = true;
        } else if (logindata[i].accountType === "User") {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify({
              uname: logindata[i].uname,
              email: logindata[i].email,
              password: logindata[i].password,
              accountType: "User",
            })
          );
          window.location.href = "User.html";
          flag = true;
        }
      }
    }
    if (!flag) {
      alert("Invalid email or password.");
    }
  });
}

function register() {
  const register = document.querySelector("#registerform");
  register.addEventListener("submit", function (event) {
    event.preventDefault();

    const accountTypeInput = Array.from(
      document.querySelectorAll(".Account")
    ).find((radio) => radio.checked);
    const unameInput = document.querySelector("#uname");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    if (
      accountTypeInput &&
      emailInput.value &&
      unameInput.value &&
      passwordInput.value
    ) {
      const accountType = accountTypeInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const uname = unameInput.value;

      if (
        logindata.find((x) => x.email === email) ||
        logindata.find((x) => x.uname === uname)
      ) {
        alert("This Account already exists");
      } else {
        logindata.push({ uname, accountType, email, password });
        localStorage.setItem("LoginData", JSON.stringify(logindata));
        register.reset();
        window.location.href = "login.html";
      }
    } else {
      alert("Please fill in all fields and select an account type.");
    }
  });
}

function logout() {
  sessionStorage.clear();

  window.location.href = "User.html";
  alert("Successfully Logged Out");
}
function addToCart(id) {
  const index = data.findIndex((x) => x.pid == id);
  const product = data[index];
  let maxQuantity = product.ProductQuantity;
  if (Object.keys(LoggedUser).length == 0) {
    alert("Please login to add products to cart!");
    return;
  } else {
    const existingCart = cart.find((item) => item.User === LoggedUser.uname);
    if (existingCart) {
      const existingProduct = existingCart.Products.find(
        (p) => p.pid === product.pid
      );
      if (existingProduct) {
        if (existingProduct.ProductQuantity < maxQuantity) {
          existingProduct.ProductQuantity += 1;
          alert("Product Quantity Increased!");
        } else {
          alert("Maximum quantity reached!");
        }
      } else {
        existingCart.Products.push({
          pid: product.pid,
          ProductImg: product.ProductImage,
          Productname: product.Productname,
          ProductPrice: product.ProductPrice,
          ProductQuantity: 1,
          ProductDescription: product.ProductDescription,
        });
        alert("Product Successfully Added!");
      }
    } else {
      cart.push({
        User: LoggedUser.uname,
        Products: [
          {
            pid: product.pid,
            ProductImg: product.ImageName,
            Productname: product.Productname,
            ProductPrice: product.ProductPrice,
            ProductQuantity: 1,
            ProductDescription: product.ProductDescription,
          },
        ],
      });
      alert("Product Successfully Added!");
    }
  }

  localStorage.setItem("Cart", JSON.stringify(cart));
}
function displayCart() {
  const cartName = LoggedUser.uname;
  const existingCart = cart.findIndex((item) => item.User === cartName);
  if (LoggedUser.accountType === "Admin") {
    return;
  }
  if (!cartName) {
    alert("Please login to view cart!");
    return;
  }
  if (existingCart === -1) {
    alert("Cart is empty!");
    return;
  }
  if (
    cart[existingCart].Products.length === 0 && LoggedUser.accountType === "User") {
    alert("Cart is empty!");
    return;
  }

  window.location.href = "cart.html";
}
