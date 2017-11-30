using System;
using System.Collections.Generic;

namespace MyRoutine.Data.Entities
{
    public class Task : Entity
    {
        public Task()
        {
            CompletedTaskItems = new List<CompletedTaskItem>();
        }

        public override int Id { get; set; }
        public string Title { get; set; }
        public string ShortTitle { get; set; }
        public string Description { get; set; }
        public short? DurationMinutes { get; set; }
        public short? Repetitions { get; set; }
        public byte Theme { get; set; }
        public short? Order { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsArchived { get; set; }


        // Navigation properties
        public int UserId { get; set; }
        public ICollection<CompletedTaskItem> CompletedTaskItems { get; set; }


        public void Archive()
        {
            IsArchived = true;
            Order = null;
        }

        public void Restore(int activeTasksCount)
        {
            IsArchived = false;
            Order = Convert.ToInt16(activeTasksCount + 1);
        }
    }
}