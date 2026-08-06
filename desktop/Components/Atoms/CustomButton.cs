using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace desktop.Components.Atoms
{
    public class CustomButton : Button
    {
        private string variant = "primary";

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [DefaultValue("primary")]
        public string Variant
        {
            get => variant;
            set
            {
                variant = value;
                UpdateVariantColor();
            }
        }

        public CustomButton()
        {
            this.FlatStyle = FlatStyle.Flat;
            this.FlatAppearance.BorderSize = 0;
            this.Font = new Font("Arial", 10f, FontStyle.Bold);
            this.ForeColor = Color.White;
            this.Cursor = Cursors.Hand;
            this.Size = new Size(120, 40);
            this.Padding = new Padding(5);
            UpdateVariantColor();
        }

        private void UpdateVariantColor()
        {
            this.BackColor = (variant.ToLower() == "primary")
                ? Color.FromArgb(135, 187, 242)  
                : Color.FromArgb(108, 117, 125); 
        }

        protected override void OnPaint(PaintEventArgs pevent)
        {
            base.OnPaint(pevent);
            GraphicsPath graphicsPath = new GraphicsPath();
            int borderRadius = 15;
            Rectangle rect = new Rectangle(0, 0, this.Width, this.Height);
            
            graphicsPath.AddArc(rect.X, rect.Y, borderRadius * 2, borderRadius * 2, 180, 90);
            graphicsPath.AddArc(rect.Width - (borderRadius * 2), rect.Y, borderRadius * 2, borderRadius * 2, 270, 90);
            graphicsPath.AddArc(rect.Width - (borderRadius * 2), rect.Height - (borderRadius * 2), borderRadius * 2, borderRadius * 2, 0, 90);
            graphicsPath.AddArc(rect.X, rect.Height - (borderRadius * 2), borderRadius * 2, borderRadius * 2, 90, 90);
            graphicsPath.CloseFigure();

            this.Region = new Region(graphicsPath);
        }
    }
}