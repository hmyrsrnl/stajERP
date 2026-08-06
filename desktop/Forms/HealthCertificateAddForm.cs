using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class HealthCertificateAddForm : Form
    {
        private int employeeId;
        private Header header = null!;
        private HealthForm healthForm = null!;

        public HealthCertificateAddForm(int id)
        {
            this.employeeId = id;
            InitializeComponent();
            BuildUI();

            this.Resize += (s, e) => CenterControls();
            this.Load += (s, e) => CenterControls();

            _ = LoadTypesAsync();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "Yeni Sağlık Raporu / Sertifikası Ekle";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildUI()
        {
            header = new Header("Yeni Sağlık Raporu / Sertifikası Ekle", "#00796b")
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

            healthForm = new HealthForm();

            healthForm.OnFormSubmit += async (s, formData) =>
            {
                if (DateTime.TryParse(formData["expiryDate"]?.ToString(), out DateTime expiry) &&
                    DateTime.TryParse(formData["issueDate"]?.ToString(), out DateTime issue))
                {
                    if (expiry <= issue)
                    {
                        MessageBox.Show("Hata: Geçerlilik bitiş tarihi, veriliş tarihinden sonraki bir tarih olmalıdır!", "Uyarı", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }
                }

                var data = new Dictionary<string, object>
                {
                    { "employee_id", employeeId },
                    { "certificate_type_id", formData["certificateTypeId"] },
                    { "issue_date", formData["issueDate"] },
                    { "expiry_date", formData["expiryDate"] },
                    { "description", formData["description"] },
                    { "level", "Sağlık Onaylı" }
                };

                var res = await ApiClient.PostAsync<Dictionary<string, object>, LoginResponse>("health_certificates.php?action=add", data);
                MessageBox.Show(res?.message ?? "Sağlık sertifikası başarıyla eklendi.", "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);

                HealthCertificatesListForm listForm = new HealthCertificatesListForm(employeeId);
                listForm.Show();
                this.Close();
            };

            this.Controls.Add(healthForm);
            this.Controls.Add(header);

            CenterControls();
        }

        private void CenterControls()
        {
            if (healthForm != null && header != null)
            {
                int headerHeight = header.Height;
                int availableHeight = this.ClientSize.Height - headerHeight;

                int x = (this.ClientSize.Width - healthForm.Width) / 2;
                int y = headerHeight + ((availableHeight - healthForm.Height) / 2);

                healthForm.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }
        }

        private async Task LoadTypesAsync()
        {
            var types = await ApiClient.GetAsync<List<CertificateType>>("health_certificates.php?action=get_types");
            if (types != null)
            {
                healthForm.SetCertificateTypes(types, "name", "id");
            }
        }
    }
}