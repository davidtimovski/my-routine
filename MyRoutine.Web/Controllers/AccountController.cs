using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels.Account;
using System.Web.Mvc;

namespace MyRoutine.Web.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        readonly IUserService _userService;
        readonly IEmailService _emailService;
        readonly ValidationHelper _validationHelper;

        public AccountController(IUserService userService, IEmailService emailService, IPickyMessageService pickyMessageService)
        {
            _userService = userService;
            _emailService = emailService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        [HttpPost]
        [AllowAnonymous]
        public JsonResult Login(LoginViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                _userService.Login(viewModel.Email, viewModel.Password, viewModel.RememberMe);
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }

        [HttpPost]
        public JsonResult LogOut()
        {
            _userService.Logout();
            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }

        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            if (_userService.IsLoggedIn())
            {
                return RedirectToAction("Index", "Overview");
            }

            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult SendPasswordResetEmail(ResetPasswordViewModel viewModel)
        {
            var user = _userService.GetByEmail(viewModel.Email.Trim());
            if (user != null)
            {
                _emailService.SendPasswordResetEmail(user.Name, user.Email, _userService.GeneratePasswordResetToken(user.Email));
            }
            else
            {
                ModelState.AddModelError("", @"We are unfamiliar with the email you provided. Are you sure you are a registered user?");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }

        [AllowAnonymous]
        public ActionResult ResetPasswordConfirm(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return RedirectToAction("Index", "Home");
            }

            var model = new ResetPasswordConfirmViewModel { Token = token };
            return View(model);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult ResetPasswordConfirm(ResetPasswordConfirmViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (!_userService.ResetPassword(model.Token, model.NewPassword))
                {
                    throw new MyException("The reset token is invalid.");
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            if (_userService.IsLoggedIn())
            {
                return RedirectToAction("Index", "Overview");
            }

            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public JsonResult Register(RegisterViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                var confirmationToken = _userService.Register(viewModel.Name.Trim(), viewModel.Email.Trim(), viewModel.Password);
                _emailService.SendRegisterConfirmEmail(viewModel.Name.Trim(), viewModel.Email.Trim(), confirmationToken);
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }

        [AllowAnonymous]
        public ActionResult RegisterConfirmation(string token)
        {
            if (_userService.RegistrationTokenIsValid(token))
            {
                return RedirectToAction("Index", "Home", new { returnUrl = "", justRegistered = true });
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public JsonResult VerifyCurrentUser(VerifyCurrentAccountViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                if (!_userService.PasswordIsValidForCurrentUser(viewModel.DeleteConfirmPassword))
                {
                    ModelState.AddModelError("DeleteConfirmPassword", @"The password you provided is invalid.");
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }

        [HttpPost]
        public JsonResult DeleteAccount(DeleteAccountViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                if (!_userService.PasswordIsValidForCurrentUser(viewModel.DeleteConfirmPassword))
                {
                    ModelState.AddModelError("DeleteConfirmPassword", @"The password you provided is invalid.");
                }

                var currentUser = _userService.GetCurrentUser();

                _userService.Logout();
                _userService.Delete(currentUser);
                _emailService.SendAccountDeletionReasonsEmail(viewModel.Reason, viewModel.Elaboration, viewModel.Suggestions);
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }
    }
}