using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Atoms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class HealthCertificatesListForm : Form
    {
        private int employeeId;
        private string employeeName = "";

        private Header header = null!;
        private Panel tableContainer = null!;
        private HealthCertificatesTable certTable = null!;

        public HealthCertificatesListForm(int id)
        {
            this.employeeId = id;
            InitializeComponent();
            BuildUI();

            this.Resize += (s, e) => CenterControls();
            this.Load += (s, e) => CenterControls();

            _ = LoadDataAsync();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "Personel Sağlık Sertifikaları ve Raporları";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildUI()
        {
            header = new Header("Sağlık Sertifikaları", "#00796b")
            {
                ShowBackButton = false
            };

            CustomButton btnBack = new CustomButton
            {
                Text = "Geri Dön",
                Width = 90,
                Height = 34,
                BackColor = Color.FromArgb(108, 117, 125),
                ForeColor = Color.White,
                Font = new Font("Arial", 8.5f, FontStyle.Bold)
            };
            btnBack.Click += (s, e) =>
            {
                InfirmaryEmployeeDetailForm detailForm = new InfirmaryEmployeeDetailForm(employeeId);
                detailForm.Show();
                this.Close();
            };

            CustomButton btnAdd = new CustomButton
            {
                Text = "+ Yeni Sertifika",
                Width = 135,
                Height = 34,
                BackColor = Color.FromArgb(0, 137, 123),
                ForeColor = Color.White,
                Font = new Font("Arial", 8.5f, FontStyle.Bold)
            };
            btnAdd.Click += (s, e) =>
            {
                HealthCertificateAddForm addForm = new HealthCertificateAddForm(employeeId);
                addForm.Show();
                this.Hide();
            };

            header.AddActionButton(btnBack);
            header.AddActionButton(btnAdd);

            tableContainer = new Panel
            {
                Size = new Size(850, 480), 
                BackColor = Color.White,
                Padding = new Padding(15)
            };

            tableContainer.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, tableContainer.ClientRectangle,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid);
            };

            certTable = new HealthCertificatesTable
            {
                Dock = DockStyle.Fill
            };

            certTable.OnEditClick += (s, certId) =>
            {
                HealthCertificateEditForm editForm = new HealthCertificateEditForm(certId);
                editForm.Show();
                this.Hide();
            };

            certTable.OnDeleteClick += async (s, cert) =>
            {
                var confirm = MessageBox.Show($"\"{cert.certificate_name}\" isimli sağlık belgesini silmek istediğinize emin misiniz?", "Silme Onayı", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
                if (confirm == DialogResult.Yes)
                {
                    var payload = new Dictionary<string, int> { { "id", cert.id } };
                    await ApiClient.PostAsync<Dictionary<string, int>, LoginResponse>("health_certificates.php?action=delete", payload);
                    await FetchCertificatesAsync();
                }
            };

            certTable.OnNotificationClick += async (s, cert) =>
            {
                string msg = $"{cert.certificate_name} belgenizin süresi dolmak üzeredir. Lütfen revir ile iletişime geçiniz.";
                var payload = new Dictionary<string, object>
                {
                    { "employee_id", employeeId },
                    { "certificate_id", cert.id },
                    { "message", msg },
                    { "type", "Revir / Sağlık Uyarısı" }
                };

                await ApiClient.PostAsync<Dictionary<string, object>, LoginResponse>("notifications.php?action=send", payload);
                MessageBox.Show($"{employeeName} isimli çalışana bildirim başarıyla iletildi!", "Bildirim Gönderildi", MessageBoxButtons.OK, MessageBoxIcon.Information);
            };

            tableContainer.Controls.Add(certTable);
            this.Controls.Add(tableContainer);
            this.Controls.Add(header);

            CenterControls();
        }

        private void CenterControls()
        {
            if (tableContainer != null && header != null)
            {
                int headerHeight = header.Height;
                int availableHeight = this.ClientSize.Height - headerHeight;

                int x = (this.ClientSize.Width - tableContainer.Width) / 2;
                int y = headerHeight + ((availableHeight - tableContainer.Height) / 2);

                tableContainer.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }
        }

        private async Task LoadDataAsync()
        {
            var empData = await ApiClient.GetAsync<UserData>($"employee_detail.php?id={employeeId}");
            if (empData != null)
            {
                employeeName = !string.IsNullOrEmpty(empData.first_name) ? $"{empData.first_name} {empData.last_name}" : (empData.name ?? "");
                if (!string.IsNullOrEmpty(employeeName))
                {
                    header.Title = $"Sağlık Sertifikaları ({employeeName})";
                }
            }

            await FetchCertificatesAsync();
        }

        private async Task FetchCertificatesAsync()
        {
            string endpoint = $"health_certificates.php?action=list&employee_id={employeeId}";
            var certificates = await ApiClient.GetAsync<List<HealthCertificateData>>(endpoint);
            certTable.SetCertificates(certificates ?? new List<HealthCertificateData>());
        }
    }
}