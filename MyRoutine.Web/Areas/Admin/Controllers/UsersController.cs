using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Areas.Admin.ViewModels.Users;
using MyRoutine.Web.Controllers;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels;
using System.Linq;
using System.Web.Mvc;
using WebMatrix.WebData;

namespace MyRoutine.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsersController : BaseController
    {
        readonly IUserService _userService;
        readonly ValidationHelper _validationHelper;

        public UsersController(IUserService userService, IPickyMessageService pickyMessageService)
        {
            _userService = userService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAll(GridFiltersViewModel gridFiltersViewModel)
        {
            var userGridViewModel = new UserGridViewModel { GridFilters = gridFiltersViewModel };

            var users = _userService.GetAllWithFilters(WebSecurity.CurrentUserId, userGridViewModel.GridFilters.Search, userGridViewModel.GridFilters.SearchAdditional,
                userGridViewModel.GridFilters.SortColumn, userGridViewModel.GridFilters.SortDirectionIsAscending,
                userGridViewModel.GridFilters.Page, userGridViewModel.GridFilters.PageSize);

            userGridViewModel.Users = (from user in users
                                        where user.Id != WebSecurity.CurrentUserId
                                        select new UserViewModel
                                        {
                                            Id = user.Id,
                                            Email = user.Email,
                                            Name = user.Name,
                                            DateRegistered = user.DateRegistered,
                                            LastLoginAt = user.LastLoginAt,
                                            IsBanned = user.IsBanned,
                                            BanDate = user.BanDate,
                                            BanReason = user.BanReason,
                                            MembershipIsConfirmed = user.Membership.IsConfirmed
                                        }).ToList();

            userGridViewModel.GridFilters.ItemCount = _userService.CountAllWithFilters(WebSecurity.CurrentUserId, userGridViewModel.GridFilters.Search, userGridViewModel.GridFilters.SearchAdditional);

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, userGridViewModel), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Ban(BanUserViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                var user = _userService.GetById(viewModel.Id);
                if (user != null)
                {
                    _userService.Ban(user, viewModel.BanReason.Trim());
                }
                else
                {
                    ModelState.AddModelError("", @"An error occured while banning the user.");
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.BanUserSuccess));
        }

        [HttpPost]
        public JsonResult Unban(int id)
        {
            var user = _userService.GetById(id);
            if (user != null)
            {
                _userService.Unban(user);
            }
            else
            {
                ModelState.AddModelError("", @"An error occured while unbanning the user.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.UnbanUserSuccess));
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            var user = _userService.GetById(id);
            if (user != null)
            {
                _userService.Delete(user);
            }
            else
            {
                ModelState.AddModelError("", @"An error occured while deleting the user.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.DeleteUserSuccess));
        }
    }
}