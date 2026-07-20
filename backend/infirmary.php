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
$examination_id = $_GET['examination_id'] ?? null;

if (($method === 'POST' && $action === 'delete') || $method === 'DELETE') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    
    $cert_id = $data['id'] ?? $_POST['id'] ?? $_GET['id'] ?? null;

    if (!$cert_id) {
        http_response_code(400);
        echo json_encode([
            "error" => "Silinecek muayenenin ID bilgisi eksik! Gönderilen veri okunamadı.",
            "debug_received_data" => $data,
            "debug_get" => $_GET
        ]);
        exit;
    }

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "DELETE FROM Muayene WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cert_id]);

        echo json_encode(["message" => "Muayene başarıyla sistemden silindi."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Muayene silinirken veritabanı hatası oluştu: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET' && $action === 'list' && $employee_id) {
    try {
        $sql = "SELECT 
                    m.ID AS id,
                    m.MuayeneTarihi AS exam_date,
                    m.MuayeneTipi AS exam_type,
                    m.Sonuc AS result,
                    m.Aciklama AS description,
                    CONCAT(d.Ad, ' ', d.Soyad) AS doctor_name
                FROM Muayene m
                LEFT JOIN Calisan d ON m.DoktorID = d.ID
                WHERE m.CalisanID = ?
                ORDER BY m.MuayeneTarihi DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); 
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Muayene geçmişi getirilemedi: " . $e->getMessage()]);
    }
}

if ($method === 'POST' && $action === 'add') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $calisanID     = $data['employee_id'] ?? null;
    $muayeneTarihi = date("Y-m-d"); 
    $muayeneTipi   = $data['exam_type'] ?? 'Günlük'; 
    $sonuc         = $data['result'] ?? '';
    $aciklama      = $data['description'] ?? '';
    
    $doktorID      = $data['doctor_id'] ?? 2; 

    if (!$calisanID || empty($sonuc)) {
        http_response_code(400);
        echo json_encode(["error" => "Çalışan seçimi ve Muayene Sonucu zorunludur!"]);
        exit;
    }

    try {
        $sql = "INSERT INTO Muayene (CalisanID, MuayeneTarihi, MuayeneTipi, Sonuc, DoktorID, Aciklama) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$calisanID, $muayeneTarihi, $muayeneTipi, $sonuc, $doktorID, $aciklama]);

        echo json_encode(["message" => "Muayene kaydı başarıyla sisteme işlendi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["error" => "Veritabanı Muayene Hatası: " . $e->getMessage()]);
    }
}

if ($method === 'GET' && $action === 'get_single' && $examination_id) {
    try {
        $sql = "SELECT ID AS id, CalisanID AS employee_id, MuayeneTarihi AS exam_date, MuayeneTipi AS exam_type, Sonuc AS result, Aciklama AS description FROM Muayene WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$examination_id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Muayene detayı getirilemedi."]);
    }
}

if ($method === 'POST' && $action === 'update' && $examination_id) {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $muayeneTipi   = $data['exam_type'] ?? 'Günlük';
    $sonuc         = $data['result'] ?? '';
    $aciklama      = $data['description'] ?? '';

    try {
        $sql = "UPDATE Muayene SET MuayeneTipi = ?, Sonuc = ?, Aciklama = ? WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$muayeneTipi, $sonuc, $aciklama, $examination_id]);
        echo json_encode(["message" => "Muayene kaydı başarıyla güncellendi."]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => "Muayene güncellenirken hata oluştu."]);
    }
}

if ($method === 'GET' && $action === 'employee_history' && $employee_id) {
    try {
        $sql = "SELECT 
                    m.ID AS id, 
                    m.MuayeneTarihi AS exam_date, 
                    m.MuayeneTipi AS exam_type, 
                    m.Sonuc AS result, 
                    m.Aciklama AS description,
                    CONCAT(d.Ad, ' ', d.Soyad) AS doctor_name
                FROM Muayene m
                LEFT JOIN Calisan d ON m.DoktorID = d.ID
                WHERE m.CalisanID = ?
                ORDER BY m.MuayeneTarihi DESC"; 
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Muayene geçmişi çekilemedi: " . $e->getMessage()]);
    }
    exit;
}