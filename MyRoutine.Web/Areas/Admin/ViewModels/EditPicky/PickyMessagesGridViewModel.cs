using MyRoutine.Web.ViewModels;
using System.Collections.Generic;

namespace MyRoutine.Web.Areas.Admin.ViewModels.EditPicky
{
    public class PickyMessagesGridViewModel
    {
        public PickyMessagesGridViewModel()
        {
            PickyMessages = new List<PickyMessageViewModel>();
        }

        public List<PickyMessageViewModel> PickyMessages { get; set; }
        public GridFiltersViewModel GridFilters { get; set; }
    }
}