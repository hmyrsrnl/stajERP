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

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID parametresi eksik."]);
    exit;
}

try {
    $sql = "SELECT 
                c.ID AS id,
                c.TCKimlikNo AS tc_no,
                c.Ad AS first_name,
                c.Soyad AS last_name,
                c.Cinsiyet AS gender,
                c.Unvan AS role_name,
                c.TelNo AS phone_number,
                c.Email AS email,
                c.Adres AS home_address,
                c.Status AS status,
                c.IsBaslangicTarihi AS hire_date,   
                c.Created_at AS created_at,         
                c.Updated_at AS updated_at,         
                d.DepartmanAdı AS department_name
            FROM Calisan c
            LEFT JOIN Departman d ON c.DepartmanID = d.ID
            WHERE c.ID = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($employee) {
        echo json_encode($employee);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Çalışan bulunamadı."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Veritabanı hatası: " . $e->getMessage()]);
}

if ($method === 'POST') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $tc_no        = $data['tc_no'] ?? '';
    $first_name   = $data['first_name'] ?? '';
    $last_name    = $data['last_name'] ?? '';
    $email        = $data['email'] ?? '';
    $gender       = $data['gender'] ??'';
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
                    DepartmanID = ?, TCKimlikNo = ?, Ad = ?, Soyad = ?, Cinsiyet = ?,
                    Unvan = ?, Maas = ?, Adres = ?, TelNo = ?, 
                    Email = ?, System_role = ?, Status = ?
                WHERE ID = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $department_id, $tc_no, $first_name, $last_name, $gender,
            $role_name, $maas, $home_address, $phone_number,
            $email, $system_role, $status, $id
        ]);

        echo json_encode(["message" => "Çalışan bilgileri başarıyla güncellendi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["error" => "Güncelleme Hatası: " . $e->getMessage()]);
    }
}