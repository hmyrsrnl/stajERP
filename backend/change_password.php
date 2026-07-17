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

    $employee_id  = $data['employee_id'] ?? null;
    $old_password = $data['old_password'] ?? '';
    $new_password = $data['new_password'] ?? '';

    if (!$employee_id || empty($old_password) || empty($new_password)) {
        http_response_code(400);
        echo json_encode(["error" => "Eksik alan bıraktınız! Tüm şifre alanları zorunludur."]);
        exit;
    }

    if (strlen($new_password) < 6) {
        http_response_code(400);
        echo json_encode(["error" => "Yeni şifre en az 6 karakterden oluşmalıdır!"]);
        exit;
    }

    try {
        $sql = "SELECT password FROM Calisan WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["error" => "Kullanıcı bulunamadı."]);
            exit;
        }

        if (!password_verify($old_password, $user['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Mevcut şifrenizi hatalı girdiniz!"]);
            exit;
        }

        $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
        $update_sql = "UPDATE Calisan SET password = ? WHERE ID = ?";
        $update_stmt = $pdo->prepare($update_sql);
        $update_stmt->execute([$new_hash, $employee_id]);

        echo json_encode(["message" => "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Veritabanı hatası: " . $e->getMessage()]);
    }
}