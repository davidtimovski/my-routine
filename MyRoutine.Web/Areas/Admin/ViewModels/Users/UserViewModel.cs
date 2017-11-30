using System;

namespace MyRoutine.Web.Areas.Admin.ViewModels.Users
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime DateRegistered { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsBanned { get; set; }
        public DateTime? BanDate { get; set; }
        public string BanReason { get; set; }
        public bool MembershipIsConfirmed { get; set; }
    }
}