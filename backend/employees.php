<?php
require_once 'config.php';

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if (($method === 'POST' && $action === 'delete') || $method === 'DELETE') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $employee_id = $data['id'] ?? $_POST['id'] ?? $_GET['id'] ?? null;

    if (!$employee_id) {
        http_response_code(400);
        echo json_encode([
            "error" => "Silinecek çalışanın ID bilgisi eksik!"
        ]);
        exit;
    }

    try {
        $sql = "DELETE FROM Calisan WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$employee_id]);

        echo json_encode(["message" => "Çalışan başarıyla sistemden silindi."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Silme hatası: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    try {
        if (!empty($search)) {
            $searchParam = $search . '%';

            $sql = "SELECT 
                        c.ID AS id,
                        c.TCKimlikNo AS tc_no,
                        c.Ad AS first_name,
                        c.Soyad AS last_name,
                        c.Cinsiyet AS gender,
                        c.Unvan AS role_name,
                        c.TelNo AS phone_number,
                        c.Maas AS salary,
                        c.Email AS email,
                        c.Adres AS home_address,
                        c.Status AS status,
                        c.IsBaslangicTarihi AS hire_date,   
                        c.Created_at AS created_at,        
                        c.Updated_at AS updated_at,        
                        d.DepartmanAdı AS department_name
                    FROM Calisan c
                    LEFT JOIN Departman d ON c.DepartmanID = d.ID
                    WHERE c.Ad LIKE :s1 
                       OR c.Soyad LIKE :s2 
                       OR CONCAT(c.Ad, ' ', c.Soyad) LIKE :s3
                    ORDER BY c.ID DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                's1' => $searchParam,
                's2' => $searchParam,
                's3' => $searchParam
            ]);
            $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $sql = "SELECT 
                        c.ID AS id,
                        c.TCKimlikNo AS tc_no,
                        c.Ad AS first_name,
                        c.Soyad AS last_name,
                        c.Cinsiyet AS gender,
                        c.Unvan AS role_name,
                        c.TelNo AS phone_number,
                        c.Email AS email,
                        c.Maas AS salary,
                        c.Adres AS home_address,
                        c.Status AS status,
                        c.IsBaslangicTarihi AS hire_date,   
                        c.Created_at AS created_at,        
                        c.Updated_at AS updated_at,        
                        d.DepartmanAdı AS department_name
                    FROM Calisan c
                    LEFT JOIN Departman d ON c.DepartmanID = d.ID
                    ORDER BY c.ID DESC";

            $stmt = $pdo->query($sql);
            $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($employees ? $employees : []);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Veritabanı hatası: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $tc_no             = $data['tc_no'] ?? '';
    $first_name        = $data['first_name'] ?? '';
    $last_name         = $data['last_name'] ?? '';
    $email             = $data['email'] ?? '';
    $password          = $data['password'] ?? '123456';
    $gender            = $data['gender'] ?? '';
    $phone_number      = $data['phone_number'] ?? '';
    $home_address      = $data['home_address'] ?? '';
    $unvan             = $data['role_name'] ?? 'Personel';
    $salary              = $data['salary'] ?? 17002.12;
    $departmanID       = $data['department_id'] ?? null;
    $system_role       = $data['system_role'] ?? 'calısan';
    $dogumTarihi       = $data['dogum_tarihi'] ?? '2000-01-01';
    $isBaslangicTarihi = date("Y-m-d");

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    if (empty($tc_no) || empty($first_name) || empty($last_name) || empty($email) || empty($phone_number)) {
        http_response_code(400);
        echo json_encode(["error" => "Lütfen zorunlu alanları doldurun!"]);
        exit;
    }

    try {
        $sql = "INSERT INTO Calisan (DepartmanID, TCKimlikNo, Ad, Soyad, Cinsiyet, DogumTarihi, IsBaslangicTarihi, Unvan, Maas, Adres, TelNo, Email, password, System_role, Status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aktif')";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $departmanID,
            $tc_no,
            $first_name,
            $last_name,
            $gender,
            $dogumTarihi,
            $isBaslangicTarihi,
            $unvan,
            $salary,
            $home_address,
            $phone_number,
            $email,
            $hashed_password,
            $system_role
        ]);

        echo json_encode(["message" => "Yeni çalışan başarıyla kaydedildi."]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["error" => "Kayıt hatası: " . $e->getMessage()]);
    }
    exit;
}
?>