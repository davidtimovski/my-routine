namespace MyRoutine.Web.ViewModels.Profile
{
    public class ProfileDetailsViewModel
    {
        public UserDetailsViewModel UserDetails { get; set; }
        public int ActiveTasksCount { get; set; }
        public int ArchivedTasksCount { get; set; }
        public int CompletedTasksCount { get; set; }
        public int CompletedMinutesCount { get; set; }
    }
}