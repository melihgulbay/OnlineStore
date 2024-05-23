// Initialize the cart total price
let cartTotalPrice = 0;

// Fetch items from the database and display them on the page
// Fetch items from the database and display them on the page
function displayItems() {
  fetch('api.php?action=getItems')
    .then(response => response.json())
    .then(data => {
      const itemsDiv = document.getElementById('items');
      itemsDiv.innerHTML = '';

      let sortedData = data; // Initial data to be displayed

      // Retrieve the user's sorting preference
      const sortSelect = document.getElementById('sort');
      const sortOption = sortSelect.value;

      // Retrieve the user's search query
      const searchInput = document.getElementById('search');
      const searchQuery = searchInput.value.toLowerCase();

      // Filter the items based on the user's search query
      let filteredData = sortedData.filter(item => item.name.toLowerCase().includes(searchQuery));

      // Sort the items based on the user's preference
      if (sortOption === 'asc') {
        filteredData.sort((a, b) => a.price - b.price); // Sort in ascending order
      } else if (sortOption === 'desc') {
        filteredData.sort((a, b) => b.price - a.price); // Sort in descending order
      }

      filteredData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        // Create the image element and set the source
        const image = document.createElement('img');
        image.src = item.image;
        itemDiv.appendChild(image);

        // Create the item details
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        detailsDiv.innerHTML = `
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>Quantity available: ${item.quantity}</p>
          <input type="number" min="1" max="${item.quantity}" id="quantity_${item.id}">
          <button onclick="addToCart(${item.id}, ${item.price})">Add to Cart</button>
        `;

        itemDiv.appendChild(detailsDiv);
        itemsDiv.appendChild(itemDiv);
      });
    });
}


function sortItems() {
  displayItems(); // Call the displayItems function to re-render the items based on the user's sorting preference
}



// Add an item to the cart
// Add an item to the cart
function addToCart(itemId, itemPrice) {
  const quantity = document.getElementById(`quantity_${itemId}`).value;

  fetch(`api.php?action=addToCart&itemId=${itemId}&quantity=${quantity}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert('Item added to cart!');
        cartTotalPrice += itemPrice * quantity; // Accumulate the prices of added items
        updateCartTotal(cartTotalPrice);
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

document.getElementById('loginButton').addEventListener('click', function() {
  window.location.href = 'login.html';
});

document.getElementById('registerButton').addEventListener('click', function() {
  window.location.href = 'register.html';
});

document.addEventListener('DOMContentLoaded', function() {
  displayItems(); // Call the displayItems function after the site loads

  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', displayItems);
});



// Update the total price in the cart
function updateCartTotal(totalPrice) {
  document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}


// Purchase the items in the cart
function purchase() {
  fetch('api.php?action=purchase')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Purchase successful!');
        cartTotalPrice = 0; // Reset the total price to zero
        updateCartTotal(cartTotalPrice);
        displayItems();
      } else {
        alert('Failed to complete the purchase. Please try again.');
      }
    });
}

// Handle add item form submission
document.getElementById('addItemForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;

  // Send add item request to the server
  fetch(`api.php?action=addItem&name=${name}&price=${price}&quantity=${quantity}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Item added successfully!');
        displayItems(); // Refresh the items on the page
      } else {
        alert('Failed to add item. Please try again.');
      }
    });
});



displayItems();
