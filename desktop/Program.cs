using System;
using System.Windows.Forms;
using desktop.Forms;

namespace desktop
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new LoginFormPage());
            
            //Application.Run(new DashboardSelectionForm());

        }
    }
}