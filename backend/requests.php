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
$action = $_GET['action'] ?? '';
$employee_id = $_GET['employee_id'] ?? null;

if ($method === 'GET' && $action === 'list' && $employee_id) {
    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT 
                    t.ID AS id, 
                    d.DepartmanAdı AS department, 
                    t.Konu AS subject, 
                    t.Aciklama AS description, 
                    t.Durum AS status, 
                    DATE(t.OlusturmaTarihi) AS created_at 
                FROM Talep t
                INNER JOIN Departman d ON t.DepartmanID = d.ID
                WHERE t.CalisanID = ? 
                ORDER BY t.OlusturmaTarihi DESC";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode([
            "error" => "SQL Hatası (Listeleme): " . $e->getMessage()
        ]);
    }
    exit;
}

if ($method === 'POST' && $action === 'add') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $calisanID   = $data['employee_id'] ?? null;
    $departmanID = $data['department_id'] ?? null; 
    $konu        = $data['subject'] ?? '';
    $aciklama    = $data['description'] ?? '';

    if (!$calisanID || !$departmanID || !$konu || !$aciklama) {
        http_response_code(400);
        echo json_encode(["error" => "Eksik alan bıraktınız!"]);
        exit;
    }

    try {
        $sql = "INSERT INTO Talep (CalisanID, DepartmanID, Konu, Aciklama, Durum) VALUES (?, ?, ?, ?, 'Beklemede')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$calisanID, $departmanID, $konu, $aciklama]);
        echo json_encode(["message" => "Talebiniz başarıyla iletildi."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Veritabanı kayıt hatası: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET' && $action === 'department_list') {
    $department_role = $_GET['role'] ?? ''; 

    if (!$department_role) {
        http_response_code(400);
        echo json_encode(["error" => "Departman rolü belirtilmedi!"]);
        exit;
    }

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT 
                    t.ID AS id, 
                    c.Ad AS first_name, 
                    c.Soyad AS last_name, 
                    t.Konu AS subject, 
                    t.Aciklama AS description, 
                    t.Durum AS status, 
                    DATE(t.OlusturmaTarihi) AS created_at 
                FROM Talep t
                INNER JOIN Calisan c ON t.CalisanID = c.ID
                INNER JOIN Departman d ON t.DepartmanID = d.ID
                WHERE d.DepartmanAdı = ? AND t.Durum = 'Beklemede'
                ORDER BY t.OlusturmaTarihi ASC";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$department_role]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Talepler getirilemedi: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST' && $action === 'update_status') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $talepID = $data['request_id'] ?? null;
    $yeniDurum = $data['status'] ?? ''; 

    if (!$talepID || !$yeniDurum) {
        http_response_code(400);
        echo json_encode(["error" => "Eksik parametre!"]);
        exit;
    }

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "UPDATE Talep SET Durum = ? WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$yeniDurum, $talepID]);
        
        echo json_encode(["message" => "Talep başarıyla " . mb_strtolower($yeniDurum) . "."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Talep güncellenirken hata oluştu: " . $e->getMessage()]);
    }
    exit;
}