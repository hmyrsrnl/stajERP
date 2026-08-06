using System;
using System.Drawing;
using System.Windows.Forms;

namespace desktop.Components.Atoms
{
    public class CustomTextBox : TextBox
    {
        public CustomTextBox()
        {
            this.Font = new Font("Arial", 10.5f);
            this.BorderStyle = BorderStyle.FixedSingle;
            this.Height = 35;
        }
    }
}