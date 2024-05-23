document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  // Send registration request to the server
  fetch(`api.php?action=register&username=${username}&password=${password}&role=${role}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Registration successful! Please login.');
        window.location.href = 'login.html'; // Redirect to login page
      } else {
        alert('Failed to register. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
