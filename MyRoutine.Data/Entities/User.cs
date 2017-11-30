using System;
using System.Collections.Generic;

namespace MyRoutine.Data.Entities
{
    public class User : Entity
    {
        public User()
        {
            Tasks = new List<Task>();
        }

        public override int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime DateRegistered { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsBanned { get; set; }
        public DateTime? BanDate { get; set; }
        public string BanReason { get; set; }
        public bool ScheduleIsCompact { get; set; }


        // Navigation properties
        public ICollection<Task> Tasks { get; set; }
        public UserMembership Membership { get; set; }


        public void Ban(string reason)
        {
            IsBanned = true;
            BanDate = DateTime.Now;
            BanReason = reason;
        }

        public void Unban()
        {
            IsBanned = false;
            BanDate = null;
            BanReason = null;
        }
    }
}