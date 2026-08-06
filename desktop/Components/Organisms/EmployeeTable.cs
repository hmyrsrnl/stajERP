using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace desktop.Components.Organisms
{
    public class EmployeeTable : Panel
    {
        private FlowLayoutPanel listContainer;
        private Label lblEmpty;

        public event EventHandler<UserData>? OnSelectEmployee;

        public EmployeeTable()
        {
            this.Dock = DockStyle.Fill;
            this.BackColor = Color.Transparent;
            this.AutoScroll = false; 

            lblEmpty = new Label
            {
                Text = "Filtrelere uygun çalışan bulunamadı.",
                Font = new Font("Arial", 10f, FontStyle.Italic),
                ForeColor = Color.FromArgb(119, 119, 119),
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleCenter,
                Visible = false
            };

            listContainer = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                AutoScroll = true, 
                FlowDirection = FlowDirection.TopDown,
                WrapContents = false,
                BackColor = Color.Transparent,
                Padding = new Padding(0, 0, 10, 0)
            };

            this.Controls.Add(lblEmpty);
            this.Controls.Add(listContainer);
        }

        public void SetEmployees(List<UserData> employees)
        {
            listContainer.Controls.Clear();

            if (employees == null || employees.Count == 0)
            {
                listContainer.Visible = false;
                lblEmpty.Visible = true;
                return;
            }

            lblEmpty.Visible = false;
            listContainer.Visible = true;

            int cardWidth = listContainer.ClientSize.Width - 15;
            if (cardWidth < 500) cardWidth = 650; 

            foreach (var emp in employees)
            {
                listContainer.Controls.Add(CreateEmployeeCard(emp, cardWidth));
            }
        }

        private Panel CreateEmployeeCard(UserData emp, int width)
        {
            var (bgColor, textColor, _) = GetDepartmentColors(emp.role);

            Panel card = new Panel
            {
                Width = width,
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
                Text = $"{emp.first_name} {emp.last_name}",
                Font = new Font("Arial", 10f, FontStyle.Bold),
                ForeColor = Color.Black,
                Location = new Point(18, 18),
                AutoSize = true
            };

            Label lblBadge = new Label
            {
                Text = emp.role_name ?? (emp.role ?? "Çalışan"),
                Font = new Font("Arial", 8f, FontStyle.Bold),
                ForeColor = textColor,
                BackColor = bgColor,
                Padding = new Padding(6, 3, 6, 3),
                Location = new Point(230, 15),
                AutoSize = true
            };

            Label lblDetails = new Label
            {
                Text = "Detaylar",
                Font = new Font("Arial", 9.5f, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 123, 255),
                Cursor = Cursors.Hand,
                AutoSize = true,
                Location = new Point(card.Width - 80, 18),
                Anchor = AnchorStyles.Top | AnchorStyles.Right
            };
            lblDetails.Click += (s, e) => OnSelectEmployee?.Invoke(this, emp);

            card.Controls.Add(lblName);
            card.Controls.Add(lblBadge);
            card.Controls.Add(lblDetails);

            return card;
        }

        private (Color bgColor, Color textColor, Color btnColor) GetDepartmentColors(string? role)
        {
            return (Color.FromArgb(241, 245, 249), Color.FromArgb(71, 85, 105), Color.FromArgb(100, 116, 139));
        }
    }
}