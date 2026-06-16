<?php
// contact.php - simple backend for contact form
// Sends an email to the site owner using PHP's mail() function.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

// Retrieve and sanitize inputs
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

// Basic validation
if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid input';
    exit;
}

$to = 'shubhajitkundu2@gmail.com'; // Your email address
$subject = 'New Contact Form Message';
$headers = "From: $name <$email>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
$body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

if (mail($to, $subject, $body, $headers)) {
    echo 'Message sent successfully';
} else {
    http_response_code(500);
    echo 'Failed to send the email.';
}
?>
