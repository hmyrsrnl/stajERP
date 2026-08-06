using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Organisms
{
    public class HealthForm : Panel
    {
        private ComboBox cbTypes;
        private DateTimePicker dtpIssueDate;
        private DateTimePicker dtpExpiryDate;
        private TextBox txtDescription;
        private CustomButton btnSubmit;

        public event EventHandler<Dictionary<string, object>>? OnFormSubmit;

        public HealthForm()
        {
            this.Width = 450;
            this.AutoSize = true;
            this.BackColor = Color.FromArgb(248, 249, 250);
            this.Padding = new Padding(25);

            Label lblType = CreateLabel("Sertifika / Rapor Türü", 15);
            cbTypes = new ComboBox
            {
                Location = new Point(25, 40),
                Width = 400,
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Arial", 9.5f)
            };

            Label lblIssue = CreateLabel("Veriliş Tarihi", 80);
            dtpIssueDate = new DateTimePicker
            {
                Location = new Point(25, 105),
                Width = 400,
                Format = DateTimePickerFormat.Short,
                Font = new Font("Arial", 9.5f)
            };

            Label lblExpiry = CreateLabel("Geçerlilik Bitiş Tarihi", 145);
            dtpExpiryDate = new DateTimePicker
            {
                Location = new Point(25, 170),
                Width = 400,
                Format = DateTimePickerFormat.Short,
                Font = new Font("Arial", 9.5f)
            };

            Label lblDesc = CreateLabel("Rapor Açıklama Notu", 210);
            txtDescription = new TextBox
            {
                Location = new Point(25, 235),
                Width = 400,
                Height = 80,
                Multiline = true,
                Font = new Font("Arial", 9.5f)
            };

            btnSubmit = new CustomButton
            {
                Text = "Kaydet",
                Width = 400,
                Height = 40,
                Location = new Point(25, 330),
                BackColor = Color.FromArgb(0, 121, 107),
                ForeColor = Color.White,
                Font = new Font("Arial", 10f, FontStyle.Bold)
            };
            btnSubmit.Click += (s, e) =>
            {
                var payload = new Dictionary<string, object>
                {
                    { "certificateTypeId", cbTypes.SelectedValue ?? "" },
                    { "issueDate", dtpIssueDate.Value.ToString("yyyy-MM-dd") },
                    { "expiryDate", dtpExpiryDate.Value.ToString("yyyy-MM-dd") },
                    { "description", txtDescription.Text }
                };
                OnFormSubmit?.Invoke(this, payload);
            };

            this.Controls.AddRange(new Control[] {
                lblType, cbTypes, lblIssue, dtpIssueDate,
                lblExpiry, dtpExpiryDate, lblDesc, txtDescription, btnSubmit
            });
        }

        private Label CreateLabel(string text, int top)
        {
            return new Label
            {
                Text = text,
                Location = new Point(25, top),
                Font = new Font("Arial", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(51, 51, 51),
                AutoSize = true
            };
        }

        public void SetCertificateTypes<T>(List<T> types, string displayMember, string valueMember)
        {
            cbTypes.DataSource = types;
            cbTypes.DisplayMember = displayMember;
            cbTypes.ValueMember = valueMember;
        }
    }
}