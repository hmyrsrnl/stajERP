using System;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Molecules
{
    public class Header : Panel
    {
        private Label lblTitle;
        private CustomButton btnBack;
        private FlowLayoutPanel rightActionContainer;

        public event EventHandler? OnBackClick;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Title
        {
            get => lblTitle.Text;
            set => lblTitle.Text = value;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Color HeaderBackgroundColor
        {
            get => this.BackColor;
            set => this.BackColor = value;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string BackButtonText
        {
            get => btnBack.Text;
            set => btnBack.Text = value;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool ShowBackButton
        {
            get => btnBack.Visible;
            set => btnBack.Visible = value;
        }

        public Header() : this("Sayfa Başlığı", "#00796b") { }

        public Header(string title, string hexBackgroundColor = "#00796b")
        {
            this.Height = 70;
            this.Dock = DockStyle.Top;
            this.Padding = new Padding(20, 10, 20, 10);
            this.BackColor = ColorTranslator.FromHtml(hexBackgroundColor);

            lblTitle = new Label
            {
                Text = title,
                Font = new Font("Arial", 14f, FontStyle.Bold),
                ForeColor = Color.White,
                AutoSize = true,
                Location = new Point(20, 22)
            };

            rightActionContainer = new FlowLayoutPanel
            {
                Dock = DockStyle.Right,
                AutoSize = true,
                FlowDirection = FlowDirection.RightToLeft,
                BackColor = Color.Transparent,
                Padding = new Padding(0, 14, 20, 0), 
                WrapContents = false
            };

            btnBack = new CustomButton
            {
                Text = "Geri Dön",
                Width = 90,
                Height = 36,
                BackColor = Color.FromArgb(50, 255, 255, 255),
                ForeColor = Color.White,
                Font = new Font("Arial", 8.5f, FontStyle.Bold),
                Visible = true,
                Margin = new Padding(8, 0, 0, 0)
            };
            btnBack.Click += (s, e) => OnBackClick?.Invoke(this, EventArgs.Empty);

            rightActionContainer.Controls.Add(btnBack);

            this.Controls.Add(lblTitle);
            this.Controls.Add(rightActionContainer);
        }

        public void AddActionButton(Control control)
        {
            control.Margin = new Padding(8, 0, 0, 0);
            rightActionContainer.Controls.Add(control);
        }

        public void ConfigureBackButton(string text, Color backColor, int width = 90)
        {
            btnBack.Text = text;
            btnBack.BackColor = backColor;
            btnBack.Width = width;
        }
    }
}