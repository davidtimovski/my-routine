using MyRoutine.Data.Entities;
using System;
using System.Collections.Generic;

namespace MyRoutine.Service.Interfaces
{
    public interface IUserService : IEntityService<User>
    {
        User GetById(int id);
        User GetByEmail(string email);
        User GetCurrentUser();
        int GetCurrentUserId();
        bool IsLoggedIn();
        void Login(string email, string password, bool persistCookie = false);
        void Logout();
        string Register(string name, string email, string password);
        bool RegistrationTokenIsValid(string token);
        string GeneratePasswordResetToken(string email);
        bool ResetPassword(string token, string newPassword);
        bool PasswordIsValidForCurrentUser(string password);
        void Ban(User user, string banReason);
        void Unban(User user);
        new void Delete(User user);
        int CountAllWithFilters(int currentUserId, string searchName, string searchEmail);
        IEnumerable<User> GetAll(string[] emails);
        IEnumerable<User> GetAllWithFilters(int currentUserId, string searchName, string searchEmail, string sortColumn, bool sortDirectionIsAscending, short page, byte pageSize);
        List<DateTime> GetAllRegistrationDates();
    }
}