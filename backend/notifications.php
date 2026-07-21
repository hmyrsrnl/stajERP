<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'send') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $employee_id = $data['employee_id'] ?? null;
    $message     = $data['message'] ?? '';
    $type        = $data['type'] ?? 'Genel Uyarı';

    if (!$employee_id || empty($message)) {
        http_response_code(400);
        echo json_encode(["error" => "Çalışan bilgisi veya bildirim mesajı boş olamaz!"]);
        exit;
    }

    try {
        $sql = "INSERT INTO Bildirimler (CalisanID, Mesaj, Tip) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id, $message, $type]);

        echo json_encode(["message" => "Bildirim çalışana başarıyla gönderildi."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Bildirim kaydedilirken hata oluştu: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET' && $action === 'list') {
    $employee_id = $_GET['employee_id'] ?? null;

    if (!$employee_id) {
        http_response_code(400);
        echo json_encode(["error" => "Çalışan ID bilgisi eksik!"]);
        exit;
    }

    try {
        $sql = "SELECT ID AS id, Mesaj AS message, Tip AS type, OkunduMu AS is_read, Tarih AS created_at 
                FROM Bildirimler 
                WHERE CalisanID = ? 
                ORDER BY Tarih DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Bildirimler çekilirken hata oluştu: " . $e->getMessage()]);
    }
    exit;
}