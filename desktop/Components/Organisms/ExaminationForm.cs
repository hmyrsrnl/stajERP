using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Organisms
{
    public class ExaminationForm : Panel
    {
        private ComboBox cbExamType;
        private TextBox txtResult;
        private TextBox txtDescription;
        private CustomButton btnSubmit;

        public event EventHandler<Dictionary<string, string>>? OnFormSubmit;

        public ExaminationForm()
        {
            this.Width = 450;
            this.AutoSize = true;
            this.BackColor = Color.FromArgb(248, 249, 250);
            this.Padding = new Padding(25);

            Label lblType = CreateLabel("Muayene Tipi", 15);
            cbExamType = new ComboBox
            {
                Location = new Point(25, 40),
                Width = 400,
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Arial", 9.5f)
            };
            cbExamType.Items.AddRange(new object[] { "Günlük", "Periyodik" });
            cbExamType.SelectedIndex = 0;

            Label lblResult = CreateLabel("Muayene Sonucu / Tanı", 80);
            txtResult = new TextBox
            {
                Location = new Point(25, 105),
                Width = 400,
                Font = new Font("Arial", 9.5f)
            };

            Label lblDesc = CreateLabel("Detaylı Açıklama / İlaçlar", 145);
            txtDescription = new TextBox
            {
                Location = new Point(25, 170),
                Width = 400,
                Height = 90,
                Multiline = true,
                Font = new Font("Arial", 9.5f)
            };

            btnSubmit = new CustomButton
            {
                Text = "Kaydet",
                Width = 400,
                Height = 40,
                Location = new Point(25, 280),
                BackColor = Color.FromArgb(0, 121, 107),
                ForeColor = Color.White,
                Font = new Font("Arial", 10f, FontStyle.Bold)
            };
            btnSubmit.Click += (s, e) =>
            {
                var payload = new Dictionary<string, string>
                {
                    { "exam_type", cbExamType.SelectedItem?.ToString() ?? "Günlük" },
                    { "result", txtResult.Text },
                    { "description", txtDescription.Text }
                };
                OnFormSubmit?.Invoke(this, payload);
            };

            this.Controls.AddRange(new Control[] {
                lblType, cbExamType, lblResult, txtResult,
                lblDesc, txtDescription, btnSubmit
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
    }
}