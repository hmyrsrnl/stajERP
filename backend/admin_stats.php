<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'config.php';
header('Content-Type: application/json; charset=UTF-8');

$response = [
    "activeEmployees" => 0,
    "passiveEmployees" => 0,
    "monthlyExamsCount" => 0,
    "riskCertificatesCount" => 0,
    "totalSalaryBudget" => 0,
    "departmentDistribution" => [],
    "certRiskStatus" => ["active" => 0, "warning" => 0, "expired" => 0],
    "riskCertificatesList" => [],
    "examTrend" => [],
    "deptSalaryDistribution" => [],
    "roleDistribution" => []
];

try {
    try {
        $emp_stmt = $pdo->query("
            SELECT 
                SUM(CASE WHEN Status = 'Aktif' THEN 1 ELSE 0 END) as active_count,
                SUM(CASE WHEN Status = 'Pasif' THEN 1 ELSE 0 END) as passive_count,
                SUM(COALESCE(Maas, 0)) as total_salary
            FROM Calisan
        ");
        $emp_data = $emp_stmt->fetch(PDO::FETCH_ASSOC);

        $response["activeEmployees"] = (int)($emp_data['active_count'] ?? 0);
        $response["passiveEmployees"] = (int)($emp_data['passive_count'] ?? 0);
        $response["totalSalaryBudget"] = (float)($emp_data['total_salary'] ?? 0);
    } catch (Exception $e) {}

    try {
        $first_day_of_month = date('Y-m-01');
        $exam_stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Muayene WHERE MuayeneTarihi >= ?");
        $exam_stmt->execute([$first_day_of_month]);
        $response["monthlyExamsCount"] = (int)($exam_stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0);
    } catch (Exception $e) {}

    try {
        $exam_trend_sql = "
            SELECT 
                DATE_FORMAT(MuayeneTarihi, '%m') as month_num,
                COUNT(*) as count 
            FROM Muayene 
            GROUP BY month_num
            ORDER BY month_num ASC
        ";
        $exam_trend_res = $pdo->query($exam_trend_sql)->fetchAll(PDO::FETCH_ASSOC);

        $month_names = [
            "01" => "Oca", "02" => "Şub", "03" => "Mar", "04" => "Nis", 
            "05" => "May", "06" => "Haz", "07" => "Tem", "08" => "Ağu", 
            "09" => "Eyl", "10" => "Eki", "11" => "Kas", "12" => "Ara"
        ];

        $formatted_trend = [];
        foreach ($exam_trend_res as $row) {
            $m_code = $row['month_num'];
            if ($m_code && isset($month_names[$m_code])) {
                $formatted_trend[] = [
                    "month" => $month_names[$m_code],
                    "count" => (int)$row['count']
                ];
            }
        }
        $response["examTrend"] = $formatted_trend;
    } catch (Exception $e) {}

    try {
        $today = date('Y-m-d');
        $thirty_days_later = date('Y-m-d', strtotime('+30 days'));

        $cert_stat_stmt = $pdo->query("
            SELECT 
                SUM(CASE WHEN BitisTarihi > '$thirty_days_later' AND Durum = 'Aktif' THEN 1 ELSE 0 END) as active_count,
                SUM(CASE WHEN BitisTarihi >= '$today' AND BitisTarihi <= '$thirty_days_later' AND Durum = 'Aktif' THEN 1 ELSE 0 END) as warning_count,
                SUM(CASE WHEN BitisTarihi < '$today' OR Durum = 'Pasif' THEN 1 ELSE 0 END) as expired_count
            FROM CalisanSertifika
        ");
        $cert_stats = $cert_stat_stmt->fetch(PDO::FETCH_ASSOC);

        $response["certRiskStatus"] = [
            "active" => (int)($cert_stats['active_count'] ?? 0),
            "warning" => (int)($cert_stats['warning_count'] ?? 0),
            "expired" => (int)($cert_stats['expired_count'] ?? 0)
        ];
        $response["riskCertificatesCount"] = $response["certRiskStatus"]["warning"] + $response["certRiskStatus"]["expired"];

        $risk_list_stmt = $pdo->query("
            SELECT 
                cs.ID, 
                CONCAT(c.Ad, ' ', c.Soyad) as employee_name, 
                st.SertifikaAdi as certificate_name, 
                cs.BitisTarihi as expiry_date, 
                cs.Durum as status
            FROM CalisanSertifika cs
            JOIN Calisan c ON cs.CalisanID = c.ID
            JOIN SertifikaTur st ON cs.SertifikaTurID = st.ID
            WHERE cs.BitisTarihi <= '$thirty_days_later' OR cs.Durum = 'Pasif'
            ORDER BY cs.BitisTarihi ASC
        ");
        $response["riskCertificatesList"] = $risk_list_stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {}

    try {
        $dept_stmt = $pdo->query("
            SELECT COALESCE(d.DepartmanAdı, 'Atanmamış') as dept_name, COUNT(c.ID) as count 
            FROM Calisan c 
            LEFT JOIN Departman d ON c.DepartmanID = d.ID 
            GROUP BY d.ID, d.DepartmanAdı
        ");
        $response["departmentDistribution"] = $dept_stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {}

    try {
        $dept_salary_stmt = $pdo->query("
            SELECT COALESCE(d.DepartmanAdı, 'Atanmamış') as dept_name, SUM(COALESCE(c.Maas, 0)) as total_salary 
            FROM Calisan c 
            LEFT JOIN Departman d ON c.DepartmanID = d.ID 
            GROUP BY d.ID, d.DepartmanAdı
        ");
        $response["deptSalaryDistribution"] = $dept_salary_stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {}

    try {
        $role_stmt = $pdo->query("SELECT System_role as role_name, COUNT(*) as count FROM Calisan GROUP BY System_role");
        $response["roleDistribution"] = $role_stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {}

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(200); 
    echo json_encode($response);
}
?>