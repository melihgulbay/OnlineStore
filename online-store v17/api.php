<?php
$action = $_GET['action'] ?? '';

// Connect to the MySQL database
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'online_store';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Get items from the database
if ($action === 'getItems') {
    $sql = 'SELECT * FROM items';
    $result = $conn->query($sql);

    $items = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }

    echo json_encode($items);
}

// Add an item to the database
if ($action === 'addItem') {
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $quantity = $_POST['quantity'] ?? '';
    $image = $_FILES['image'] ?? null;

    if ($name && $price && $quantity && $image) {
        // Handle image upload
        $imagePath = 'images/' . $image['name'];
        move_uploaded_file($image['tmp_name'], $imagePath);

        // Insert the item into the database
        $sql = "INSERT INTO items (name, price, quantity, image) VALUES ('$name', $price, $quantity, '$imagePath')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                'success' => true
            ]);
            exit;
        }
    }

    echo json_encode([
        'success' => false
    ]);
}

// Add an item to the cart
if ($action === 'addToCart') {
    $itemId = $_GET['itemId'] ?? '';
    $quantity = $_GET['quantity'] ?? '';

    if ($itemId && $quantity) {
        $sql = "SELECT * FROM items WHERE id = $itemId";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($row['quantity'] >= $quantity) {
                $totalPrice = $row['price'] * $quantity;

                // Update the quantity of the item
                $newQuantity = $row['quantity'] - $quantity;

                if ($newQuantity <= 0) {
                    // Delete the item from the database if the quantity reaches zero or less
                    $deleteSql = "DELETE FROM items WHERE id = $itemId";
                    $conn->query($deleteSql);
                } else {
                    // Update the quantity of the item in the database
                    $updateSql = "UPDATE items SET quantity = $newQuantity WHERE id = $itemId";
                    $conn->query($updateSql);
                }

                // TODO: Add the item to the cart table or perform any other necessary actions

                echo json_encode([
                    'success' => true,
                    'totalPrice' => $totalPrice
                ]);
                exit;
            }
        }
    }

    echo json_encode([
        'success' => false
    ]);
}


// Purchase the items in the cart
if ($action === 'purchase') {
    // TODO: Perform the necessary actions to complete the purchase, such as updating the inventory and creating an order

    echo json_encode([
        'success' => true
    ]);
    exit;
}

// Login functionality
if ($action === 'login') {
    $username = $_GET['username'] ?? '';
    $password = $_GET['password'] ?? '';
    $role = $_GET['role'] ?? '';

    if ($username && $password && $role) {
        $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password' AND role = '$role'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo json_encode([
                'success' => true
            ]);
            exit;
        }
    }

    echo json_encode([
        'success' => false
    ]);
}

if (isset($_FILES['itemImage']) && $_FILES['itemImage']['error'] === UPLOAD_ERR_OK) {
    $targetDir = 'item_images/';  // Specify the directory to store the uploaded images
    $targetFile = $targetDir . basename($_FILES['itemImage']['name']);

    // Move the uploaded file to the target directory
    if (move_uploaded_file($_FILES['itemImage']['tmp_name'], $targetFile)) {
        // Image upload success, store the file path in the database
        $imagePath = $targetFile;  // You can modify this if you want to store the filename instead
        // ... Perform database query to insert the image path into the items table
    } else {
        // Image upload failed
    }
}

if ($action === 'register') {
    $username = $_GET['username'] ?? '';
    $password = $_GET['password'] ?? '';
    $role = $_GET['role'] ?? '';

    // Check if the username already exists in the database
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $response = array('success' => false, 'message' => 'Username already exists');
        echo json_encode($response);
        exit();
    }

    // Insert the new user into the database
    $query = "INSERT INTO users (username, password, role) VALUES ('$username', '$password', '$role')";
    if ($conn->query($query) === TRUE) {
        $response = array('success' => true, 'message' => 'User registered successfully');
        echo json_encode($response);
    } else {
        $response = array('success' => false, 'message' => 'Failed to register user');
        echo json_encode($response);
    }
}

$conn->close();
?>
