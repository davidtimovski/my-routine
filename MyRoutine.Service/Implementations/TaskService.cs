using MyRoutine.Data;
using MyRoutine.Data.Entities;
using MyRoutine.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace MyRoutine.Service.Implementations
{
    public class TaskService : EntityService<Task>, ITaskService
    {
        readonly IContext _context;

        public TaskService(IContext context)
            : base(context)
        {
            _context = context;
            Dbset = _context.Set<Task>();
        }



        public Task GetById(int id)
        {
            return Dbset.FirstOrDefault(x => x.Id == id);
        }

        public Task Find(int id, int userId)
        {
            return Dbset.FirstOrDefault(x => x.Id == id && x.UserId == userId);
        }

        public Task Find(int id, int userId, bool isArchived)
        {
            return Dbset.FirstOrDefault(x => x.Id == id && x.UserId == userId && x.IsArchived == isArchived);
        }

        public override void Create(Task task)
        {
            if (Dbset.Any(x => x.Id != task.Id
                && x.UserId == task.UserId
                && x.Title.Equals(task.Title, StringComparison.OrdinalIgnoreCase)
                && x.ShortTitle.Equals(task.ShortTitle, StringComparison.OrdinalIgnoreCase)
                && x.Theme == task.Theme))
            {
                throw new MyException("You already have a Task with the same Title, Short Title and Theme.");
            }

            task.Order = Convert.ToInt16(Dbset.Count(x => x.UserId == task.UserId && x.IsArchived == false) + 1);
            Dbset.Add(task);
            _context.SaveChanges();
        }

        public new void Update(Task task)
        {
            if (Dbset.Any(x => x.Id != task.Id
                && x.UserId == task.UserId
                && x.Title.Equals(task.Title, StringComparison.OrdinalIgnoreCase)
                && x.ShortTitle.Equals(task.ShortTitle, StringComparison.OrdinalIgnoreCase)
                && x.Theme == task.Theme))
            {
                throw new MyException("You already have a Task with the same Title, Short Title and Theme.");
            }

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Archive(Task task)
        {
            var tasksToReorder = Dbset.Where(x => x.UserId == task.UserId && x.IsArchived == false && x.Order > task.Order).ToList();
            foreach (var taskToReorder in tasksToReorder)
            {
                taskToReorder.Order--;
                _context.Entry(taskToReorder).State = EntityState.Modified;
            }

            task.Archive();

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Restore(Task task)
        {
            var activeTasksCount = Dbset.Count(x => x.UserId == task.UserId && x.IsArchived == false);
            task.Restore(activeTasksCount);

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Reorder(int oldOrder, int newOrder, int userId)
        {
            var task = Dbset.FirstOrDefault(x => x.UserId == userId && x.IsArchived == false && x.Order == oldOrder);
            if (task == null)
            {
                throw new MyException("Task does not exist in the database.");
            }

            var tasksToReorder = (newOrder > oldOrder) ?
                Dbset.Where(x => x.UserId == userId && x.IsArchived == false && x.Order >= oldOrder && x.Order <= newOrder).ToList()
                : Dbset.Where(x => x.UserId == userId && x.IsArchived == false && x.Order <= oldOrder && x.Order >= newOrder).ToList();

            foreach (var taskToReorder in tasksToReorder)
            {
                taskToReorder.Order = (newOrder > oldOrder) ? --taskToReorder.Order : ++taskToReorder.Order;
                _context.Entry(taskToReorder).State = EntityState.Modified;
            }

            task.Order = (byte?)newOrder;
            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public List<CompletedTaskItem> UpdateTaskItems(List<CompletedTaskItem> taskItems, DateTime ownerRegistrationDate)
        {
            var ownerRegistrationMonth = new DateTime(ownerRegistrationDate.Date.Year, ownerRegistrationDate.Date.Month, 1);
            if (taskItems.Any(x => x.Date < ownerRegistrationMonth))
            {
                throw new MyException("Cannot complete tasks in a month previous to the one when you registered.");
            }
            if (taskItems.Any(x => x.Date > DateTime.Now.Date))
            {
                throw new MyException("Cannot complete tasks in a future date.");
            }

            foreach (var taskItem in taskItems)
            {
                _context.Entry(taskItem).State = taskItem.Id == 0 ? EntityState.Added : EntityState.Deleted;
            }
            _context.SaveChanges();

            return taskItems;
        }

        public int CountAllByUserId(int userId, bool isArchived)
        {
            return Dbset.Count(x => x.UserId == userId && x.IsArchived == isArchived);
        }

        public int CountCompletedTaskItemsByUserId(int userId)
        {
            return (from task in Dbset
                    where task.UserId == userId
                    join completedTask in _context.CompletedTaskItems on task.Id equals completedTask.TaskId
                    select completedTask).Count();
        }

        public int CountCompletedMinutesByUserId(int userId)
        {
            return (from task in Dbset
                    where task.UserId == userId
                    join completedTask in _context.CompletedTaskItems on task.Id equals completedTask.TaskId
                    select completedTask).Sum(x => x.DurationMinutes) ?? 0;
        }

        public override IEnumerable<Task> GetAll()
        {
            return Dbset.ToList();
        }

        public IEnumerable<Task> GetAllByUserId(int userId)
        {
            return Dbset.Include(x => x.CompletedTaskItems).Where(x => x.UserId == userId).ToList();
        }

        public IEnumerable<Task> GetAllForSchedule(int userId, DateTime fromDate, DateTime toDate)
        {
            var tasks = Dbset.Where(x => x.UserId == userId && x.IsArchived == false).ToList();
            var taskIds = tasks.Select(x => x.Id).ToArray();

            var completedTaskItems = _context.CompletedTaskItems.Where(y => taskIds.Contains(y.TaskId) && y.Date >= fromDate && y.Date <= toDate).ToList();

            foreach (var task in tasks)
            {
                var currentTask = task;
                foreach (var item in completedTaskItems.Where(item => item.TaskId == currentTask.Id))
                {
                    task.CompletedTaskItems.Add(item);
                }
            }

            return tasks;
        }

        public List<DateTime> GetAllTaskCreateDates()
        {
            return Dbset.OrderBy(x => x.DateCreated).Select(x => x.DateCreated).ToList();
        }

        public List<DateTime> GetAllTaskItemCompleteDates()
        {
            return _context.CompletedTaskItems.OrderBy(x => x.Date).Select(x => x.Date).ToList();
        }

        public TaskTheme ThemeAutoPick(int userId)
        {
            var userTaskThemes = Dbset.Where(x => x.UserId == userId && x.IsArchived == false).Select(x => (int)x.Theme).Distinct().ToArray();
            var allThemes = Enum.GetValues(typeof(TaskTheme));
            var allValidThemes = Enumerable.Range(1, allThemes.Length - 1).ToArray();
            var random = new Random();
            int randomIndex, theme;

            if (userTaskThemes.Count() == allValidThemes.Length)
            {
                randomIndex = random.Next(0, allValidThemes.Length);
                theme = allValidThemes[randomIndex];
            }
            else
            {
                var unusedThemes = allValidThemes.Except(userTaskThemes).ToArray();
                randomIndex = random.Next(0, unusedThemes.Length);
                theme = unusedThemes[randomIndex];
            }

            return (TaskTheme)theme;
        }
    }
}