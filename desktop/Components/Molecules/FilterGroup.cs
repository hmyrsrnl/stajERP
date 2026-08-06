using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace desktop.Components.Molecules
{
    public class FilterGroup : Panel
    {
        private Label lblTitle;
        private FlowLayoutPanel itemsContainer;
        private List<string> selectedItems = new List<string>();

        public event EventHandler<List<string>>? OnSelectionChanged;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Title
        {
            get => lblTitle.Text;
            set
            {
                lblTitle.Text = value;
                lblTitle.Visible = !string.IsNullOrEmpty(value);
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public List<string> SelectedItems => new List<string>(selectedItems);

        public FilterGroup()
        {
            this.AutoSize = true;
            this.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            this.BackColor = Color.Transparent;
            this.Margin = new Padding(0, 0, 0, 15);

            lblTitle = new Label
            {
                Font = new Font("Arial", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(51, 51, 51),
                AutoSize = true,
                Location = new Point(0, 0),
                Margin = new Padding(0, 0, 0, 8)
            };

            itemsContainer = new FlowLayoutPanel
            {
                FlowDirection = FlowDirection.TopDown,
                WrapContents = false,
                AutoSize = true,
                AutoSizeMode = AutoSizeMode.GrowAndShrink,
                Location = new Point(0, 22),
                BackColor = Color.Transparent
            };

            this.Controls.Add(lblTitle);
            this.Controls.Add(itemsContainer);
        }

        public void SetItems(List<string> items, List<string>? activeSelections = null)
        {
            itemsContainer.Controls.Clear();
            selectedItems = activeSelections ?? new List<string>();

            foreach (var item in items)
            {
                CheckBox chk = new CheckBox
                {
                    Text = item,
                    Font = new Font("Arial", 9f, FontStyle.Regular),
                    ForeColor = Color.FromArgb(51, 51, 51),
                    Checked = selectedItems.Contains(item),
                    AutoSize = true,
                    Margin = new Padding(0, 2, 0, 2),
                    Cursor = Cursors.Hand
                };

                chk.CheckedChanged += (s, e) =>
                {
                    if (chk.Checked)
                    {
                        if (!selectedItems.Contains(item)) selectedItems.Add(item);
                    }
                    else
                    {
                        selectedItems.Remove(item);
                    }
                    OnSelectionChanged?.Invoke(this, SelectedItems);
                };

                itemsContainer.Controls.Add(chk);
            }
        }
    }
}