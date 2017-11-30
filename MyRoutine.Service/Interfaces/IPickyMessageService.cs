using MyRoutine.Data.Entities;
using System.Collections.Generic;

namespace MyRoutine.Service.Interfaces
{
    public interface IPickyMessageService : IEntityService<PickyMessage>
    {
        PickyMessage GetById(int id);
        new void Delete(PickyMessage pickyMessage);
        int CountAllWithFilters(string searchMessage, byte? searchType);
        new IEnumerable<PickyMessage> GetAll();
        IEnumerable<PickyMessage> GetAllWithFilters(string searchMessage, byte? searchType, short page, byte pageSize);
        string GetRandomByType(PickyMessageType pickyMessageType, string currentUserName);
    }
}