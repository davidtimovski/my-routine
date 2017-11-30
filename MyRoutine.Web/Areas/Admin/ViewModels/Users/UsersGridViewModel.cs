using MyRoutine.Web.ViewModels;
using System.Collections.Generic;

namespace MyRoutine.Web.Areas.Admin.ViewModels.Users
{
    public class UserGridViewModel
    {
        public UserGridViewModel()
        {
            Users = new List<UserViewModel>();
        }

        public List<UserViewModel> Users { get; set; }
        public GridFiltersViewModel GridFilters { get; set; }
    }
}