using System;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;
using desktop.Components.Atoms;

namespace desktop.Components.Molecules
{
    public class Pagination : FlowLayoutPanel
    {
        private int currentPage = 1;
        private int totalPages = 1;

        public event EventHandler<int>? OnPageChange;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public int CurrentPage
        {
            get => currentPage;
            set
            {
                currentPage = value;
                RenderButtons();
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public int TotalPages
        {
            get => totalPages;
            set
            {
                totalPages = value;
                RenderButtons();
            }
        }

        public Pagination()
        {
            this.FlowDirection = FlowDirection.LeftToRight;
            this.WrapContents = false;
            this.AutoSize = true;
            this.BackColor = Color.Transparent;
            this.Padding = new Padding(0, 15, 0, 0);
        }

        private void RenderButtons()
        {
            this.Controls.Clear();

            if (totalPages <= 1)
            {
                this.Visible = false;
                return;
            }

            this.Visible = true;

            CustomButton btnPrev = new CustomButton
            {
                Text = "«",
                Width = 40,
                Height = 35,
                Enabled = currentPage > 1,
                BackColor = (currentPage == 1) ? Color.FromArgb(224, 224, 224) : Color.White,
                ForeColor = Color.FromArgb(51, 51, 51)
            };
            btnPrev.Click += (s, e) => OnPageChange?.Invoke(this, currentPage - 1);
            this.Controls.Add(btnPrev);

            for (int i = 1; i <= totalPages; i++)
            {
                int pageNum = i;
                bool isActive = (pageNum == currentPage);

                CustomButton btnPage = new CustomButton
                {
                    Text = pageNum.ToString(),
                    Width = 35,
                    Height = 35,
                    BackColor = isActive ? Color.FromArgb(0, 121, 107) : Color.White, 
                    ForeColor = isActive ? Color.White : Color.FromArgb(51, 51, 51)
                };
                btnPage.Click += (s, e) => OnPageChange?.Invoke(this, pageNum);
                this.Controls.Add(btnPage);
            }

            CustomButton btnNext = new CustomButton
            {
                Text = "»",
                Width = 40,
                Height = 35,
                Enabled = currentPage < totalPages,
                BackColor = (currentPage == totalPages) ? Color.FromArgb(224, 224, 224) : Color.White,
                ForeColor = Color.FromArgb(51, 51, 51)
            };
            btnNext.Click += (s, e) => OnPageChange?.Invoke(this, currentPage + 1);
            this.Controls.Add(btnNext);
        }
    }
}