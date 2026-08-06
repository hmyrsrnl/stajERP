using System;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Organisms;

namespace desktop.Forms
{
    public partial class LoginFormPage : Form
    {
        private Panel cardPanel = null!;
        private Label lblTitle = null!;
        private LoginForm loginForm = null!;

         public LoginFormPage()
        {
            InitializeComponent();

            this.Resize += (s, e) => CenterCardPanel();

            this.Load += (s, e) => CenterCardPanel();

            BuildPage();
             
        }

        private void CenterCardPanel()
        {
            if (cardPanel != null)
            {
                int x = (this.ClientSize.Width - cardPanel.Width) / 2;
                int y = (this.ClientSize.Height - cardPanel.Height) / 2;

                cardPanel.Location = new Point(Math.Max(0, x), Math.Max(0, y));
            }
        }

        private void InitializeComponent()
        {
            this.ClientSize = new Size(1000, 800);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Text = "ERP Giriş Paneli";
            this.BackColor = Color.FromArgb(245, 245, 245);
        }

        private void BuildPage()
        {
            cardPanel = new Panel
            {
                Size = new Size(400, 380),
                Location = new Point(50, 50),
                BackColor = Color.White
            };
            cardPanel.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, cardPanel.ClientRectangle,
                    Color.FromArgb(204, 204, 204), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(204, 204, 204), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(204, 204, 204), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(204, 204, 204), 1, ButtonBorderStyle.Solid);
            };

            lblTitle = new Label
            {
                Text = "ERP Giriş Paneli",
                Font = new Font("Arial", 16f, FontStyle.Bold),
                ForeColor = Color.FromArgb(244, 114, 233),
                Location = new Point(0, 25),
                Size = new Size(400, 35),
                TextAlign = ContentAlignment.MiddleCenter
            };

            loginForm = new LoginForm
            {
                Location = new Point(30, 75)
            };
            loginForm.OnSubmit += HandleLogin;

            cardPanel.Controls.Add(lblTitle);
            cardPanel.Controls.Add(loginForm);

            this.Controls.Add(cardPanel);
        }

        private async void HandleLogin(object? sender, LoginEventArgs e)
        {
            loginForm.ErrorMessage = "";

            if (string.IsNullOrEmpty(e.Email) || string.IsNullOrEmpty(e.Password))
            {
                loginForm.ErrorMessage = "Lütfen e-posta ve şifrenizi giriniz.";
                return;
            }

            loginForm.SetLoading(true);

            var loginData = new LoginRequest { email = e.Email, password = e.Password };
            var response = await ApiClient.PostAsync<LoginRequest, LoginResponse>("login.php", loginData);

            loginForm.SetLoading(false);

            if (response != null && response.user != null)
            {
                string role = response.user.role ?? "calısan";

                MessageBox.Show("Giriş başarıyla gerçekleşti! Kontrol merkezine yönlendiriliyorsunuz.",
                                "Başarılı", MessageBoxButtons.OK, MessageBoxIcon.Information);

                DashboardSelectionForm selectionForm = new DashboardSelectionForm(role);
                selectionForm.Show();
                this.Hide();
            }
            else
            {
                loginForm.ErrorMessage = response?.error ?? response?.message ?? "Giriş yapılırken bir hata oluştu veya sunucuya erişilemedi.";
            }
        }
    }
}