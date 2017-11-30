namespace MyRoutine.Data
{
    public abstract class BaseEntity
    {

    }

    public abstract class Entity : BaseEntity, IEntity
    {
        public virtual int Id { get; set; }
    }
}