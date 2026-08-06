using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class ExaminationAddForm : Form
    {
        private int employeeId;
        private Header header = null!;
        private ExaminationForm examForm = null!;

        public ExaminationAddForm(int id)
        {
            this.employeeId = id;
            InitializeComponent();
            BuildUI();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "Yeni Muayene Girişi";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildUI()
        {
            header = new Header("Yeni Muayene Girişi", "#00796b")
            {
                BackButtonText = "İptal Et",
                ShowBackButton = true
            };
            header.OnBackClick += (s, e) =>
            {
                InfirmaryEmployeeDetailForm detailForm = new InfirmaryEmployeeDetailForm(employeeId);
                detailForm.Show();
                this.Close();
            };

            examForm = new ExaminationForm
            {
                Location = new Point(75, 80)
            };

            examForm.OnFormSubmit += async (s, formData) =>
            {
                var payload = new Dictionary<string, object>
                {
                    { "employee_id", employeeId },
                    { "doctor_id", 2 },
                    { "exam_type", formData.GetValueOrDefault("exam_type", "Günlük") },
                    { "result", formData.GetValueOrDefault("result", "") },
                    { "description", formData.GetValueOrDefault("description", "") }
                };

                var response = await ApiClient.PostAsync<Dictionary<string, object>, LoginResponse>("infirmary.php?action=add", payload);
                
                MessageBox.Show(response?.message ?? "Muayene kaydı başarıyla eklendi.", "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);

                InfirmaryEmployeeDetailForm detailForm = new InfirmaryEmployeeDetailForm(employeeId);
                detailForm.Show();
                this.Close();
            };

            this.Controls.Add(examForm);
            this.Controls.Add(header);
        }
    }
}