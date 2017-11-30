using System.Collections.Generic;

namespace MyRoutine.Web.Areas.Admin.ViewModels.Statistics
{
    public class StatisticsViewModel
    {
        public StatisticsViewModel()
        {
            UserRegistrationsPerMonth = new List<PerMonthViewModel>();
            TasksCreatedPerMonth = new List<PerMonthViewModel>();
            TasksCompletedPerMonth = new List<PerMonthViewModel>();
        }
        
        public int UserRegistrationsToday { get; set; }
        public int TasksCreatedToday { get; set; }
        public int TasksCompletedToday { get; set; }

        public List<PerMonthViewModel> UserRegistrationsPerMonth { get; set; }
        public List<PerMonthViewModel> TasksCreatedPerMonth { get; set; }
        public List<PerMonthViewModel> TasksCompletedPerMonth { get; set; }
    }
}