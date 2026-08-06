using System;
using System.Drawing;
using System.Windows.Forms;

namespace desktop.Components.Atoms
{
    public class CustomCheckbox : CheckBox
    {
        public CustomCheckbox()
        {
            this.Font = new Font("Arial", 9.5f, FontStyle.Regular);
            this.ForeColor = Color.FromArgb(73, 80, 87); 
            this.Cursor = Cursors.Hand;
            this.AutoSize = true;
            this.Margin = new Padding(0, 0, 0, 8);
        }
    }
}