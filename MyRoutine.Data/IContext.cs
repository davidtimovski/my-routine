using MyRoutine.Data.Entities;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace MyRoutine.Data
{
    public interface IContext
    {
        IDbSet<User> Users { get; set; }
        IDbSet<Task> Tasks { get; set; }
        IDbSet<CompletedTaskItem> CompletedTaskItems { get; set; }
        IDbSet<PickyMessage> PickyMessages { get; set; }

        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;

        int SaveChanges();
    }
}