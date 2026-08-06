using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using desktop.Components.Molecules;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class InfirmaryEmployeeDetailForm : Form
    {
        private int employeeId;
        private UserData? currentEmployee;

        private Header header = null!;
        private Panel cardContainer = null!;
        private HealthDetailCard healthDetailCard = null!;
        private InfirmaryActions infirmaryActions = null!;
        private Label lblLoading = null!;

        public InfirmaryEmployeeDetailForm(int id)
        {
            this.employeeId = id;
            InitializeComponent();
            BuildDetailUI();

            this.Resize += (s, e) => CenterControls();
            this.Load += (s, e) => CenterControls();

            _ = FetchEmployeeDetailAsync();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "Personel Sağlık Kartı Detayı";
            this.BackColor = Color.FromArgb(248, 250, 252);
        }

        private void BuildDetailUI()
        {
            header = new Header("Personel Sağlık Kartı Detayı", "#4db6ac")
            {
                BackButtonText = "Geri Dön",
                ShowBackButton = true
            };
            header.OnBackClick += (s, e) =>
            {
                InfirmaryPanelForm panelForm = new InfirmaryPanelForm();
                panelForm.Show();
                this.Close();
            };

            lblLoading = new Label
            {
                Text = "Sağlık kayıtları yükleniyor...",
                Font = new Font("Arial", 11f, FontStyle.Italic),
                ForeColor = Color.FromArgb(102, 102, 102),
                AutoSize = true
            };

            cardContainer = new Panel
            {
                Size = new Size(560, 430),
                BackColor = Color.White,
                Padding = new Padding(30),
                Visible = false
            };

            cardContainer.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, cardContainer.ClientRectangle,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid);
            };

            healthDetailCard = new HealthDetailCard
            {
                Location = new Point(30, 25)
            };

            infirmaryActions = new InfirmaryActions
            {
                Location = new Point(30, 275)
            };

            infirmaryActions.OnAddExaminationClick += (s, e) =>
            {
                ExaminationAddForm addForm = new ExaminationAddForm(employeeId);
                addForm.Show();
                this.Hide();
            };

            infirmaryActions.OnHistoryClick += (s, e) =>
            {
                ExaminationHistoryForm historyForm = new ExaminationHistoryForm(employeeId);
                historyForm.Show();
                this.Hide();
            };

            infirmaryActions.OnManageCertificatesClick += (s, e) =>
            {
                HealthCertificatesListForm certificatesForm = new HealthCertificatesListForm(employeeId);
                certificatesForm.Show();
                this.Hide();
            };

            cardContainer.Controls.Add(healthDetailCard);
            cardContainer.Controls.Add(infirmaryActions);

            this.Controls.Add(lblLoading);
            this.Controls.Add(cardContainer);
            this.Controls.Add(header);

            CenterControls();
        }

        private void CenterControls()
        {
            int headerHeight = header != null ? header.Height : 70;
            int availableHeight = this.ClientSize.Height - headerHeight;

            if (cardContainer != null)
            {
                int x = (this.ClientSize.Width - cardContainer.Width) / 2;
                int y = headerHeight + ((availableHeight - cardContainer.Height) / 2);
                cardContainer.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }

            if (lblLoading != null)
            {
                int x = (this.ClientSize.Width - lblLoading.Width) / 2;
                int y = headerHeight + ((availableHeight - lblLoading.Height) / 2);
                lblLoading.Location = new Point(Math.Max(0, x), Math.Max(headerHeight + 10, y));
            }
        }

        private async Task FetchEmployeeDetailAsync()
        {
            string endpoint = $"employee_detail.php?id={employeeId}";
            currentEmployee = await ApiClient.GetAsync<UserData>(endpoint);

            lblLoading.Visible = false;

            if (currentEmployee != null)
            {
                healthDetailCard.SetEmployeeData(currentEmployee);
                cardContainer.Visible = true;
                CenterControls(); 
            }
            else
            {
                lblLoading.Text = "Çalışan detay verileri alınamadı.";
                lblLoading.Visible = true;
                CenterControls();
            }
        }
    }
}