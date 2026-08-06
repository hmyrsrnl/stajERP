using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Organisms
{
    public class ExaminationTable : Panel
    {
        private FlowLayoutPanel listContainer;
        private Label lblEmpty;

        private const int TABLE_WIDTH = 750;

        public event EventHandler<int>? OnEditClick;
        public event EventHandler<int>? OnDeleteClick;

        public ExaminationTable()
        {
            this.Dock = DockStyle.Fill;
            this.BackColor = Color.White;
            this.AutoScroll = true;

            lblEmpty = new Label
            {
                Text = "Bu personele ait geçmiş bir muayene kaydı bulunamadı.",
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

        public void SetExaminations(List<ExaminationData> examinations)
        {
            listContainer.Controls.Clear();

            if (examinations == null || examinations.Count == 0)
            {
                listContainer.Visible = false;
                lblEmpty.Visible = true;
                return;
            }

            lblEmpty.Visible = false;
            listContainer.Visible = true;

            listContainer.Controls.Add(CreateHeaderRow());

            foreach (var exam in examinations)
            {
                listContainer.Controls.Add(CreateExamRow(exam));
            }
        }

        private Panel CreateHeaderRow()
        {
            Panel header = new Panel
            {
                Width = TABLE_WIDTH,
                Height = 40,
                BackColor = Color.FromArgb(178, 223, 219),
                Margin = new Padding(0, 0, 0, 2)
            };

            header.Controls.Add(CreateHeaderCell("Tarih", 10, 80));
            header.Controls.Add(CreateHeaderCell("Muayene Tipi", 100, 100));
            header.Controls.Add(CreateHeaderCell("Sonuç / Tanı", 210, 140));
            header.Controls.Add(CreateHeaderCell("Açıklama / Reçete", 360, 160));
            header.Controls.Add(CreateHeaderCell("Hekim", 530, 100));
            header.Controls.Add(CreateHeaderCell("İşlem", 640, 100));

            return header;
        }

        private Label CreateHeaderCell(string text, int left, int width)
        {
            return new Label
            {
                Text = text,
                Font = new Font("Arial", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 77, 64),
                Location = new Point(left, 12),
                Size = new Size(width, 20)
            };
        }

        private Panel CreateExamRow(ExaminationData exam)
        {
            Panel row = new Panel
            {
                Width = TABLE_WIDTH,
                Height = 48,
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

            Label lblDate = new Label
            {
                Text = !string.IsNullOrEmpty(exam.exam_date) ? exam.exam_date : "-",
                Font = new Font("Arial", 8.5f),
                ForeColor = Color.FromArgb(33, 37, 41),
                Location = new Point(10, 14),
                Size = new Size(80, 20)
            };

            string typeStr = exam.exam_type ?? "Günlük";
            bool isPeriyodik = typeStr.Equals("Periyodik", StringComparison.OrdinalIgnoreCase);

            Label lblBadge = new Label
            {
                Text = typeStr,
                Font = new Font("Arial", 8f, FontStyle.Bold),
                ForeColor = isPeriyodik ? Color.FromArgb(0, 96, 100) : Color.FromArgb(230, 81, 0),
                BackColor = isPeriyodik ? Color.FromArgb(224, 247, 250) : Color.FromArgb(255, 243, 224),
                Padding = new Padding(4, 2, 4, 2),
                Location = new Point(100, 12),
                AutoSize = true
            };

            Label lblResult = new Label
            {
                Text = !string.IsNullOrEmpty(exam.result) ? exam.result : "-",
                Font = new Font("Arial", 8.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(33, 37, 41),
                Location = new Point(210, 14),
                Size = new Size(140, 20)
            };

            Label lblDesc = new Label
            {
                Text = !string.IsNullOrEmpty(exam.description) ? exam.description : "-",
                Font = new Font("Arial", 8.5f),
                ForeColor = Color.FromArgb(85, 85, 85),
                Location = new Point(360, 14),
                Size = new Size(160, 20)
            };
            Label lblDoctor = new Label
            {
                Text = !string.IsNullOrEmpty(exam.doctor_name) ? exam.doctor_name : "Bilinmeyen",
                Font = new Font("Arial", 8.5f, FontStyle.Italic),
                ForeColor = Color.FromArgb(102, 102, 102),
                Location = new Point(530, 14),
                Size = new Size(100, 20)
            };

            CustomButton btnEdit = new CustomButton
            {
                Text = "Düzenle",
                Width = 48,
                Height = 24,
                Location = new Point(640, 11),
                BackColor = Color.FromArgb(18, 164, 140),
                ForeColor = Color.White,
                Font = new Font("Arial", 7.5f, FontStyle.Bold)
            };
            btnEdit.Click += (s, e) => OnEditClick?.Invoke(this, exam.id);

            CustomButton btnDelete = new CustomButton
            {
                Text = "Sil",
                Width = 36,
                Height = 24,
                Location = new Point(693, 11),
                BackColor = Color.FromArgb(211, 47, 47),
                ForeColor = Color.White,
                Font = new Font("Arial", 7.5f, FontStyle.Bold)
            };
            btnDelete.Click += (s, e) => OnDeleteClick?.Invoke(this, exam.id);

            row.Controls.Add(lblDate);
            row.Controls.Add(lblBadge);
            row.Controls.Add(lblResult);
            row.Controls.Add(lblDesc);
            row.Controls.Add(lblDoctor);
            row.Controls.Add(btnEdit);
            row.Controls.Add(btnDelete);

            return row;
        }
    }
}