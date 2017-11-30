using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Areas.Admin.ViewModels.Statistics;
using MyRoutine.Web.Controllers;
using MyRoutine.Web.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MyRoutine.Web.Areas.Admin.Controllers
{
    public class StatisticsController : BaseController
    {
        readonly IUserService _userService;
        readonly ITaskService _taskService;
        readonly ValidationHelper _validationHelper;

        public StatisticsController(IUserService userService, ITaskService taskService, IPickyMessageService pickyMessageService)
        {
            _userService = userService;
            _taskService = taskService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetStatistics()
        {
            var statisticsViewModel = new StatisticsViewModel();

            List<DateTime> allRegistrationDates = _userService.GetAllRegistrationDates();
            List<DateTime> allTaskCreateDates = _taskService.GetAllTaskCreateDates();
            List<DateTime> allTaskItemCompleteDates = _taskService.GetAllTaskItemCompleteDates();

            statisticsViewModel.UserRegistrationsToday = allRegistrationDates.Count(x => x.Date == DateTime.Today.Date);
            statisticsViewModel.UserRegistrationsPerMonth = allRegistrationDates.GroupBy(x => new { x.Year, x.Month })
                .Select(x => new PerMonthViewModel
                {
                    Month = new DateTime(x.Key.Year, x.Key.Month, 1),
                    Count = x.Count()
                }).ToList();

            statisticsViewModel.TasksCreatedToday = allTaskCreateDates.Count(x => x.Date == DateTime.Today.Date);
            statisticsViewModel.TasksCreatedPerMonth = allTaskCreateDates.GroupBy(x => new { x.Year, x.Month })
                .Select(x => new PerMonthViewModel
                {
                    Month = new DateTime(x.Key.Year, x.Key.Month, 1),
                    Count = x.Count()
                }).ToList();

            statisticsViewModel.TasksCompletedToday = allTaskItemCompleteDates.Count(x => x.Date == DateTime.Today.Date);
            statisticsViewModel.TasksCompletedPerMonth = allTaskItemCompleteDates.GroupBy(x => new { x.Year, x.Month })
                .Select(x => new PerMonthViewModel
                {
                    Month = new DateTime(x.Key.Year, x.Key.Month, 1),
                    Count = x.Count()
                }).ToList();

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, statisticsViewModel), JsonRequestBehavior.AllowGet);
        }
	}
}