using MyRoutine.Service;
using System.Collections.Generic;

namespace MyRoutine.Web.ViewModels.Overview
{
    public class TaskViewModel
    {
        public TaskViewModel()
        {
            CompletedTaskItems = new List<TaskItemViewModel>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string ShortTitle { get; set; }
        public string Description { get; set; }
        public short? DurationMinutes { get; set; }
        public short? Repetitions { get; set; }
        public TaskTheme Theme { get; set; }
        public string ThemeName { get; set; }
        public short? Order { get; set; }
        public List<TaskItemViewModel> CompletedTaskItems { get; set; }
    }
}