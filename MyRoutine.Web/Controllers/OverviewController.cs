using MyRoutine.Data.Entities;
using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels.Overview;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebMatrix.WebData;

namespace MyRoutine.Web.Controllers
{
    [Authorize(Roles = "User")]
    public class OverviewController : BaseController
    {
        readonly ITaskService _taskService;
        readonly IUserService _userService;
        readonly ValidationHelper _validationHelper;

        public OverviewController(ITaskService taskService, IUserService userService, IPickyMessageService pickyMessageService)
        {
            _taskService = taskService;
            _userService = userService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public ActionResult Index()
        {
            // Logout if user is banned
            var user = _userService.GetById(WebSecurity.CurrentUserId);
            if (user.IsBanned)
            {
                WebSecurity.Logout();
                UserSessionData.Empty();
                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        public JsonResult GetTasksForSchedule(ScheduleFilterViewModel scheduleFilterViewModel)
        {
            var scheduleTasksViewModel = new ScheduleTasksViewModel
            {
                ScheduleIsCompact = UserSessionData.ScheduleIsCompact
            };

            DateTime currentUserRegistrationDate = UserSessionData.DateRegistered;
            if (currentUserRegistrationDate.Year == scheduleFilterViewModel.FromDate.Year &&
                currentUserRegistrationDate.Month == scheduleFilterViewModel.FromDate.Month)
            {
                scheduleTasksViewModel.IsLastLoad = true;
            }

            var allTasks = _taskService.GetAllForSchedule(WebSecurity.CurrentUserId, scheduleFilterViewModel.FromDate, scheduleFilterViewModel.ToDate);
            scheduleTasksViewModel.Tasks = (from task in allTasks
                                            select new TaskViewModel
                                            {
                                                Id = task.Id,
                                                Title = task.Title,
                                                ShortTitle = task.ShortTitle,
                                                Description = task.Description,
                                                DurationMinutes = task.DurationMinutes,
                                                Repetitions = task.Repetitions,
                                                Theme = (TaskTheme)task.Theme,
                                                ThemeName = ((TaskTheme)task.Theme).ToString().ToLower(),
                                                Order = task.Order,
                                                CompletedTaskItems = (from completedTaskItem in task.CompletedTaskItems
                                                                      select new TaskItemViewModel
                                                                  {
                                                                      Id = completedTaskItem.Id,
                                                                      TaskId = completedTaskItem.TaskId,
                                                                      Date = completedTaskItem.Date,
                                                                      DurationMinutes = completedTaskItem.DurationMinutes,
                                                                      Repetitions = completedTaskItem.Repetitions
                                                                  }).ToList()
                                            }).OrderBy(x => x.Order).ToList();

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, scheduleTasksViewModel), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveTaskItems(List<TaskItemViewModel> taskItemViewModels)
        {
            var addedTaskItems = new List<CompletedTaskItem>();

            if (ModelState.IsValid)
            {
                DateTime currentUserRegistrationDate = UserSessionData.DateRegistered;

                var taskItems = taskItemViewModels.Select(taskItemViewModel => new CompletedTaskItem
                {
                    Id = taskItemViewModel.Id,
                    TaskId = taskItemViewModel.TaskId,
                    Date = taskItemViewModel.Date,
                    DurationMinutes = (taskItemViewModel.DurationMinutes != 0) ? taskItemViewModel.DurationMinutes : null,
                    Repetitions = (taskItemViewModel.Repetitions != 0) ? taskItemViewModel.Repetitions : null
                }).ToList();

                addedTaskItems = _taskService.UpdateTaskItems(taskItems, currentUserRegistrationDate);
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, addedTaskItems, PickyMessageType.ScheduleSaveSuccess));
        }

        [HttpPost]
        public JsonResult ToggleScheduleIsCompact(bool scheduleIsCompact)
        {
            var currentUser = _userService.GetById(WebSecurity.CurrentUserId);

            if (currentUser != null)
            {
                UserSessionData.ScheduleIsCompact = scheduleIsCompact;

                currentUser.ScheduleIsCompact = scheduleIsCompact;
                _userService.Update(currentUser);
            }
            else
            {
                throw new MyException("An authorization error occurred.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }
    }
}