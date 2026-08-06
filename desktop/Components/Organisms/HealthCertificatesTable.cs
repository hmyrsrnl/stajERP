using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Organisms
{
    public class HealthCertificatesTable : Panel
    {
        private FlowLayoutPanel listContainer;
        private Label lblEmpty;

        private const int TABLE_WIDTH = 750;

        public event EventHandler<int>? OnEditClick;
        public event EventHandler<HealthCertificateData>? OnDeleteClick;
        public event EventHandler<HealthCertificateData>? OnNotificationClick;

        public HealthCertificatesTable()
        {
            this.Dock = DockStyle.Fill;
            this.BackColor = Color.White;
            this.AutoScroll = true;

            lblEmpty = new Label
            {
                Text = "Bu çalışana ait yüklenmiş bir sağlık raporu veya sertifikası bulunamadı.",
                Font = new Font("Arial", 10f, FontStyle.Italic),
                ForeColor = Color.FromArgb(119, 119, 119),
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleCenter,
                Visible = false
            };

            listContainer = new FlowLayoutPanel
            {
                Dock = DockStyle.Top,
                AutoSize = true,
                FlowDirection = FlowDirection.TopDown,
                WrapContents = false,
                BackColor = Color.White
            };

            this.Controls.Add(lblEmpty);
            this.Controls.Add(listContainer);
        }

        public void SetCertificates(List<HealthCertificateData> certificates)
        {
            listContainer.Controls.Clear();

            if (certificates == null || certificates.Count == 0)
            {
                listContainer.Visible = false;
                lblEmpty.Visible = true;
                return;
            }

            lblEmpty.Visible = false;
            listContainer.Visible = true;

            listContainer.Controls.Add(CreateHeaderRow());

            foreach (var cert in certificates)
            {
                listContainer.Controls.Add(CreateCertRow(cert));
            }
        }

        private Panel CreateHeaderRow()
        {
            Panel header = new Panel
            {
                Width = TABLE_WIDTH,
                Height = 40,
                BackColor = Color.FromArgb(224, 242, 241),
                Margin = new Padding(0, 0, 0, 2)
            };

            header.Controls.Add(CreateHeaderCell("Belge / Sertifika Adı", 15, 210));
            header.Controls.Add(CreateHeaderCell("Veriliş Tarihi", 230, 110));
            header.Controls.Add(CreateHeaderCell("Geçerlilik", 350, 110));
            header.Controls.Add(CreateHeaderCell("İşlem", 490, 230));

            return header;
        }

        private Label CreateHeaderCell(string text, int left, int width)
        {
            return new Label
            {
                Text = text,
                Font = new Font("Arial", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 121, 107),
                Location = new Point(left, 12),
                Size = new Size(width, 20)
            };
        }

        private Panel CreateCertRow(HealthCertificateData cert)
        {
            Panel row = new Panel
            {
                Width = TABLE_WIDTH,
                Height = 52,
                BackColor = Color.White,
                Margin = new Padding(0, 0, 0, 1)
            };

            row.Paint += (s, e) =>
            {
                using (Pen pen = new Pen(Color.FromArgb(222, 226, 230), 1))
                {
                    e.Graphics.DrawLine(pen, 0, row.Height - 1, row.Width, row.Height - 1);
                }
            };

            Label lblName = new Label
            {
                Text = cert.certificate_name ?? "-",
                Font = new Font("Arial", 8.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(33, 37, 41),
                Location = new Point(15, 16),
                Size = new Size(210, 20)
            };

            Label lblIssue = new Label
            {
                Text = cert.issue_date ?? "-",
                Font = new Font("Arial", 8.5f),
                ForeColor = Color.FromArgb(33, 37, 41),
                Location = new Point(230, 16),
                Size = new Size(110, 20)
            };
            Label lblExpiry = new Label
            {
                Text = !string.IsNullOrEmpty(cert.expiry_date) ? cert.expiry_date : "Süresiz",
                Font = new Font("Arial", 8.5f),
                ForeColor = Color.FromArgb(211, 47, 47),
                Location = new Point(350, 16),
                Size = new Size(110, 20)
            };

            int currentX = 490;

            bool isNearExpiry = IsNearExpiry(cert.expiry_date);
            if (isNearExpiry)
            {
                CustomButton btnNotify = new CustomButton
                {
                    Text = "!",
                    Width = 32,
                    Height = 30,
                    Location = new Point(currentX, 11),
                    BackColor = Color.FromArgb(245, 158, 11),
                    ForeColor = Color.White,
                    Font = new Font("Arial", 9f)
                };
                btnNotify.Click += (s, e) => OnNotificationClick?.Invoke(this, cert);
                row.Controls.Add(btnNotify);
                currentX += 38;
            }

            CustomButton btnEdit = new CustomButton
            {
                Text = "Düzenle",
                Width = 80,
                Height = 30,
                Location = new Point(currentX, 11),
                BackColor = Color.FromArgb(18, 164, 140),
                ForeColor = Color.White,
                Font = new Font("Arial", 8.5f, FontStyle.Bold)
            };
            btnEdit.Click += (s, e) => OnEditClick?.Invoke(this, cert.id);
            currentX += 86;
            CustomButton btnDelete = new CustomButton
            {
                Text = "Sil",
                Width = 60,
                Height = 30,
                Location = new Point(currentX, 11),
                BackColor = Color.FromArgb(211, 47, 47),
                ForeColor = Color.White,
                Font = new Font("Arial", 8.5f, FontStyle.Bold)
            };
            btnDelete.Click += (s, e) => OnDeleteClick?.Invoke(this, cert);

            row.Controls.Add(lblName);
            row.Controls.Add(lblIssue);
            row.Controls.Add(lblExpiry);
            row.Controls.Add(btnEdit);
            row.Controls.Add(btnDelete);

            return row;
        }

        private bool IsNearExpiry(string? expiryDate)
        {
            if (DateTime.TryParse(expiryDate, out DateTime expiry))
            {
                return (expiry - DateTime.Now).TotalDays <= 15;
            }
            return false;
        }
    }
}