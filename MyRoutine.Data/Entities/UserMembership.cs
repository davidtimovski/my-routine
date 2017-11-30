namespace MyRoutine.Data.Entities
{
    public class UserMembership : Entity
    {
        public int UserId { get; set; }
        public bool IsConfirmed { get; set; }
    }
}