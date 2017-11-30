using MyRoutine.Data.Entities;
using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Linq;
using System.Web.Mvc;
using WebMatrix.WebData;

namespace MyRoutine.Web.Controllers
{
    [Authorize]
    public class TasksController : BaseController
    {
        readonly ITaskService _taskService;
        readonly ValidationHelper _validationHelper;

        public TasksController(ITaskService taskService, IPickyMessageService pickyMessageService)
        {
            _taskService = taskService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public ActionResult Index()
        {
            ViewBag.TaskThemeSelectOptions = JsonConvert.SerializeObject(EnumHelper.EnumToSelectOptions(typeof(TaskTheme)), new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            return View();
        }

        public JsonResult GetAll()
        {
            var getAllViewModel = new GetAllViewModel();

            var allTasks = _taskService.GetAllByUserId(WebSecurity.CurrentUserId);
            var allTasksViewModels = (from task in allTasks
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
                                          DateCreated = task.DateCreated,
                                          IsArchived = task.IsArchived,
                                          HasNoCompletedItems = !task.CompletedTaskItems.Any()
                                      }).ToList();

            getAllViewModel.ActiveTasks = allTasksViewModels.Where(x => !x.IsArchived).OrderBy(x => x.Order).ToList();
            getAllViewModel.ArchivedTasks = allTasksViewModels.Where(x => x.IsArchived).OrderByDescending(x => x.DateCreated).ToList();

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, getAllViewModel), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Edit(TaskViewModel viewModel)
        {
            var task = new Task();
            PickyMessageType? pickySuccessMessageType = null;

            if (ModelState.IsValid)
            {
                if (viewModel.Id == 0)
                {
                    task = new Task
                    {
                        UserId = WebSecurity.CurrentUserId,
                        Title = viewModel.Title.Trim(),
                        ShortTitle = string.IsNullOrEmpty(viewModel.ShortTitle) ? null : viewModel.ShortTitle.Trim(),
                        Description = string.IsNullOrEmpty(viewModel.Description) ? null : viewModel.Description.Trim(),
                        DurationMinutes = viewModel.DurationMinutes,
                        Repetitions = viewModel.Repetitions,
                        Theme = (viewModel.Theme != 0) ? (byte)viewModel.Theme : (byte)_taskService.ThemeAutoPick(WebSecurity.CurrentUserId),
                        DateCreated = DateTime.Now,
                        IsArchived = false
                    };

                    _taskService.Create(task);
                    pickySuccessMessageType = PickyMessageType.CreateTaskSuccess;
                }
                else
                {
                    task = _taskService.Find(viewModel.Id, WebSecurity.CurrentUserId, false);
                    if (task != null)
                    {
                        task.UserId = WebSecurity.CurrentUserId;
                        task.Title = viewModel.Title.Trim();
                        task.ShortTitle = string.IsNullOrEmpty(viewModel.ShortTitle) ? null : viewModel.ShortTitle.Trim();
                        task.Description = string.IsNullOrEmpty(viewModel.Description) ? null : viewModel.Description.Trim();
                        task.DurationMinutes = viewModel.DurationMinutes;
                        task.Repetitions = viewModel.Repetitions;
                        task.Theme = (viewModel.Theme != 0) ? (byte)viewModel.Theme : (byte)_taskService.ThemeAutoPick(WebSecurity.CurrentUserId);

                        _taskService.Update(task);
                        pickySuccessMessageType = PickyMessageType.EditTaskSuccess;
                    }
                    else
                    {
                        throw new MyException("The task doesn't exist in the database.");
                    }
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, new { id = task.Id, theme = task.Theme, themeName = ((TaskTheme)task.Theme).ToString().ToLower() }, pickySuccessMessageType));
        }

        [HttpPost]
        public JsonResult Archive(int id)
        {
            var task = _taskService.Find(id, WebSecurity.CurrentUserId, false);
            if (task != null)
            {
                _taskService.Archive(task);
            }
            else
            {
                throw new MyException("The task doesn't exist in the database.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.ArchiveTaskSuccess));
        }

        [HttpPost]
        public JsonResult Restore(int id)
        {
            var task = _taskService.Find(id, WebSecurity.CurrentUserId, true);
            if (task != null)
            {
                _taskService.Restore(task);
            }
            else
            {
                throw new MyException("The task doesn't exist in the database.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.RestoreTaskSuccess));
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            var task = _taskService.Find(id, WebSecurity.CurrentUserId);
            if (task != null)
            {
                _taskService.Archive(task);
                _taskService.Delete(task);
            }
            else
            {
                throw new MyException("The task doesn't exist in the database.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.DeleteTaskSuccess));
        }

        [HttpPost]
        public JsonResult Reorder(int oldOrder, int newOrder)
        {
            _taskService.Reorder(oldOrder, newOrder, WebSecurity.CurrentUserId);

            return Json(_validationHelper.ModelStateToJsonResult(ModelState));
        }
    }
}
