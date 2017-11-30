using MyRoutine.Data.Entities;
using System;
using System.Collections.Generic;

namespace MyRoutine.Service.Interfaces
{
    public interface ITaskService : IEntityService<Task>
    {
        Task GetById(int id);
        Task Find(int id, int userId);
        Task Find(int id, int userId, bool isArchived);
        new void Update(Task task);
        void Archive(Task task);
        void Restore(Task task);
        void Reorder(int oldOrder, int newOrder, int userId);
        List<CompletedTaskItem> UpdateTaskItems(List<CompletedTaskItem> taskItems, DateTime ownerRegistrationDate);
        int CountAllByUserId(int userId, bool isArchived);
        int CountCompletedTaskItemsByUserId(int userId);
        int CountCompletedMinutesByUserId(int userId);
        IEnumerable<Task> GetAllByUserId(int userId);
        IEnumerable<Task> GetAllForSchedule(int userId, DateTime fromDate, DateTime toDate);
        List<DateTime> GetAllTaskCreateDates();
        List<DateTime> GetAllTaskItemCompleteDates();
        TaskTheme ThemeAutoPick(int userId);
    }
}