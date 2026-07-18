<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'config.php';
header('Content-Type: application/json');

try {
    $emp_query = $pdo->query("SELECT COUNT(*) as total FROM Calisan");
    $total_employees = $emp_query->fetch(PDO::FETCH_ASSOC)['total'];

    $dept_query = $pdo->query("SELECT COUNT(*) as total FROM Departman");
    $total_departments = $dept_query->fetch(PDO::FETCH_ASSOC)['total'];

    $req_query = $pdo->query("SELECT COUNT(*) as total FROM Talep WHERE Durum = 'Beklemede'");
    $pending_requests = $req_query->fetch(PDO::FETCH_ASSOC)['total'];

    $cert_query = $pdo->query("SELECT COUNT(*) as total FROM CalisanSertifika WHERE Durum = 'Aktif'");
    $active_certificates = $cert_query->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        "totalEmployees" => (int)$total_employees,
        "totalDepartments" => (int)$total_departments,
        "pendingRequests" => (int)$pending_requests,
        "activeCertificates" => (int)$active_certificates
      ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "İstatistikler çekilirken veritabanı hatası oluştu: " . $e->getMessage()]);
}