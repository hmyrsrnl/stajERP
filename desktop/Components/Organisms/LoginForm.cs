using System;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;
using desktop.Components.Molecules;

namespace desktop.Components.Organisms
{
    public class LoginForm : Panel
    {
        private FormField fieldEmail;
        private FormField fieldPassword;
        private CustomButton btnSubmit;
        private Label lblError;

        public event EventHandler<LoginEventArgs>? OnSubmit;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ErrorMessage
        {
            get => lblError.Text;
            set
            {
                lblError.Text = value;
                lblError.Visible = !string.IsNullOrEmpty(value);
            }
        }

        public LoginForm()
        {
            this.Size = new Size(340, 270);
            this.BackColor = Color.Transparent;

            lblError = new Label
            {
                ForeColor = Color.Red,
                Font = new Font("Arial", 9f, FontStyle.Bold),
                Location = new Point(0, 0),
                Size = new Size(340, 25),
                TextAlign = ContentAlignment.MiddleCenter,
                Visible = false
            };
            fieldEmail = new FormField("E-posta")
            {
                Location = new Point(0, 30),
                Placeholder = "ornek@firma.com"
            };

            fieldPassword = new FormField("Şifre", isPassword: true)
            {
                Location = new Point(0, 95),
                Placeholder = "******"
            };

            btnSubmit = new CustomButton
            {
                Text = "Giriş Yap",
                Location = new Point(0, 170),
                Width = 340,
                Height = 42,
                BackColor = Color.FromArgb(239, 78, 225)
            };
            btnSubmit.Click += (s, e) =>
            {
                OnSubmit?.Invoke(this, new LoginEventArgs(fieldEmail.Value, fieldPassword.Value));
            };

            this.Controls.Add(lblError);
            this.Controls.Add(fieldEmail);
            this.Controls.Add(fieldPassword);
            this.Controls.Add(btnSubmit);
        }

        public void SetLoading(bool isLoading)
        {
            btnSubmit.Enabled = !isLoading;
            btnSubmit.Text = isLoading ? "Giriş Yapılıyor..." : "Giriş Yap";
        }
    }

    public class LoginEventArgs : EventArgs
    {
        public string Email { get; }
        public string Password { get; }

        public LoginEventArgs(string email, string password)
        {
            Email = email;
            Password = password;
        }
    }
}