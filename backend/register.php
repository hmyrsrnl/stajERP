<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    $tc_no        = $data['tc_no'] ?? '';
    $first_name   = $data['first_name'] ?? '';
    $last_name    = $data['last_name'] ?? '';
    $email        = $data['email'] ?? '';
    $password     = $data['password'] ?? '';
    $phone_number = $data['phone_number'] ?? '';
    $home_address = $data['home_address'] ?? '';
    $dogumTarihi      = $data['dogum_tarihi'] ?? '2000-01-01'; 

    $isBaslangicTarihi = date("Y-m-d"); 
    $departmanID       = null; 
    $unvan             = 'Yeni Personel';
    $maas              = 17002.12; 

    

    if (empty($tc_no) || empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($phone_number) ) {
        http_response_code(400);
        echo json_encode(["error" => "Lütfen kayıt formundaki tüm alanları eksiksiz doldurun!"]);
        exit;
    }

    if (strlen($tc_no) !== 11) {
        http_response_code(400);
        echo json_encode(["error" => "T.C. Kimlik Numarası 11 hane olmalıdır!"]);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        $sql = "INSERT INTO Calisan (DepartmanID, TCKimlikNo, Ad, Soyad, DogumTarihi, IsBaslangicTarihi, Unvan, Maas, Adres, TelNo, Email, password, System_role, Status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'calısan', 'Aktif')";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $departmanID,
            $tc_no,
            $first_name,
            $last_name,
            $dogumTarihi,
            $isBaslangicTarihi,
            $unvan,
            $maas,
            $home_address,
            $phone_number,
            $email,
            $hashed_password 
        ]);

        echo json_encode(["message" => "Sisteme kaydınız başarıyla tamamlandı! Giriş yapabilirsiniz."]);
    } catch (PDOException $e) {
        http_response_code(400);
        if ($e->getCode() == 23000) {
            echo json_encode(["error" => "Bu T.C. Kimlik Numarası veya E-posta adresi zaten kullanımda!"]);
        } else {
            echo json_encode(["error" => "Veritabanı Hatası: " . $e->getMessage()]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Geçersiz Metod!"]);
}