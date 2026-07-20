<?php
require_once 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if (($method === 'POST' && $action === 'delete') || $method === 'DELETE') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    
    $employee_id = $data['id'] ?? $_POST['id'] ?? $_GET['id'] ?? null;

    if (!$employee_id) {
        http_response_code(400);
        echo json_encode([
            "error" => "Silinecek çalışanın ID bilgisi eksik! Gönderilen veri okunamadı.",
            "debug_received_data" => $data,
            "debug_get" => $_GET
        ]);
        exit;
    }

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "DELETE FROM Calisan WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);

        echo json_encode(["message" => "Çalışan başarıyla sistemden silindi."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Çalışan silinirken veritabanı hatası oluştu: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET') {
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
                    c.Created_at AS created_at,
                    d.DepartmanAdı AS department_name
                FROM Calisan c
                LEFT JOIN Departman d ON c.DepartmanID = d.ID";

        $stmt = $pdo->query($sql);
        $employees = $stmt->fetchAll();

        echo json_encode($employees);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Hata: " . $e->getMessage()]);
    }
}


if ($method === 'POST') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $tc_no        = $data['tc_no'] ?? '';
    $first_name   = $data['first_name'] ?? '';
    $last_name    = $data['last_name'] ?? '';
    $email        = $data['email'] ?? '';
    $password     = $data['password'] ?? '123456'; 
    $phone_number = $data['phone_number'] ?? '';
    $home_address = $data['home_address'] ?? '';
    $unvan        = $data['role_name'] ?? 'Personel';
    $maas         = $data['maas'] ?? 17002.12;
    $departmanID  = $data['department_id'] ?? null; 
    $system_role  = $data['system_role'] ?? 'calısan'; 
    $dogumTarihi      = $data['dogum_tarihi'] ?? '2000-01-01';
    $isBaslangicTarihi = date("Y-m-d");

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    if (empty($tc_no) || empty($first_name) || empty($last_name) || empty($email) || empty($phone_number)) {
        http_response_code(400);
        echo json_encode(["error" => "Lütfen zorunlu alanları (TC, Ad, Soyad, E-posta, Telefon) doldurun!"]);
        exit;
    }

    try {
        $sql = "INSERT INTO Calisan (DepartmanID, TCKimlikNo, Ad, Soyad, DogumTarihi, IsBaslangicTarihi, Unvan, Maas, Adres, TelNo, Email, password, System_role, Status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aktif')";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $departmanID, $tc_no, $first_name, $last_name, $dogumTarihi, 
            $isBaslangicTarihi, $unvan, $maas, $home_address, $phone_number, 
            $email, $hashed_password, $system_role
        ]);

        echo json_encode(["message" => "Yeni çalışan İK tarafından başarıyla sisteme kaydedildi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        if ($e->getCode() == 23000) {
            echo json_encode(["error" => "Bu T.C. Kimlik Numarası veya E-posta zaten mevcut!"]);
        } else {
            echo json_encode(["error" => "Veritabanı Hatası: " . $e->getMessage()]);
        }
    }
}

