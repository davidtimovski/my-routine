using MyRoutine.Data.Entities;
using System.Data.Entity;

namespace MyRoutine.Data
{
    public class MyRoutineContext : DbContext, IContext
    {
        public MyRoutineContext()
            : base("name=DefaultConnection")
        {
        }

        public IDbSet<User> Users { get; set; }
        public IDbSet<Task> Tasks { get; set; }
        public IDbSet<CompletedTaskItem> CompletedTaskItems { get; set; }
        public IDbSet<PickyMessage> PickyMessages { get; set; }
        
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // UserMembership
            modelBuilder.Entity<UserMembership>().ToTable("webpages_Membership");
            modelBuilder.Entity<UserMembership>().Ignore(x => x.Id);
            modelBuilder.Entity<UserMembership>().HasKey(x => x.UserId);

            // User to UserMembership one-to-one
            modelBuilder.Entity<User>().HasRequired(x => x.Membership).WithOptional();
        }
    }
}