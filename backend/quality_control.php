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
$certificate_id = $_GET['certificate_id'] ?? null;


if (($method === 'POST' && $action === 'delete') || $method === 'DELETE') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    
    $cert_id = $data['id'] ?? $_POST['id'] ?? $_GET['id'] ?? null;

    if (!$cert_id) {
        http_response_code(400);
        echo json_encode([
            "error" => "Silinecek sertifikanın ID bilgisi eksik! Gönderilen veri okunamadı.",
            "debug_received_data" => $data,
            "debug_get" => $_GET
        ]);
        exit;
    }

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "DELETE FROM CalisanSertifika WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cert_id]);

        echo json_encode(["message" => "Sertifika başarıyla sistemden silindi."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifika silinirken veritabanı hatası oluştu: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET' && $action === 'list' && $employee_id) {
    try {
        $sql = "SELECT 
                    cs.ID AS id,
                    st.SertifikaAdi AS certificate_name,
                    sk.KategoriAdi AS category_name,
                    cs.VerilisTarihi AS issue_date,
                    cs.BitisTarihi AS expiry_date,
                    cs.Durum AS status,
                    cs.Seviye AS level
                FROM CalisanSertifika cs
                JOIN SertifikaTur st ON cs.SertifikaTurID = st.ID
                JOIN SertifikaKategori sk ON st.SertifikaKategoriID = sk.ID
                WHERE cs.CalisanID = ?
                ORDER BY cs.BitisTarihi ASC"; 
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);
        echo json_encode($stmt->fetchAll());
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifikalar listelenemedi: " . $e->getMessage()]);
    }
}

if ($method === 'GET' && $action === 'get_types') {
    try {
        $sql = "SELECT st.ID AS id, st.SertifikaAdi AS name, sk.KategoriAdi AS category 
                FROM SertifikaTur st
                JOIN SertifikaKategori sk ON st.SertifikaKategoriID = sk.ID
                WHERE sk.KategoriAdi IN ('Teknik', 'Kalite')"; 
                
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll());
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifika türleri alınamadı."]);
    }
}

if ($method === 'GET' && $action === 'get_welders') {
    try {
        $sql = "SELECT ID AS id, Ad AS first_name, Soyad AS last_name, Unvan AS role_name, Status AS status 
                FROM Calisan 
                WHERE Unvan = 'Kaynakçı' AND Status = 'Aktif'";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll());
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Kaynakçı listesi alınamadı: " . $e->getMessage()]);
    }
}


if ($method === 'POST' && $action === 'add') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $calisanID       = $data['employee_id'] ?? null;
    $sertifikaTurID  = $data['certificate_type_id'] ?? null;
    $verilisTarihi   = $data['issue_date'] ?? null;
    $bitisTarihi     = $data['expiry_date'] ?? null;
    $seviye          = $data['level'] ?? null;
    $durum           = $data['status'] ?? 'Aktif';

    if (!$calisanID || !$sertifikaTurID || !$verilisTarihi || !$bitisTarihi) {
        http_response_code(400);
        echo json_encode(["error" => "Eksik alan bıraktınız! Tarihler ve Sertifika türü zorunludur."]);
        exit;
    }

    if (strtotime($bitisTarihi) <= strtotime($verilisTarihi)) {
        http_response_code(400);
        echo json_encode(["error" => "Bitiş tarihi veriliş tarihinden önce veya aynı gün olamaz!"]);
        exit;
    }

    try {
        $sql = "INSERT INTO CalisanSertifika (CalisanID, SertifikaTurID, VerilisTarihi, BitisTarihi, Seviye, Durum) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$calisanID, $sertifikaTurID, $verilisTarihi, $bitisTarihi, $seviye, $durum]);
        echo json_encode(["message" => "Sertifika başarıyla çalışanın dosyasına işlendi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["error" => "Veritabanı kayıt hatası: " . $e->getMessage()]);
    }
}

if ($method === 'POST' && $action === 'update' && $certificate_id) {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $sertifikaTurID = $data['certificate_type_id'] ?? null;
    $verilisTarihi = $data['issue_date'] ?? null;
    $bitisTarihi = $data['expiry_date'] ?? null;
    $seviye = $data['level'] ?? null;

    try {
        $sql = "UPDATE CalisanSertifika SET SertifikaTurID = ?, VerilisTarihi = ?, BitisTarihi = ?, Seviye = ? WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$sertifikaTurID, $verilisTarihi, $bitisTarihi, $seviye, $certificate_id]);
        echo json_encode(["message" => "Kaynak sertifikası başarıyla güncellendi."]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => "Güncelleme hatası oluştu."]);
    }
}

if ($method === 'GET' && $action === 'get_single' && $certificate_id) {
    try {
        $sql = "SELECT 
                    ID AS id, 
                    CalisanID AS employee_id, 
                    SertifikaTurID AS certificate_type_id, 
                    VerilisTarihi AS issue_date, 
                    BitisTarihi AS expiry_date, 
                    Seviye AS level 
                FROM CalisanSertifika 
                WHERE ID = ?";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$certificate_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Aranan sertifika kaydı bulunamadı."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifika detayı getirilirken hata oluştu: " . $e->getMessage()]);
    }
}