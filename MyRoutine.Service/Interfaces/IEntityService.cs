using MyRoutine.Data;
using System.Collections.Generic;

namespace MyRoutine.Service.Interfaces
{
    public interface IEntityService<T> : IService
       where T : BaseEntity
    {
        void Create(T entity);
        void Delete(T entity);
        IEnumerable<T> GetAll();
        void Update(T entity);
    }
}