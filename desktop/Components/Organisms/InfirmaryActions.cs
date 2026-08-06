using System;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Organisms
{
    public class InfirmaryActions : Panel
    {
        private CustomButton btnAddExamination;
        private CustomButton btnHistory;
        private CustomButton btnManageCertificates;

        public event EventHandler? OnAddExaminationClick;
        public event EventHandler? OnHistoryClick;
        public event EventHandler? OnManageCertificatesClick;

        public InfirmaryActions()
        {
            this.Size = new Size(500, 130);
            this.BackColor = Color.Transparent;

            Color btnColor = Color.FromArgb(112, 177, 171); 

            btnAddExamination = new CustomButton
            {
                Text = "Yeni Muayene Ekle",
                Size = new Size(238, 50),
                Location = new Point(0, 0),
                BackColor = btnColor,
                ForeColor = Color.White,
                Font = new Font("Arial", 10f, FontStyle.Bold)
            };
            btnAddExamination.Click += (s, e) => OnAddExaminationClick?.Invoke(this, EventArgs.Empty);

            btnHistory = new CustomButton
            {
                Text = "Geçmiş Muayeneleri Gör",
                Size = new Size(238, 50),
                Location = new Point(262, 0),
                BackColor = btnColor,
                ForeColor = Color.White,
                Font = new Font("Arial", 10f, FontStyle.Bold)
            };
            btnHistory.Click += (s, e) => OnHistoryClick?.Invoke(this, EventArgs.Empty);

            btnManageCertificates = new CustomButton
            {
                Text = "Personel Sağlık Sertifikalarını Yönet",
                Size = new Size(500, 50),
                Location = new Point(0, 65),
                BackColor = btnColor,
                ForeColor = Color.White,
                Font = new Font("Arial", 10f, FontStyle.Bold)
            };
            btnManageCertificates.Click += (s, e) => OnManageCertificatesClick?.Invoke(this, EventArgs.Empty);

            this.Controls.Add(btnAddExamination);
            this.Controls.Add(btnHistory);
            this.Controls.Add(btnManageCertificates);
        }
    }
}