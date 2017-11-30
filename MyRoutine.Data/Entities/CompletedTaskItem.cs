using System;

namespace MyRoutine.Data.Entities
{
    public class CompletedTaskItem : Entity
    {
        public override int Id { get; set; }
        public DateTime Date { get; set; }
        public short? DurationMinutes { get; set; }
        public short? Repetitions { get; set; }


        // Navigation properties
        public int TaskId { get; set; }
    }
}