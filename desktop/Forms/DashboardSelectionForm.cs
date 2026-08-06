using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using desktop.Components.Molecules;

namespace desktop.Forms
{
    public partial class DashboardSelectionForm : Form
    {
        private string systemRole;
        private Header header = null!;
        private Label lblSubTitle = null!;
        private TableLayoutPanel gridPanel = null!;

        private class PanelItem
        {
            public string Id { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public List<string> AllowedRoles { get; set; } = new List<string>();
        }

        public DashboardSelectionForm(string role = "calısan")
        {
            this.systemRole = role.ToLower();
            InitializeComponent();
            BuildDashboardSelectionUI();
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "ERP Kontrol Merkezi - Modül Seçimi";
            this.BackColor = Color.FromArgb(248, 250, 252); 
        }

        private void BuildDashboardSelectionUI()
        {
            header = new Header("ERP Kontrol Merkezi", "#1e293b")
            {
                BackButtonText = "Çıkış Yap",
                ShowBackButton = true
            };
            header.OnBackClick += (s, e) =>
            {
                LoginFormPage loginPage = new LoginFormPage();
                loginPage.Show();
                this.Close();
            };

            lblSubTitle = new Label
            {
                Text = "Lütfen Giriş Yapmak İstediğiniz Modülü Seçin",
                Font = new Font("Arial", 14f, FontStyle.Bold),
                ForeColor = Color.FromArgb(51, 65, 85), 
                TextAlign = ContentAlignment.MiddleCenter,
                Dock = DockStyle.Top,
                Height = 60
            };

            List<PanelItem> allPanels = new List<PanelItem>
            {
                new PanelItem
                {
                    Id = "admin_panel",
                    Title = "Sistem Yönetim Paneli",
                    Description = "Tüm sistem ayarları, loglar ve tam yetkili kontrol merkezi.",
                    AllowedRoles = new List<string> { "admin" }
                },
                new PanelItem
                {
                    Id = "hr_panel",
                    Title = "İnsan Kaynakları Paneli",
                    Description = "Personel kayıtları, işe alım, maaş ve özlük işleri yönetimi.",
                    AllowedRoles = new List<string> { "admin", "ik" }
                },
                new PanelItem
                {
                    Id = "qc_panel",
                    Title = "Kalite Kontrol Paneli",
                    Description = "Kaynakçı sertifikasyonları, teknik belgeler ve kalite takibi.",
                    AllowedRoles = new List<string> { "admin", "kk", "kalite" }
                },
                new PanelItem
                {
                    Id = "infirmary_panel",
                    Title = "Sağlık İşleri Paneli",
                    Description = "Periyodik muayeneler, ağır iş görebilir raporları ve sağlık takibi.",
                    AllowedRoles = new List<string> { "admin", "revir" }
                },
                new PanelItem
                {
                    Id = "employee_panel",
                    Title = "Kişisel Çalışan Portalı",
                    Description = "Kendi profil bilgileriniz, sertifikalarınız ve departman talepleriniz.",
                    AllowedRoles = new List<string> { "admin", "ik", "revir", "kk", "kalite", "calısan" }
                }
            };

            var accessiblePanels = allPanels
                .Where(p => p.AllowedRoles.Contains(systemRole))
                .ToList();

            gridPanel = new TableLayoutPanel
            {
                ColumnCount = 2,
                RowCount = (int)Math.Ceiling(accessiblePanels.Count / 2.0),
                Dock = DockStyle.Fill,
                Padding = new Padding(30, 10, 30, 30),
                AutoScroll = true
            };
            gridPanel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50f));
            gridPanel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50f));

            foreach (var panelData in accessiblePanels)
            {
                Panel card = CreateModuleCard(panelData);
                gridPanel.Controls.Add(card);
            }
            this.Controls.Add(gridPanel);
            this.Controls.Add(lblSubTitle);
            this.Controls.Add(header);
        }

        private Panel CreateModuleCard(PanelItem item)
        {
            Panel card = new Panel
            {
                Height = 120,
                Margin = new Padding(10),
                Padding = new Padding(20),
                BackColor = Color.White,
                Cursor = Cursors.Hand,
                Dock = DockStyle.Top
            };

            Label lblTitle = new Label
            {
                Text = item.Title,
                Font = new Font("Arial", 12f, FontStyle.Bold),
                ForeColor = Color.FromArgb(30, 41, 59), 
                Location = new Point(15, 15),
                AutoSize = true
            };

            Label lblDesc = new Label
            {
                Text = item.Description,
                Font = new Font("Arial", 9.5f, FontStyle.Regular),
                ForeColor = Color.FromArgb(100, 116, 139), 
                Location = new Point(15, 45),
                Size = new Size(380, 50),
                MaximumSize = new Size(380, 50)
            };

            card.Controls.Add(lblTitle);
            card.Controls.Add(lblDesc);

            Color borderColor = Color.FromArgb(226, 232, 240);

            card.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, card.ClientRectangle,
                    borderColor, 1, ButtonBorderStyle.Solid,
                    borderColor, 1, ButtonBorderStyle.Solid,
                    borderColor, 1, ButtonBorderStyle.Solid,
                    borderColor, 1, ButtonBorderStyle.Solid);
            };

            EventHandler onHover = (s, e) =>
            {
                borderColor = Color.FromArgb(59, 130, 246);
                card.Invalidate();
            };

            EventHandler onLeave = (s, e) =>
            {
                borderColor = Color.FromArgb(226, 232, 240);
                card.Invalidate();
            };

            EventHandler onClick = (s, e) =>
            {
                HandleModuleNavigation(item.Id);
            };

            card.MouseEnter += onHover;
            lblTitle.MouseEnter += onHover;
            lblDesc.MouseEnter += onHover;

            card.MouseLeave += onLeave;
            lblTitle.MouseLeave += onLeave;
            lblDesc.MouseLeave += onLeave;

            card.Click += onClick;
            lblTitle.Click += onClick;
            lblDesc.Click += onClick;

            return card;
        }

        private void HandleModuleNavigation(string panelId)
        {
            switch (panelId)
            {
                case "infirmary_panel":
                    InfirmaryPanelForm infirmaryForm = new InfirmaryPanelForm();
                    infirmaryForm.Show();
                    this.Hide();
                    break;
                case "qc_panel":
                    MessageBox.Show("Kalite Kontrol Modülüne Yönlendiriliyorsunuz...", "Modül Geçişi", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    
                    break;

                default:
                    MessageBox.Show($"{panelId} modülü hazır değil.", "Bilgi", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    break;
            }
        }
    }
}