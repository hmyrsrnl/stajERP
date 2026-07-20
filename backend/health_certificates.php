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
        echo json_encode(["error" => "Silinecek sertifikanın ID bilgisi eksik!"]);
        exit;
    }

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // 🎯 Muayene değil CalisanSertifika silinmeli
        $sql = "DELETE FROM CalisanSertifika WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cert_id]);

        echo json_encode(["message" => "Sağlık sertifikası başarıyla sistemden silindi."]);
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
                WHERE cs.CalisanID = ? AND sk.KategoriAdi LIKE '%Sağlık%'
                ORDER BY cs.VerilisTarihi DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);
        echo json_encode($stmt->fetchAll());
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifikalar getirilemedi: " . $e->getMessage()]);
    }
}

if ($method === 'GET' && $action === 'get_types') {
    try {
        $sql = "SELECT st.ID AS id, st.SertifikaAdi AS name 
                FROM SertifikaTur st
                JOIN SertifikaKategori sk ON st.SertifikaKategoriID = sk.ID
                WHERE sk.KategoriAdi LIKE '%Sağlık%'";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll());
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifika türleri getirilemedi."]);
    }
}

if ($method === 'POST' && $action === 'add') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $calisanID = $data['employee_id'] ?? null;
    $sertifikaTurID = $data['certificate_type_id'] ?? null;
    $verilisTarihi = $data['issue_date'] ?? date("Y-m-d");
    $bitisTarihi = $data['expiry_date'] ?? null;
    $seviye = $data['level'] ?? null;

    if (!$calisanID || !$sertifikaTurID || !$bitisTarihi) {
        http_response_code(400);
        echo json_encode(["error" => "Sertifika türü ve Bitiş tarihi zorunludur!"]);
        exit;
    }

    if ($verilisTarihi && $bitisTarihi) {
        if (strtotime($bitisTarihi) <= strtotime($verilisTarihi)) {
            http_response_code(400);
            echo json_encode(["error" => "Geçerlilik bitiş tarihi, veriliş tarihinden büyük olmalıdır!"]);
            exit;
        }
    }
    try {
        $sql = "INSERT INTO CalisanSertifika (CalisanID, SertifikaTurID, VerilisTarihi, BitisTarihi, Seviye, Durum) VALUES (?, ?, ?, ?, ?, 'Aktif')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$calisanID, $sertifikaTurID, $verilisTarihi, $bitisTarihi, $seviye]);

        echo json_encode(["message" => "Sağlık sertifikası başarıyla eklendi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["error" => "Ekleme Hatası: " . $e->getMessage()]);
    }
}

if ($method === 'GET' && $action === 'get_single' && $certificate_id) {
    try {
        $sql = "SELECT ID AS id, CalisanID AS employee_id, SertifikaTurID AS certificate_type_id, VerilisTarihi AS issue_date, BitisTarihi AS expiry_date, Seviye AS level FROM CalisanSertifika WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$certificate_id]);
        echo json_encode($stmt->fetch());
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Sertifika detayı getirilemedi."]);
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
        echo json_encode(["message" => "Sağlık sertifikası başarıyla güncellendi."]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => "Güncelleme hatası oluştu."]);
    }
}