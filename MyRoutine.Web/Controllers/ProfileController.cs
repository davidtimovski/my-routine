using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels.Profile;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;

namespace MyRoutine.Web.Controllers
{
    public class ProfileController : BaseController
    {
        readonly IUserService _userService;
        readonly ITaskService _taskService;
        readonly ValidationHelper _validationHelper;

        public ProfileController(IUserService userService, ITaskService taskService, IPickyMessageService pickyMessageService)
        {
            _userService = userService;
            _taskService = taskService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetProfileDetails()
        {
            var profileDetailsViewModel = new ProfileDetailsViewModel();
            var user = _userService.GetById(WebSecurity.CurrentUserId);

            if (user != null)
            {
                profileDetailsViewModel.ActiveTasksCount = _taskService.CountAllByUserId(WebSecurity.CurrentUserId, false);
                profileDetailsViewModel.ArchivedTasksCount = _taskService.CountAllByUserId(WebSecurity.CurrentUserId, true);
                profileDetailsViewModel.CompletedTasksCount = _taskService.CountCompletedTaskItemsByUserId(WebSecurity.CurrentUserId);
                profileDetailsViewModel.CompletedMinutesCount = _taskService.CountCompletedMinutesByUserId(WebSecurity.CurrentUserId);

                profileDetailsViewModel.UserDetails = new UserDetailsViewModel
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    DateRegistered = user.DateRegistered
                };
            }
            else
            {
                throw new MyException("An authorization error occurred.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, profileDetailsViewModel));
        }

        [HttpPost]
        public JsonResult ChangeUserDetails(ChangeUserDetailsViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                if (Membership.ValidateUser(viewModel.OriginalEmail, viewModel.Password))
                {
                    var user = _userService.GetById(WebSecurity.CurrentUserId);
                    if (user != null)
                    {
                        user.Email = viewModel.Email.Trim();
                        user.Name = viewModel.Name.Trim();
                        _userService.Update(user);

                        UserSessionData.Email = user.Email;
                        UserSessionData.Name = user.Name;

                        if (!user.Email.Equals(viewModel.OriginalEmail))
                        {
                            WebSecurity.Logout();
                            WebSecurity.Login(user.Email, viewModel.Password);
                        }
                    }
                    else
                    {
                        throw new MyException("An authorization error occurred.");
                    }
                }
                else
                {
                    throw new MyException("Invalid credentials.");
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.ChangeUserDetailsSuccess));
        }

        [HttpPost]
        public JsonResult ChangePassword(ChangePasswordViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                // ChangePassword will throw an exception rather than return false in certain failure scenarios.
                if (!WebSecurity.ChangePassword(User.Identity.Name, viewModel.OldPassword, viewModel.NewPassword))
                {
                    ModelState.AddModelError("", @"The current password is incorrect or the new password is invalid.");
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.ChangePasswordSuccess));
        }
	}
}