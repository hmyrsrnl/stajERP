using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using desktop.Components.Molecules;

namespace desktop.Components.Organisms
{
    public class EmployeeTable : Panel
    {
        private List<UserData> allEmployees = new List<UserData>();
        private int currentPage = 1;
        private const int ItemsPerPage = 10;

        private FlowLayoutPanel listContainer;
        private Pagination pagination;
        private Label lblEmpty;

        public event EventHandler<UserData>? OnSelectEmployee;
        public event EventHandler<UserData>? OnEditEmployee;

        public EmployeeTable()
        {
            this.Dock = DockStyle.Fill;
            this.BackColor = Color.Transparent;
            this.AutoScroll = true; 

            listContainer = new FlowLayoutPanel
            {
                Width = 720,
                AutoSize = true,
                FlowDirection = FlowDirection.TopDown,
                WrapContents = false,
                BackColor = Color.Transparent
            };

            lblEmpty = new Label
            {
                Text = "Henüz kayıtlı çalışan yok.",
                Font = new Font("Arial", 10f, FontStyle.Italic),
                ForeColor = Color.FromArgb(119, 119, 119),
                AutoSize = true,
                Padding = new Padding(10),
                Visible = false
            };

            pagination = new Pagination();
            pagination.OnPageChange += (s, page) =>
            {
                currentPage = page;
                RenderTable();
            };

            this.Controls.Add(pagination);
            this.Controls.Add(lblEmpty);
            this.Controls.Add(listContainer);
        }

        public void SetEmployees(List<UserData> employees)
        {
            allEmployees = employees ?? new List<UserData>();
            currentPage = 1;
            RenderTable();
        }

        private void RenderTable()
        {
            listContainer.Controls.Clear();

            if (allEmployees.Count == 0)
            {
                lblEmpty.Visible = true;
                pagination.Visible = false;
                return;
            }

            lblEmpty.Visible = false;

            int totalPages = (int)Math.Ceiling(allEmployees.Count / (double)ItemsPerPage);
            if (currentPage > totalPages) currentPage = 1;

            var currentEmployees = allEmployees
                .Skip((currentPage - 1) * ItemsPerPage)
                .Take(ItemsPerPage)
                .ToList();

            foreach (var emp in currentEmployees)
            {
                Panel card = CreateEmployeeCard(emp);
                listContainer.Controls.Add(card);
            }

            pagination.CurrentPage = currentPage;
            pagination.TotalPages = totalPages;
            pagination.Location = new Point(20, listContainer.Height + 15);
        }

        private Panel CreateEmployeeCard(UserData emp)
        {
            var (bgColor, textColor, btnColor) = GetDepartmentColors(emp.role);

            Panel card = new Panel
            {
                Width = 730,
                Height = 55,
                Margin = new Padding(0, 0, 0, 10),
                Padding = new Padding(15, 10, 15, 10),
                BackColor = Color.White
            };

            card.Paint += (s, e) =>
            {
                using (SolidBrush brush = new SolidBrush(textColor))
                {
                    e.Graphics.FillRectangle(brush, 0, 0, 5, card.Height);
                }
                ControlPaint.DrawBorder(e.Graphics, card.ClientRectangle,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid,
                    Color.FromArgb(222, 226, 230), 1, ButtonBorderStyle.Solid);
            };

            Label lblName = new Label
            {
                Text = $"{emp.first_name + emp.last_name}".Trim() != "" ? $"{emp.first_name} {emp.last_name}".Trim() : (emp.name ?? emp.email),
                Font = new Font("Arial", 10f, FontStyle.Bold),
                ForeColor = Color.Black,
                Location = new Point(15, 18),
                AutoSize = true
            };

            Label lblBadge = new Label
            {
                Text = emp.department_name ?? "Bilinmiyor",
                Font = new Font("Arial", 8f, FontStyle.Bold),
                ForeColor = textColor,
                BackColor = bgColor,
                Padding = new Padding(5, 2, 5, 2),
                Location = new Point(220, 16),
                AutoSize = true
            };

            Label lblDetails = new Label
            {
                Text = "Detaylar",
                Font = new Font("Arial", 9.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 123, 255),
                Cursor = Cursors.Hand,
                Location = new Point(640, 18), 
                AutoSize = true
            };
            lblDetails.Click += (s, e) => OnSelectEmployee?.Invoke(this, emp);

            card.Controls.Add(lblName);
            card.Controls.Add(lblBadge);
            card.Controls.Add(lblDetails);

            return card;
        }

        private (Color bg, Color text, Color button) GetDepartmentColors(string? role)
        {
            return (role?.ToLower()) switch
            {
                "ik" or "insan kaynakları" => (Color.FromArgb(253, 244, 233), Color.FromArgb(217, 119, 6), Color.FromArgb(247, 163, 60)),
                "revir" => (Color.FromArgb(253, 242, 242), Color.FromArgb(224, 36, 36), Color.FromArgb(146, 70, 151)),
                "kk" or "kalite kontrol" => (Color.FromArgb(243, 232, 255), Color.FromArgb(126, 34, 206), Color.FromArgb(219, 122, 232)),
                "worker" or "calısan" or "çalışan" => (Color.FromArgb(240, 253, 244), Color.FromArgb(21, 128, 61), Color.FromArgb(34, 197, 94)),
                _ => (Color.FromArgb(243, 244, 246), Color.FromArgb(75, 85, 99), Color.FromArgb(200, 25, 25))
            };
        }
    }
}