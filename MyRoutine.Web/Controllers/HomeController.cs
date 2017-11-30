using MyRoutine.Service.Interfaces;
using System.Web.Mvc;

namespace MyRoutine.Web.Controllers
{
    public class HomeController : BaseController
    {
        readonly IUserService _userService;

        public HomeController(IUserService userService)
        {
            _userService = userService;
        }



        public ActionResult Index(string returnUrl, bool justRegistered = false, bool accountDeleted = false)
        {
            if (_userService.IsLoggedIn())
            {
                return RedirectToAction("Index", "Overview");
            }

            ViewBag.ReturnUrl = returnUrl;
            ViewBag.JustRegistered = justRegistered;
            ViewBag.AccountDeleted = accountDeleted;
            return View();
        }

        public ActionResult About()
        {
            return View();
        }
    }
}