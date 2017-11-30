using System.Collections.Generic;

namespace MyRoutine.Web.ViewModels.Overview
{
    public class ScheduleTasksViewModel
    {
        public ScheduleTasksViewModel()
        {
            Tasks = new List<TaskViewModel>();
        }

        public List<TaskViewModel> Tasks { get; set; }
        public bool ScheduleIsCompact { get; set; }
        public bool IsLastLoad { get; set; }
    }
}