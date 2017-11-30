using System;

namespace MyRoutine.Web.ViewModels.Profile
{
    public class UserDetailsViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime DateRegistered { get; set; }
    }
}