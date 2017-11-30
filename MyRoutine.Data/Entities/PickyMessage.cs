namespace MyRoutine.Data.Entities
{
    public class PickyMessage : Entity
    {
        public override int Id { get; set; }
        public byte Type { get; set; }
        public string Message { get; set; }
    }
}