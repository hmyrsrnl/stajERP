using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Atoms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class InfirmaryPanelForm : Form
    {
        private List<UserData> rawEmployees = new List<UserData>();
        private List<UserData> filteredEmployees = new List<UserData>();

        private Header header = null!;
        private Panel mainContainer = null!;
        private FilterPanel filterPanel = null!;
        private EmployeeTable employeeTable = null!;
        private Panel rightContainer = null!;
        private System.Windows.Forms.Timer searchTimer = null!;

        private string searchTerm = "";
        private List<string> selectedGenders = new List<string>();
        private List<string> selectedDepartments = new List<string>();
        private List<string> selectedStatus = new List<string>();

        public InfirmaryPanelForm()
        {
            InitializeComponent();
            BuildInfirmaryUI();
            InitSearchTimer();

            this.Resize += (s, e) => CenterMainContainer();
            this.Load += (s, e) => CenterMainContainer();

            _ = FetchEmployeesDataAsync();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1100, 680);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "StajERP - Revir Yönetim Paneli";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildInfirmaryUI()
        {
            header = new Header("Revir Yönetim Paneli", "#4db6ac")
            {
                ShowBackButton = false
            };

            CustomButton btnLogout = new CustomButton
            {
                Text = "Çıkış",
                Width = 80,
                Height = 34,
                BackColor = Color.FromArgb(4, 141, 125),
                ForeColor = Color.White,
                Font = new Font("Arial", 8.5f, FontStyle.Bold)
            };
            btnLogout.Click += (s, e) =>
            {
                LoginFormPage loginPage = new LoginFormPage();
                loginPage.Show();
                this.Close();
            };
            header.AddActionButton(btnLogout);

            mainContainer = new Panel
            {
                Size = new Size(1040, 560),
                BackColor = Color.Transparent
            };

            filterPanel = new FilterPanel
            {
                Location = new Point(0, 0),
                Size = new Size(230, 560)
            };

            filterPanel.ConfigureVisibility(showGenders: true, showDepartments: true, showExport: true);

            filterPanel.OnSearchChanged += (s, text) =>
            {
                searchTerm = text;
                searchTimer.Stop();
                searchTimer.Start();
            };

            filterPanel.OnGenderChanged += (s, list) => { selectedGenders = list; ApplyLocalFilters(); };
            filterPanel.OnDepartmentChanged += (s, list) => { selectedDepartments = list; ApplyLocalFilters(); };
            filterPanel.OnStatusChanged += (s, list) => { selectedStatus = list; ApplyLocalFilters(); };
            filterPanel.OnExportClicked += (s, e) => ExportToCsvExcel();

            rightContainer = new Panel
            {
                Location = new Point(250, 0),
                Size = new Size(790, 560),
                BackColor = Color.FromArgb(248, 249, 250),
                Padding = new Padding(10)
            };

            rightContainer.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, rightContainer.ClientRectangle,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid);
            };

            employeeTable = new EmployeeTable
            {
                Dock = DockStyle.Fill
            };

            employeeTable.OnSelectEmployee += (s, emp) =>
            {
                InfirmaryEmployeeDetailForm detailForm = new InfirmaryEmployeeDetailForm(emp.id);
                detailForm.Show();
                this.Hide();
            };

            rightContainer.Controls.Add(employeeTable);

            mainContainer.Controls.Add(filterPanel);
            mainContainer.Controls.Add(rightContainer);

            this.Controls.Add(mainContainer);
            this.Controls.Add(header);

            CenterMainContainer();
        }

        private void CenterMainContainer()
        {
            if (mainContainer != null && header != null)
            {
                int availableHeight = this.ClientSize.Height - header.Height;

                int x = (this.ClientSize.Width - mainContainer.Width) / 2;
                int y = header.Height + ((availableHeight - mainContainer.Height) / 2);

                mainContainer.Location = new Point(Math.Max(10, x), Math.Max(header.Height + 10, y));
            }
        }


        private void InitSearchTimer()
        {
            searchTimer = new System.Windows.Forms.Timer { Interval = 300 };
            searchTimer.Tick += async (s, e) =>
            {
                searchTimer.Stop();
                await FetchEmployeesDataAsync();
            };
        }

        private async Task FetchEmployeesDataAsync()
        {
            string endpoint = $"employees.php?search={Uri.EscapeDataString(searchTerm)}";
            var result = await ApiClient.GetAsync<List<UserData>>(endpoint);

            rawEmployees = result ?? new List<UserData>();

            var departmentsList = rawEmployees
                .Select(e => e.department_name ?? e.role_name ?? e.role)
                .Where(d => !string.IsNullOrEmpty(d) && !d.Equals("Admin", StringComparison.OrdinalIgnoreCase))
                .OfType<string>()
                .Distinct()
                .ToList();

            if (departmentsList.Count > 0)
            {
                filterPanel.SetDepartments(departmentsList);
            }

            ApplyLocalFilters();
        }

        private void ApplyLocalFilters()
        {
            filteredEmployees = rawEmployees.Where(emp =>
            {
                string gender = emp.gender ?? "";
                bool matchesGender = selectedGenders.Count == 0 || selectedGenders.Contains(gender);

                string dept = emp.department_name ?? emp.role_name ?? emp.role ?? "";
                bool matchesDept = selectedDepartments.Count == 0 || selectedDepartments.Contains(dept);

                string status = emp.status ?? "";
                bool matchesStatus = selectedStatus.Count == 0 || selectedStatus.Contains(status);

                return matchesGender && matchesDept && matchesStatus;
            }).ToList();

            employeeTable.SetEmployees(filteredEmployees);
        }

        private void ExportToCsvExcel()
        {
            if (filteredEmployees.Count == 0)
            {
                MessageBox.Show("İndirilecek filtrelenmiş veri bulunamadı!", "Uyarı", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            SaveFileDialog sfd = new SaveFileDialog
            {
                Filter = "Excel CSV Dosyası (*.csv)|*.csv",
                FileName = "Revir_Personel_Listesi.csv"
            };

            if (sfd.ShowDialog() == DialogResult.OK)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("T.C. Kimlik No;Adı Soyadı;E-posta Adresi;Telefon Numarası;Unvan / Rol;Cinsiyet;Çalışan Durumu");

                foreach (var emp in filteredEmployees)
                {
                    sb.AppendLine($"{emp.tc_no ?? ""};{emp.name ?? ""};{emp.email ?? ""};{emp.phone_number ?? ""};{emp.role ?? ""};{emp.gender ?? ""};{emp.status ?? ""}");
                }

                File.WriteAllText(sfd.FileName, sb.ToString(), Encoding.UTF8);
                MessageBox.Show("Revir personel listesi başarıyla kaydedildi!", "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }
    }
}