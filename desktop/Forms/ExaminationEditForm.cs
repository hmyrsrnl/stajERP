using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class ExaminationEditForm : Form
    {
        private int examinationId;
        private int employeeId;

        private Header header = null!;
        private ExaminationForm examForm = null!;
        private Label lblLoading = null!;

        public ExaminationEditForm(int examId)
        {
            this.examinationId = examId;
            InitializeComponent();
            BuildUI();

            this.Resize += (s, e) => CenterControls();
            this.Load += (s, e) => CenterControls();

            _ = FetchExaminationDetailAsync();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "Muayene Kaydı Düzenleme";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildUI()
        {
            header = new Header("Muayene Kaydı Düzenleme", "#00796b")
            {
                BackButtonText = "Geri Dön",
                ShowBackButton = true
            };
            header.OnBackClick += (s, e) =>
            {
                ExaminationHistoryForm historyForm = new ExaminationHistoryForm(employeeId);
                historyForm.Show();
                this.Close();
            };

            lblLoading = new Label
            {
                Text = "Muayene bilgileri yükleniyor...",
                Font = new Font("Arial", 11f, FontStyle.Italic),
                ForeColor = Color.FromArgb(102, 102, 102),
                AutoSize = true
            };

            examForm = new ExaminationForm
            {
                Visible = false
            };

            examForm.OnFormSubmit += async (s, formData) =>
            {
                string endpoint = $"infirmary.php?action=update&examination_id={examinationId}";
                var response = await ApiClient.PostAsync<Dictionary<string, string>, LoginResponse>(endpoint, formData);

                MessageBox.Show(response?.message ?? "Muayene kaydı başarıyla güncellendi.", "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);

                ExaminationHistoryForm historyForm = new ExaminationHistoryForm(employeeId);
                historyForm.Show();
                this.Close();
            };

            this.Controls.Add(lblLoading);
            this.Controls.Add(examForm);
            this.Controls.Add(header);

            CenterControls();
        }

        private void CenterControls()
        {
            if (header == null) return;

            int headerHeight = header.Height;
            int availableHeight = this.ClientSize.Height - headerHeight;

            if (examForm != null)
            {
                int x = (this.ClientSize.Width - examForm.Width) / 2;
                int y = headerHeight + ((availableHeight - examForm.Height) / 2);
                examForm.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }

            if (lblLoading != null)
            {
                int x = (this.ClientSize.Width - lblLoading.Width) / 2;
                int y = headerHeight + ((availableHeight - lblLoading.Height) / 2);
                lblLoading.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }
        }

        private async Task FetchExaminationDetailAsync()
        {
            string endpoint = $"infirmary.php?action=get_single&examination_id={examinationId}";
            var data = await ApiClient.GetAsync<Dictionary<string, object>>(endpoint);

            lblLoading.Visible = false;

            if (data != null)
            {
                if (data.TryGetValue("employee_id", out var empIdObj) && int.TryParse(empIdObj?.ToString(), out int parsedId))
                {
                    employeeId = parsedId;
                }

                examForm.Visible = true;
                CenterControls();
            }
            else
            {
                lblLoading.Text = "Muayene detayı getirilemedi.";
                lblLoading.Visible = true;
                CenterControls();
            }
        }
    }
}