<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Çalışan ID belirtilmedi!"]);
    exit;
}

if ($method === 'GET') {
    try {
        $sql = "SELECT 
                    ID AS id, TCKimlikNo AS tc_no, Ad AS first_name, Soyad AS last_name,
                    Unvan AS role_name, TelNo AS phone_number, Email AS email,
                    Adres AS home_address, Status AS status, System_role AS system_role,
                    DepartmanID AS department_id, Maas AS maas, DogumTarihi AS dogum_tarihi
                FROM Calisan WHERE ID = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $employee = $stmt->fetch();

        if ($employee) {
            echo json_encode($employee);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Çalışan bulunamadı!"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Veri getirme hatası: " . $e->getMessage()]);
    }
}

if ($method === 'POST') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $tc_no        = $data['tc_no'] ?? '';
    $first_name   = $data['first_name'] ?? '';
    $last_name    = $data['last_name'] ?? '';
    $email        = $data['email'] ?? '';
    $phone_number = $data['phone_number'] ?? '';
    $home_address = $data['home_address'] ?? '';
    $role_name    = $data['role_name'] ?? '';
    $maas         = $data['maas'] ?? 17002.12;
    $system_role  = $data['system_role'] ?? 'calısan';
    $department_id = $data['department_id'] ?? null;
    $status       = $data['status'] ?? 'Aktif';

    if (empty($tc_no) || empty($first_name) || empty($last_name) || empty($email)) {
        http_response_code(400);
        echo json_encode(["error" => "Zorunlu alanları boş bırakamazsınız!"]);
        exit;
    }

    try {
        $sql = "UPDATE Calisan SET 
                    DepartmanID = ?, TCKimlikNo = ?, Ad = ?, Soyad = ?, 
                    Unvan = ?, Maas = ?, Adres = ?, TelNo = ?, 
                    Email = ?, System_role = ?, Status = ?
                WHERE ID = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $department_id, $tc_no, $first_name, $last_name,
            $role_name, $maas, $home_address, $phone_number,
            $email, $system_role, $status, $id
        ]);

        echo json_encode(["message" => "Çalışan bilgileri başarıyla güncellendi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["error" => "Güncelleme Hatası: " . $e->getMessage()]);
    }
}