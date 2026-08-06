using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class ExaminationHistoryForm : Form
    {
        private int employeeId;
        private string employeeName = "";

        private Header header = null!;
        private ExaminationTable examTable = null!;

        public ExaminationHistoryForm(int id)
        {
            this.employeeId = id;
            InitializeComponent();
            BuildUI();
            _ = LoadDataAsync();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "Muayene Geçmişi";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildUI()
        {
            header = new Header("Muayene Geçmişi", "#00796b")
            {
                BackButtonText = "Geri Dön",
                ShowBackButton = true
            };
            header.OnBackClick += (s, e) =>
            {
                InfirmaryEmployeeDetailForm detailForm = new InfirmaryEmployeeDetailForm(employeeId);
                detailForm.Show();
                this.Close();
            };

            Panel tableContainer = new Panel
            {
                Size = new Size(790, 440),
                Location = new Point(30, 90),
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

            examTable = new ExaminationTable
            {
                Dock = DockStyle.Fill
            };

            examTable.OnEditClick += (s, examId) =>
            {
                ExaminationEditForm editForm = new ExaminationEditForm(examId);
                editForm.Show();
                this.Hide();
            };

            examTable.OnDeleteClick += async (s, examId) =>
            {
                var result = MessageBox.Show("Muayene kaydını sistemden silmek istediğinize emin misiniz?", "Silme Onayı", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
                if (result == DialogResult.Yes)
                {
                    var payload = new Dictionary<string, int> { { "id", examId } };
                    await ApiClient.PostAsync<Dictionary<string, int>, LoginResponse>("infirmary.php?action=delete", payload);
                    await FetchExaminationsAsync();
                }
            };

            tableContainer.Controls.Add(examTable);
            this.Controls.Add(tableContainer);
            this.Controls.Add(header);
        }

        private async Task LoadDataAsync()
        {
            var empData = await ApiClient.GetAsync<UserData>($"employee_detail.php?id={employeeId}");
            if (empData != null)
            {
                string fullName = !string.IsNullOrEmpty(empData.first_name) ? $"{empData.first_name} {empData.last_name}" : (empData.name ?? "");
                if (!string.IsNullOrEmpty(fullName))
                {
                    header.Title = $"Muayene Geçmişi ({fullName})";
                }
            }

            await FetchExaminationsAsync();
        }

        private async Task FetchExaminationsAsync()
        {
            string endpoint = $"infirmary.php?action=list&employee_id={employeeId}";
            var examinations = await ApiClient.GetAsync<List<ExaminationData>>(endpoint);
            examTable.SetExaminations(examinations ?? new List<ExaminationData>());
        }
    }
}