using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;
using desktop.Components.Molecules;

namespace desktop.Components.Organisms
{
    public class FilterPanel : Panel
    {
        private Label lblHeader;
        private Label lblSearchTitle;
        private TextBox txtSearch;
        private FilterGroup fgGender;
        private FilterGroup fgDepartment;
        private FilterGroup fgStatus;
        private CustomButton btnExport;

        public event EventHandler<string>? OnSearchChanged;
        public event EventHandler<List<string>>? OnGenderChanged;
        public event EventHandler<List<string>>? OnDepartmentChanged;
        public event EventHandler<List<string>>? OnStatusChanged;
        public event EventHandler? OnExportClicked;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string SearchTerm => txtSearch.Text;

        public FilterPanel()
        {
            this.Width = 240;
            this.Height = 560;
            this.AutoScroll = true; 
            this.BackColor = Color.White;
            this.Padding = new Padding(15);
            this.Margin = new Padding(0, 0, 20, 0);

            lblHeader = new Label
            {
                Text = "Filtreleme",
                Font = new Font("Arial", 11f, FontStyle.Bold),
                ForeColor = Color.FromArgb(51, 51, 51),
                Size = new Size(190, 25),
                Location = new Point(15, 15)
            };

            lblHeader.Paint += (s, e) =>
            {
                using (Pen pen = new Pen(Color.FromArgb(247, 163, 60), 2))
                {
                    e.Graphics.DrawLine(pen, 0, lblHeader.Height - 2, lblHeader.Width, lblHeader.Height - 2);
                }
            };

            lblSearchTitle = new Label
            {
                Text = "Personel Ara",
                Font = new Font("Arial", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(51, 51, 51),
                AutoSize = true,
                Location = new Point(15, 48)
            };

            txtSearch = new TextBox
            {
                Location = new Point(15, 70),
                Width = 190,
                Font = new Font("Arial", 9f),
                BorderStyle = BorderStyle.FixedSingle
            };
            txtSearch.TextChanged += (s, e) => OnSearchChanged?.Invoke(this, txtSearch.Text);

            fgGender = new FilterGroup { Title = "Cinsiyet", Location = new Point(15, 105) };
            fgGender.SetItems(new List<string> { "Kadın", "Erkek" });
            fgGender.OnSelectionChanged += (s, list) => OnGenderChanged?.Invoke(this, list);

            fgDepartment = new FilterGroup { Title = "Departmanlar", Location = new Point(15, 185) };
            fgDepartment.OnSelectionChanged += (s, list) =>
            {
                Relayout();
                OnDepartmentChanged?.Invoke(this, list);
            };

            fgStatus = new FilterGroup { Title = "Çalışan Durumu", Location = new Point(15, 270) };
            fgStatus.SetItems(new List<string> { "Aktif", "Pasif" });
            fgStatus.OnSelectionChanged += (s, list) => OnStatusChanged?.Invoke(this, list);

            btnExport = new CustomButton
            {
                Text = "Excel Olarak İndir",
                Width = 190,
                Height = 38,
                Location = new Point(15, 360),
                BackColor = Color.FromArgb(31, 128, 78),
                ForeColor = Color.White
            };
            btnExport.Click += (s, e) => OnExportClicked?.Invoke(this, EventArgs.Empty);

            this.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, this.ClientRectangle,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid);
            };

            this.Controls.Add(lblHeader);
            this.Controls.Add(lblSearchTitle);
            this.Controls.Add(txtSearch);
            this.Controls.Add(fgGender);
            this.Controls.Add(fgDepartment);
            this.Controls.Add(fgStatus);
            this.Controls.Add(btnExport);

            Relayout();
        }

        public void SetDepartments(List<string> departments)
        {
            fgDepartment.SetItems(departments);
            Relayout();
        }

        public void ConfigureVisibility(bool showGenders = true, bool showDepartments = true, bool showExport = true)
        {
            fgGender.Visible = showGenders;
            fgDepartment.Visible = showDepartments;
            btnExport.Visible = showExport;
            Relayout();
        }

        private void Relayout()
        {
            int currentY = 105;

            if (fgGender.Visible)
            {
                fgGender.Location = new Point(15, currentY);
                currentY += fgGender.Height + 15;
            }

            if (fgDepartment.Visible)
            {
                fgDepartment.Location = new Point(15, currentY);
                currentY += fgDepartment.Height + 15;
            }

            if (fgStatus.Visible)
            {
                fgStatus.Location = new Point(15, currentY);
                currentY += fgStatus.Height + 15;
            }

            if (btnExport.Visible)
            {
                btnExport.Location = new Point(15, currentY);
            }
        }
    }
}