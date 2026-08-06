namespace desktop
{
    public class LoginRequest
    {
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }

    public class UserData
    {
        public int id { get; set; }
        public string? tc_no { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? name { get; set; }
        public string? email { get; set; }
        public string? phone_number { get; set; }
        public string? role { get; set; }
        public string? role_name { get; set; }
        public string? department_name { get; set; }
        public string? gender { get; set; }
        public string? status { get; set; }
    }

    public class LoginResponse
    {
        public UserData? user { get; set; }
        public string? error { get; set; }
        public string? message { get; set; }

    }

    public class ExaminationData
    {
        public int id { get; set; }
        public int employee_id { get; set; }
        public int doctor_id { get; set; }
        public string? exam_date { get; set; }
        public string? exam_type { get; set; }
        public string? result { get; set; }
        public string? description { get; set; }
        public string? doctor_name { get; set; }
    }

    public class CertificateType
    {
        public int id { get; set; }
        public string? name { get; set; }
    }

    public class HealthCertificateData
    {
        public int id { get; set; }
        public int employee_id { get; set; }
        public int certificate_type_id { get; set; }
        public string? certificate_name { get; set; }
        public string? issue_date { get; set; }
        public string? expiry_date { get; set; }
        public string? description { get; set; }
        public string? level { get; set; }
    }
}