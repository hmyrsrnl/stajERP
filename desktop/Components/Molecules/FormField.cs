using System;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Molecules
{
    public class FormField : Panel
    {
        private Label lblField;
        private CustomTextBox txtField;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string LabelText
        {
            get => lblField.Text;
            set => lblField.Text = value;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Value
        {
            get => txtField.Text;
            set => txtField.Text = value;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Placeholder
        {
            get => txtField.PlaceholderText;
            set => txtField.PlaceholderText = value;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsPassword
        {
            get => txtField.PasswordChar == '•';
            set => txtField.PasswordChar = value ? '•' : '\0';
        }

        public FormField() : this("Etiket", false) { }

        public FormField(string labelText, bool isPassword = false)
        {
            this.Width = 340;
            this.Height = 62;
            this.Margin = new Padding(0, 0, 0, 15);

            lblField = new Label
            {
                Text = labelText,
                Font = new Font("Arial", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(33, 37, 41),
                Location = new Point(0, 0),
                AutoSize = true
            };

            txtField = new CustomTextBox
            {
                Location = new Point(0, 22),
                Width = 340,
                PasswordChar = isPassword ? '•' : '\0'
            };

            this.Controls.Add(lblField);
            this.Controls.Add(txtField);
        }
    }
}