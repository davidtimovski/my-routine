using MyRoutine.Data;
using MyRoutine.Data.Entities;
using MyRoutine.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace MyRoutine.Service.Implementations
{
    public class PickyMessageService : EntityService<PickyMessage>, IPickyMessageService
    {
        readonly IContext _context;

        public PickyMessageService(IContext context)
            : base(context)
        {
            _context = context;
            Dbset = _context.Set<PickyMessage>();
        }



        public PickyMessage GetById(int id)
        {
            return Dbset.FirstOrDefault(x => x.Id == id);
        }

        public override void Delete(PickyMessage pickyMessage)
        {
            int typeCount = Dbset.Count(x => x.Type == pickyMessage.Type);
            if (typeCount == 1)
            {
                throw new MyException("You're attempting to delete the last message of this type. I cannot allow you to do this.");
            }

            _context.Entry(pickyMessage).State = EntityState.Deleted;
            _context.SaveChanges();
        }

        public int CountAllWithFilters(string searchMessage, byte? searchType)
        {
            searchMessage = searchMessage ?? "";
            return searchType.HasValue ? Dbset.Count(x => x.Message.Contains(searchMessage) && x.Type == searchType) : Dbset.Count(x => x.Message.Contains(searchMessage));
        }

        public override IEnumerable<PickyMessage> GetAll()
        {
            return Dbset.ToList();
        }

        public IEnumerable<PickyMessage> GetAllWithFilters(string searchMessage, byte? searchType, short page, byte pageSize)
        {
            searchMessage = searchMessage ?? "";
            var messages = Dbset.Where(x => x.Message.Contains(searchMessage));

            if (searchType.HasValue)
            {
                messages = messages.Where(x => x.Type == searchType);
            }

            return messages.OrderByDescending(x => x.Id)
                    .Skip(pageSize * (page - 1))
                    .Take(pageSize)
                    .ToList();
        }

        public string GetRandomByType(PickyMessageType pickyMessageType, string currentUserName)
        {
            var messages = Dbset.Where(x => x.Type == (byte)pickyMessageType).ToArray();
            if (messages.Length == 0)
            {
                throw new MyException("Tell the developer that no messages exist for the [" + pickyMessageType + "] type. He needs to create some!");
            }

            var random = new Random();
            int randomIndex = random.Next(0, messages.Length);
            return messages[randomIndex].Message.Replace("#USER#", currentUserName);
        }
    }
}