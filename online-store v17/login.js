document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  login(username, password, role);
});
let loggedInUsername = null;

function login(username, password, role) {
  fetch(`api.php?action=login&username=${username}&password=${password}&role=${role}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Login successful!');
        localStorage.setItem('loggedInUsername', username); // Store the logged-in username in localStorage
		localStorage.setItem('loggedInRole', role);

        if (role === 'user') {
          window.location.href = 'index.html';
        } else if (role === 'seller') {
          window.location.href = 'seller.html';
        }
      } else {
        alert('Login failed. Please try again.');
      }
    });
}


