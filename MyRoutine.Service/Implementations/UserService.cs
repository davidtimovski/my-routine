using MyRoutine.Data;
using MyRoutine.Data.Entities;
using MyRoutine.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Security;
using WebMatrix.WebData;

namespace MyRoutine.Service.Implementations
{
    public class UserService : EntityService<User>, IUserService
    {
        readonly IContext _context;

        public UserService(IContext context)
            : base(context)
        {
            _context = context;
            Dbset = _context.Set<User>();
        }



        public User GetById(int id)
        {
            return Dbset.FirstOrDefault(x => x.Id == id);
        }

        public User GetByEmail(string email)
        {
            return Dbset.FirstOrDefault(x => x.Email == email);
        }

        public User GetCurrentUser()
        {
            return GetById(WebSecurity.CurrentUserId);
        }

        public int GetCurrentUserId()
        {
            return WebSecurity.CurrentUserId;
        }

        public bool IsLoggedIn()
        {
            return WebSecurity.IsAuthenticated;
        }

        public void Login(string email, string password, bool persistCookie = false)
        {
            if (WebSecurity.Login(email, password, persistCookie))
            {
                var user = GetByEmail(email);
                if (user != null)
                {
                    if (!user.IsBanned)
                    {
                        UserSessionData.HasBeenIntroducedToPicky = false;
                        UserSessionData.NoLoginInAWhile = false;

                        if (user.LastLoginAt.HasValue)
                        {
                            UserSessionData.HasBeenIntroducedToPicky = true;
                            UserSessionData.NoLoginInAWhile = (DateTime.Now - (DateTime)user.LastLoginAt).Days >= 7;
                        }

                        user.LastLoginAt = DateTime.Now;
                        Update(user);

                        UserSessionData.Id = user.Id;
                        UserSessionData.Email = user.Email;
                        UserSessionData.Name = user.Name;
                        UserSessionData.DateRegistered = user.DateRegistered;
                        UserSessionData.LastLoginAt = user.LastLoginAt;
                        UserSessionData.ScheduleIsCompact = user.ScheduleIsCompact;
                        UserSessionData.HasBeenGreetedByPicky = false;
                    }
                    else
                    {
                        throw new MyException("Apparently you've been banned :(");
                    }
                }
                else
                {
                    throw new MyException("The email/password combination you provided is incorrect.");
                }
            }
            else
            {
                throw new MyException("The email/password combination you provided is incorrect.");
            }
        }

        public void Logout()
        {
            WebSecurity.Logout();
            UserSessionData.Empty();
        }

        public string Register(string name, string email, string password)
        {
            string confirmationToken;

            try
            {
                confirmationToken = WebSecurity.CreateUserAndAccount(email, password,
                    new
                    {
                        Name = name,
                        DateRegistered = DateTime.Now,
                        IsBanned = false,
                        ScheduleIsCompact = false
                    }, true);
                Roles.AddUserToRole(email, "User");
            }
            catch (MembershipCreateUserException)
            {
                throw new MyException("There is already an account registered with the email address you provided.");
            }

            return confirmationToken;
        }

        public bool RegistrationTokenIsValid(string token)
        {
            return WebSecurity.ConfirmAccount(token);
        }

        public string GeneratePasswordResetToken(string email)
        {
            return WebSecurity.GeneratePasswordResetToken(email);
        }

        public bool ResetPassword(string token, string newPassword)
        {
            return WebSecurity.ResetPassword(token, newPassword);
        }

        public bool PasswordIsValidForCurrentUser(string password)
        {
            var currentUser = GetById(WebSecurity.CurrentUserId);

            if (currentUser != null)
            {
                return Membership.ValidateUser(currentUser.Email, password);
            }

            return false;
        }

        public void Ban(User user, string banReason)
        {
            user.Ban(banReason);

            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Unban(User user)
        {
            user.Unban();

            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public new void Delete(User user)
        {
            var userRoles = Roles.GetRolesForUser(user.Email);
            if (userRoles.Any())
            {
                Roles.RemoveUserFromRoles(user.Email, userRoles);
            }

            ((SimpleMembershipProvider)Membership.Provider).DeleteAccount(user.Email);
            Membership.Provider.DeleteUser(user.Email, true);
        }

        public int CountAllWithFilters(int currentUserId, string searchName, string searchEmail)
        {
            searchName = searchName ?? "";
            searchEmail = searchEmail ?? "";
            return Dbset.Count(x => x.Id != currentUserId && x.Name.Contains(searchName) && x.Email.Contains(searchEmail));
        }

        public override IEnumerable<User> GetAll()
        {
            return Dbset.ToList();
        }

        public IEnumerable<User> GetAllWithFilters(int currentUserId, string searchName, string searchEmail, string sortColumn, bool sortDirectionIsAscending, short page, byte pageSize)
        {
            searchName = searchName ?? "";
            searchEmail = searchEmail ?? "";
            var users = Dbset.Include(x => x.Membership).Where(x => x.Id != currentUserId && x.Name.Contains(searchName) && x.Email.Contains(searchEmail));

            switch (sortColumn)
            {
                case "Email":
                    users = sortDirectionIsAscending ? users.OrderBy(x => x.Email) : users.OrderByDescending(x => x.Email);
                    break;
                case "Name":
                    users = sortDirectionIsAscending ? users.OrderBy(x => x.Name) : users.OrderByDescending(x => x.Name);
                    break;
                case "DateRegistered":
                    users = sortDirectionIsAscending ? users.OrderBy(x => x.DateRegistered) : users.OrderByDescending(x => x.DateRegistered);
                    break;
                case "LastLoginAt":
                    users = sortDirectionIsAscending ? users.OrderBy(x => x.LastLoginAt) : users.OrderByDescending(x => x.LastLoginAt);
                    break;
                case "IsBanned":
                    users = sortDirectionIsAscending ? users.OrderBy(x => x.IsBanned) : users.OrderByDescending(x => x.IsBanned);
                    break;
                default:
                    users = users.OrderByDescending(x => x.DateRegistered);
                    break;
            }

            return users.Skip(pageSize * (page - 1)).Take(pageSize).ToList();
        }

        public List<DateTime> GetAllRegistrationDates()
        {
            return Dbset.OrderBy(x => x.DateRegistered).Select(x => x.DateRegistered).ToList();
        }

        public IEnumerable<User> GetAll(string[] emails)
        {
            return Dbset.Where(x => emails.Contains(x.Email)).ToList();
        }
    }
}