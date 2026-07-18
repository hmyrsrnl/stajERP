<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $email    = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "E-posta ve şifre alanları boş bırakılamaz!"]);
        exit;
    }

    try {
        $sql = "SELECT ID, Ad, Soyad, Email, password, System_role, Status FROM Calisan WHERE Email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify((string)$password, (string)$user['password'])) {

            if ($user['Status'] === 'Pasif') {
                http_response_code(403);
                echo json_encode(["error" => "Hesabınız pasif durumdadır."]);
                exit;
            }

            $fake_token = bin2hex(random_bytes(16));

            echo json_encode([
                "message" => "Giriş başarılı!",
                "user" => [
                    "id" => $user['ID'],
                    "name" => $user['Ad'] . ' ' . $user['Soyad'],
                    "email" => $user['Email'],
                    "role" => $user['System_role'],
                    "token" => $fake_token
                ]
            ]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Hatalı e-posta veya şifre girdiniz!"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sistem Hatası: " . $e->getMessage()]);
    }
}
