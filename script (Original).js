
    
      

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let isAdmin = false;

      // Save to localStorage
      function saveDishes() {
        localStorage.setItem("dishes", JSON.stringify(dishes));
      }

      function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCheckoutButton();
      }

      // Show notification
      function showNotification(message, type = "info") {
        const notification = document.getElementById("notification");
        const notificationText = document.getElementById("notificationText");

        notification.className = `notification ${type}`;
        notificationText.textContent = message;
        notification.classList.add("show");

        setTimeout(() => {
          notification.classList.remove("show");
        }, 3000);
      }

      // Update checkout button state
      function updateCheckoutButton() {
        const checkoutBtn = document.getElementById("checkoutBtn");
        checkoutBtn.disabled = cart.length === 0;
      }

      // Display Menu
      function displayDishes() {
        let menu = document.getElementById("menu");
        menu.innerHTML = "";
        let search = document.getElementById("search").value.toLowerCase();
        let filter = document.getElementById("filter").value;
        let sort = document.getElementById("sort").value;

        let filtered = dishes.filter(
          (d) =>
            (filter === "all" || d.category === filter) &&
            (d.name.toLowerCase().includes(search) ||
              d.desc.toLowerCase().includes(search))
        );

        if (sort === "priceLow") filtered.sort((a, b) => a.price - b.price);
        if (sort === "priceHigh") filtered.sort((a, b) => b.price - a.price);
        if (sort === "name")
          filtered.sort((a, b) => a.name.localeCompare(b.name));

        if (filtered.length === 0) {
          menu.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
            <p>No dishes found matching your criteria</p>
          </div>
        `;
          return;
        }

        filtered.forEach((dish) => {
          let card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
          <img src="${dish.img}" alt="${dish.name}" class="card-img">
          <span class="card-category">${dish.category}</span>
          <div class="card-body">
            <h3>${dish.name}</h3>
            <p class="card-desc">${dish.desc}</p>
            <div class="card-footer">
              <span class="price">$${dish.price.toFixed(2)}</span>
              <button class="add-to-cart" data-id="${dish.id}">
                <i class="fas fa-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        `;
          menu.appendChild(card);
        });

        // Add event listeners to the Add to Cart buttons
        document.querySelectorAll(".add-to-cart").forEach((button) => {
          button.addEventListener("click", (e) => {
            const dishId = parseInt(e.currentTarget.getAttribute("data-id"));
            addToCart(dishId);
          });
        });
      }

      // Display dishes for management
      function displayDishesForManagement() {
        const dishesList = document.getElementById("dishesList");
        dishesList.innerHTML = "";

        if (dishes.length === 0) {
          dishesList.innerHTML = `<p>No dishes found. Add some using the dashboard.</p>`;
          return;
        }

        dishes.forEach((dish) => {
          const dishElement = document.createElement("div");
          dishElement.className = "dish-item";
          dishElement.innerHTML = `
            <img src="${dish.img}" alt="${dish.name}">
            <div class="dish-details">
              <h4>${dish.name}</h4>
              <p>${dish.desc}</p>
              <p class="dish-price">$${dish.price.toFixed(2)}</p>
              <span class="card-category">${dish.category}</span>
            </div>
            <div class="dish-actions">
              <button class="admin-btn btn-outline edit-dish" data-id="${
                dish.id
              }">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="admin-btn btn-outline remove-dish" data-id="${
                dish.id
              }" style="color: #ef4444; border-color: #ef4444;">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          `;
          dishesList.appendChild(dishElement);
        });

        // Add event listeners to edit and remove buttons
        document.querySelectorAll(".edit-dish").forEach((button) => {
          button.addEventListener("click", (e) => {
            const dishId = parseInt(e.currentTarget.getAttribute("data-id"));
            editDish(dishId);
          });
        });

        document.querySelectorAll(".remove-dish").forEach((button) => {
          button.addEventListener("click", (e) => {
            const dishId = parseInt(e.currentTarget.getAttribute("data-id"));
            removeDish(dishId);
          });
        });
      }

      // Add to Cart
      function addToCart(id) {
        let dish = dishes.find((d) => d.id === id);
        if (dish) {
          // Check if item already exists in cart
          const existingItemIndex = cart.findIndex((item) => item.id === id);
          
          if (existingItemIndex >= 0) {
            // If exists, increase quantity
            if (!cart[existingItemIndex].quantity) {
              cart[existingItemIndex].quantity = 1;
            }
            cart[existingItemIndex].quantity += 1;
          } else {
            // If new, add with quantity 1
            dish.quantity = 1;
            cart.push(dish);
          }
          
          saveCart();
          displayCart();
          showNotification(`${dish.name} added to cart!`, "success");
        }
      }

      // Display Cart
      function displayCart() {
        let cartList = document.getElementById("cartItems");
        let total = 0;

        if (cart.length === 0) {
          cartList.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
            <p>Your cart is empty</p>
          </div>
        `;
          document.getElementById("total").textContent = "$0.00";
          updateCheckoutButton();
          return;
        }

        cartList.innerHTML = "";

        cart.forEach((item, index) => {
          const itemTotal = item.price * (item.quantity || 1);
          total += itemTotal;
          
          let div = document.createElement("div");
          div.className = "cart-item";
          div.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)} × ${
            item.quantity || 1
          } = $${itemTotal.toFixed(2)}</p>
            <div class="cart-item-controls">
              <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
              <span class="item-quantity">${item.quantity || 1}</span>
              <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
              <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
          cartList.appendChild(div);
        });

        document.getElementById("total").textContent = `$${total.toFixed(2)}`;

        // Add event listeners to quantity buttons
        document.querySelectorAll(".increase-quantity").forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = parseInt(e.currentTarget.getAttribute("data-index"));
            changeQuantity(index, 1);
          });
        });

        document.querySelectorAll(".decrease-quantity").forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = parseInt(e.currentTarget.getAttribute("data-index"));
            changeQuantity(index, -1);
          });
        });

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = parseInt(e.currentTarget.getAttribute("data-index"));
            removeFromCart(index);
          });
        });
        
        updateCheckoutButton();
      }

      // Change item quantity in cart
      function changeQuantity(index, change) {
        if (index >= 0 && index < cart.length) {
          if (!cart[index].quantity) {
            cart[index].quantity = 1;
          }
          
          cart[index].quantity += change;
          
          if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
          }
          
          saveCart();
          displayCart();
        }
      }

      // Remove from Cart
      function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
          const removedItem = cart[index];
          cart.splice(index, 1);
          saveCart();
          displayCart();
          showNotification(`${removedItem.name} removed from cart`, "warning");
        }
      }

      // Admin Login
      function login() {
        let user = document.getElementById("username").value;
        let pass = document.getElementById("password").value;

        if (user === "admin" && pass === "admin123") {
          isAdmin = true;
          document.querySelector('[data-tab="dashboard"]').click();
          showNotification("Admin login successful", "success");
        } else {
          showNotification("Access Denied: Invalid credentials", "error");
        }
      }

      // Add Dish
      function addDish() {
        let name = document.getElementById("dishName").value;
        let desc = document.getElementById("dishDesc").value;
        let price = Number(document.getElementById("dishPrice").value);
        let category = document.getElementById("dishCategory").value;
        let img = document.getElementById("dishImg").value;

        if (!name || !desc || !price || !category) {
          showNotification("Please fill in all required fields", "error");
          return;
        }

        if (price <= 0) {
          showNotification("Price must be greater than 0", "error");
          return;
        }

        // Set default image if none provided
        if (!img) {
          img = "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80";
        }

        let newDish = {
          id: dishes.length > 0 ? Math.max(...dishes.map((d) => d.id)) + 1 : 1,
          name,
          desc,
          price,
          category,
          img,
        };

        dishes.push(newDish);
        saveDishes();
        displayDishes();
        displayDishesForManagement();

        // Clear form
        document.getElementById("dishName").value = "";
        document.getElementById("dishDesc").value = "";
        document.getElementById("dishPrice").value = "";
        document.getElementById("dishImg").value = "";

        showNotification(`${name} added to menu!`, "success");
      }

      // Edit Dish
      function editDish(id) {
        const dish = dishes.find((d) => d.id === id);
        if (dish) {
          // Populate form with dish data
          document.getElementById("dishName").value = dish.name;
          document.getElementById("dishDesc").value = dish.desc;
          document.getElementById("dishPrice").value = dish.price;
          document.getElementById("dishCategory").value = dish.category;
          document.getElementById("dishImg").value = dish.img;

          // Change button to update
          const addButton = document.getElementById("addDishBtn");
          addButton.innerHTML = '<i class="fas fa-save"></i> Update Dish';
          addButton.dataset.editId = id;
          
          // Switch to dashboard tab
          document.querySelector('[data-tab="dashboard"]').click();
          
          showNotification(`Editing ${dish.name}`, "info");
        }
      }

      // Update Dish
      function updateDish(id) {
        let name = document.getElementById("dishName").value;
        let desc = document.getElementById("dishDesc").value;
        let price = Number(document.getElementById("dishPrice").value);
        let category = document.getElementById("dishCategory").value;
        let img = document.getElementById("dishImg").value;

        if (!name || !desc || !price || !category) {
          showNotification("Please fill in all required fields", "error");
          return;
        }

        const index = dishes.findIndex((d) => d.id === id);
        if (index !== -1) {
          dishes[index] = {
            ...dishes[index],
            name,
            desc,
            price,
            category,
            img: img || dishes[index].img,
          };

          saveDishes();
          displayDishes();
          displayDishesForManagement();

          // Reset form and button
          const addButton = document.getElementById("addDishBtn");
          addButton.innerHTML = '<i class="fas fa-plus"></i> Add Dish';
          delete addButton.dataset.editId;

          // Clear form
          document.getElementById("dishName").value = "";
          document.getElementById("dishDesc").value = "";
          document.getElementById("dishPrice").value = "";
          document.getElementById("dishImg").value = "";

          showNotification(`${name} updated successfully!`, "success");
        }
      }

      // Remove Dish
      function removeDish(id) {
        if (confirm("Are you sure you want to remove this dish from the menu?")) {
          const index = dishes.findIndex((d) => d.id === id);
          if (index !== -1) {
            const removedDish = dishes[index];
            dishes.splice(index, 1);
            saveDishes();
            displayDishes();
            displayDishesForManagement();
            showNotification(`${removedDish.name} removed from menu`, "warning");
          }
        }
      }

      // Checkout
      function checkout() {
        if (cart.length === 0) {
          showNotification("Your cart is empty", "error");
          return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        
        // Simulate checkout process
        const checkoutBtn = document.getElementById("checkoutBtn");
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '<div class="loading"></div> Processing...';
        checkoutBtn.disabled = true;

        setTimeout(() => {
          cart = [];
          saveCart();
          displayCart();
          checkoutBtn.innerHTML = originalText;
          showNotification(
            `Order placed successfully! Total: $${total.toFixed(2)}`,
            "success"
          );
        }, 2000);
      }

      // Initialize the application
      function init() {
        // Display initial dishes and cart
        displayDishes();
        displayCart();

        // Event listeners for controls
        document
          .getElementById("search")
          .addEventListener("input", displayDishes);
        document
          .getElementById("filter")
          .addEventListener("change", displayDishes);
        document
          .getElementById("sort")
          .addEventListener("change", displayDishes);

        // Admin panel toggle
        document.getElementById("adminToggle").addEventListener("click", () => {
          const adminPanel = document.getElementById("adminPanel");
          adminPanel.style.display =
            adminPanel.style.display === "none" || adminPanel.style.display === "" ? "block" : "none";

          if (adminPanel.style.display === "block") {
            adminPanel.scrollIntoView({ behavior: "smooth" });
          }
        });

        // Tab functionality
        const tabs = document.querySelectorAll(".tab");
        const tabContents = document.querySelectorAll(".tab-content");

        tabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            if (tab.dataset.tab !== "login" && !isAdmin) {
              showNotification("Please login as admin first", "error");
              document.querySelector('[data-tab="login"]').click();
              return;
            }

            // Update active tab
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            // Show active content
            tabContents.forEach((content) => {
              content.classList.remove("active");
              if (content.id === `${tab.dataset.tab}Tab`) {
                content.classList.add("active");
              }
            });

            // If menu management tab, refresh the list
            if (tab.dataset.tab === "menuManagement") {
              displayDishesForManagement();
            }
          });
        });

        // Login button
        document.getElementById("loginBtn").addEventListener("click", login);

        // Add/Update dish button
        document.getElementById("addDishBtn").addEventListener("click", (e) => {
          if (e.target.dataset.editId) {
            updateDish(parseInt(e.target.dataset.editId));
          } else {
            addDish();
          }
        });

        // Checkout button
        document
          .getElementById("checkoutBtn")
          .addEventListener("click", checkout);

        // Allow pressing Enter in login form
        document
          .getElementById("password")
          .addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
              login();
            }
          });
      }

      // Start the application when the DOM is loaded
      document.addEventListener("DOMContentLoaded", init);