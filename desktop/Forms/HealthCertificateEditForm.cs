using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class HealthCertificateEditForm : Form
    {
        private int certificateId;
        private int employeeId;
        private Header header = null!;
        private HealthForm healthForm = null!;
        private Label lblLoading = null!;

        public HealthCertificateEditForm(int certId)
        {
            this.certificateId = certId;
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
            this.Text = "Sağlık Sertifikası Düzenleme";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildUI()
        {
            header = new Header("Sağlık Sertifikası Düzenleme", "#00796b")
            {
                BackButtonText = "İptal",
                ShowBackButton = true
            };
            header.OnBackClick += (s, e) =>
            {
                HealthCertificatesListForm listForm = new HealthCertificatesListForm(employeeId);
                listForm.Show();
                this.Close();
            };

            lblLoading = new Label
            {
                Text = "Sertifika bilgileri yükleniyor...",
                Font = new Font("Arial", 11f, FontStyle.Italic),
                ForeColor = Color.FromArgb(102, 102, 102),
                AutoSize = true
            };

            healthForm = new HealthForm
            {
                Visible = false
            };

            healthForm.OnFormSubmit += async (s, formData) =>
            {
                var data = new Dictionary<string, object?>
                {
                    { "certificate_type_id", formData["certificateTypeId"] },
                    { "issue_date", formData["issueDate"] },
                    { "expiry_date", formData["expiryDate"] },
                    { "description", formData["description"] }
                };

                string endpoint = $"health_certificates.php?action=update&certificate_id={certificateId}";
                var res = await ApiClient.PostAsync<Dictionary<string, object?>, LoginResponse>(endpoint, data);
                
                MessageBox.Show(res?.message ?? "Sağlık sertifikası güncellendi.", "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);

                HealthCertificatesListForm listForm = new HealthCertificatesListForm(employeeId);
                listForm.Show();
                this.Close();
            };

            this.Controls.Add(lblLoading);
            this.Controls.Add(healthForm);
            this.Controls.Add(header);

            CenterControls();
        }

        private void CenterControls()
        {
            if (header == null) return;

            int headerHeight = header.Height;
            int availableHeight = this.ClientSize.Height - headerHeight;

            if (healthForm != null)
            {
                int x = (this.ClientSize.Width - healthForm.Width) / 2;
                int y = headerHeight + ((availableHeight - healthForm.Height) / 2);
                healthForm.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }

            if (lblLoading != null)
            {
                int x = (this.ClientSize.Width - lblLoading.Width) / 2;
                int y = headerHeight + ((availableHeight - lblLoading.Height) / 2);
                lblLoading.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }
        }

        private async Task LoadDataAsync()
        {
            var types = await ApiClient.GetAsync<List<CertificateType>>("health_certificates.php?action=get_types");
            if (types != null) healthForm.SetCertificateTypes(types, "name", "id");

            string endpoint = $"health_certificates.php?action=get_single&certificate_id={certificateId}";
            var certData = await ApiClient.GetAsync<HealthCertificateData>(endpoint);

            lblLoading.Visible = false;
            if (certData != null)
            {
                employeeId = certData.employee_id;
                healthForm.Visible = true;
                CenterControls();
            }
            else
            {
                lblLoading.Text = "Sertifika bilgisi yüklenemedi.";
                lblLoading.Visible = true;
                CenterControls();
            }
        }
    }
}