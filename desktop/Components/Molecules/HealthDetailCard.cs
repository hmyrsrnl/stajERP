using System;
using System.Drawing;
using System.Windows.Forms;

namespace desktop.Components.Molecules
{
    public class HealthDetailCard : Panel
    {
        private Label lblTitle;
        private Label lblName;
        private Label lblTc;
        private Label lblDeptRole;
        private Label lblPhone;
        private Label lblEmail;
        private Label lblHireDate;

        public HealthDetailCard()
        {
            this.BackColor = Color.FromArgb(223, 249, 246); 
            this.Padding = new Padding(20, 15, 20, 15);
            this.Size = new Size(500, 230);
            this.Margin = new Padding(0, 0, 0, 20);

            lblTitle = new Label
            {
                Text = "Personel Sağlık Kimlik Bilgileri",
                Font = new Font("Arial", 12f, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 76, 67), 
                AutoSize = true,
                Location = new Point(20, 15)
            };

            lblName = CreateDataLabel("Adı Soyadı: -", 50);
            lblTc = CreateDataLabel("T.C. Kimlik No: -", 78);
            lblDeptRole = CreateDataLabel("Departman / Unvan: -", 106);
            lblPhone = CreateDataLabel("İletişim Numarası: -", 134);
            lblEmail = CreateDataLabel("Kurumsal E-posta: -", 162);
            lblHireDate = CreateDataLabel("İşe Başlangıç Tarihi: -", 190);

            this.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, this.ClientRectangle,
                    Color.FromArgb(225, 190, 231), 1, ButtonBorderStyle.Solid, 
                    Color.FromArgb(225, 190, 231), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(225, 190, 231), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(225, 190, 231), 1, ButtonBorderStyle.Solid);
            };

            this.Controls.Add(lblTitle);
            this.Controls.Add(lblName);
            this.Controls.Add(lblTc);
            this.Controls.Add(lblDeptRole);
            this.Controls.Add(lblPhone);
            this.Controls.Add(lblEmail);
            this.Controls.Add(lblHireDate);
        }

        private Label CreateDataLabel(string text, int top)
        {
            return new Label
            {
                Text = text,
                Font = new Font("Arial", 9.5f, FontStyle.Regular),
                ForeColor = Color.FromArgb(33, 37, 41),
                AutoSize = true,
                Location = new Point(20, top)
            };
        }

        public void SetEmployeeData(UserData emp)
        {
            if (emp == null) return;

            string fullName = !string.IsNullOrEmpty(emp.first_name) || !string.IsNullOrEmpty(emp.last_name)
                ? $"{emp.first_name} {emp.last_name}".Trim()
                : (emp.name ?? "-");

            lblName.Text = $"Adı Soyadı: {fullName}";
            lblTc.Text = $"T.C. Kimlik No: {emp.tc_no ?? "-"}";
            lblDeptRole.Text = $"Departman / Unvan: {emp.department_name ?? "-"} / {emp.role_name ?? emp.role ?? "-"}";
            lblPhone.Text = $"İletişim Numarası: {emp.phone_number ?? "-"}";
            lblEmail.Text = $"Kurumsal E-posta: {emp.email ?? "-"}";
            lblHireDate.Text = "İşe Başlangıç Tarihi: Girilmedi";
        }
    }
}