using MyRoutine.Data;
using MyRoutine.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace MyRoutine.Service.Implementations
{
    public abstract class EntityService<T> : IEntityService<T> where T : BaseEntity
    {
        protected IContext Context;
        protected IDbSet<T> Dbset;

        protected EntityService(IContext context)
        {
            Context = context;
            Dbset = Context.Set<T>();
        }

        public virtual void Create(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");
            Dbset.Add(entity);
            Context.SaveChanges();
        }

        public virtual void Update(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");
            Context.Entry(entity).State = EntityState.Modified;
            Context.SaveChanges();
        }

        public virtual void Delete(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");
            Dbset.Remove(entity);
            Context.SaveChanges();
        }

        public virtual IEnumerable<T> GetAll()
        {
            return Dbset.AsEnumerable();
        }
    }
}