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
    $sql = "SELECT ID AS id, DepartmanAdı AS department_name, Açıklama AS description FROM Departman";
    $stmt = $pdo->query($sql);
    $departments = $stmt->fetchAll();

    echo json_encode($departments);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Departman listesi çekilemedi: " . $e->getMessage()]);
}