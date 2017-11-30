using System.Collections.Generic;

namespace MyRoutine.Web.ViewModels.Tasks
{
    public class GetAllViewModel
    {
        public GetAllViewModel()
        {
            ActiveTasks = new List<TaskViewModel>();
            ArchivedTasks = new List<TaskViewModel>();
        }

        public List<TaskViewModel> ActiveTasks { get; set; }
        public List<TaskViewModel> ArchivedTasks { get; set; }
    }
}