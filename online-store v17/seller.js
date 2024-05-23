// Seller Interface - seller.js

// Handle form submission
document.getElementById('addItemForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form input values
  const itemName = document.getElementById('itemName').value;
  const itemPrice = document.getElementById('itemPrice').value;
  const itemQuantity = document.getElementById('itemQuantity').value;
  const itemImage = document.getElementById('itemImage').files[0];

  // Create a FormData object to send the form data including the image file
  const formData = new FormData();
  formData.append('name', itemName);
  formData.append('price', itemPrice);
  formData.append('quantity', itemQuantity);
  formData.append('image', itemImage);

  // Send the form data to the API endpoint to add the item
  fetch('api.php?action=addItem', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Item added successfully!');
      document.getElementById('addItemForm').reset();
    } else {
      alert('Failed to add item. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  });
});
