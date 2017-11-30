using MyRoutine.Data.Entities;
using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Areas.Admin.ViewModels.EditPicky;
using MyRoutine.Web.Controllers;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Linq;
using System.Web.Mvc;

namespace MyRoutine.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    public class EditPickyController : BaseController
    {
        readonly IPickyMessageService _pickyMessageService;
        readonly ValidationHelper _validationHelper;

        public EditPickyController(IPickyMessageService pickyMessageService)
        {
            _pickyMessageService = pickyMessageService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public ActionResult Index()
        {
            ViewBag.PickyMessageTypeSelectOptions = JsonConvert.SerializeObject(EnumHelper.EnumToSelectOptions(typeof(PickyMessageType)), new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            return View();
        }

        public JsonResult GetAllMessages(GridFiltersViewModel gridFiltersViewModel)
        {
            var pickyMessagesGridViewModel = new PickyMessagesGridViewModel { GridFilters = gridFiltersViewModel };

            var messages = _pickyMessageService.GetAllWithFilters(pickyMessagesGridViewModel.GridFilters.Search,
                pickyMessagesGridViewModel.GridFilters.SearchEnum, pickyMessagesGridViewModel.GridFilters.Page, pickyMessagesGridViewModel.GridFilters.PageSize);

            pickyMessagesGridViewModel.PickyMessages = (from pickyMessage in messages
                                                        select new PickyMessageViewModel
                                                        {
                                                            Id = pickyMessage.Id,
                                                            Type = pickyMessage.Type,
                                                            Message = pickyMessage.Message
                                                        }).OrderByDescending(x => x.Id).ToList();

            pickyMessagesGridViewModel.GridFilters.ItemCount = _pickyMessageService.CountAllWithFilters(pickyMessagesGridViewModel.GridFilters.Search,
                pickyMessagesGridViewModel.GridFilters.SearchEnum);

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, pickyMessagesGridViewModel), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditMessage(PickyEditMessageViewModel viewModel)
        {
            PickyMessageType? pickySuccessMessageType = null;

            if (ModelState.IsValid)
            {
                PickyMessage pickyMessage;

                if (viewModel.Id == 0)
                {
                    pickyMessage = new PickyMessage
                    {
                        Type = (byte)viewModel.Type,
                        Message = viewModel.Message.Trim()
                    };

                    try
                    {
                        _pickyMessageService.Create(pickyMessage);
                        pickySuccessMessageType = PickyMessageType.CreatePickyMessageSuccess;
                    }
                    catch (Exception)
                    {
                        ModelState.AddModelError("", @"An error occured while adding the message.");
                    }
                }
                else
                {
                    pickyMessage = _pickyMessageService.GetById(viewModel.Id);
                    if (pickyMessage != null)
                    {
                        pickyMessage.Type = (byte)viewModel.Type;
                        pickyMessage.Message = viewModel.Message.Trim();

                        try
                        {
                            _pickyMessageService.Update(pickyMessage);
                            pickySuccessMessageType = PickyMessageType.EditPickyMessageSuccess;
                        }
                        catch
                        {
                            ModelState.AddModelError("", @"An error occured while updating the message.");
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("", @"An error occured while updating the message.");
                    }
                }
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, pickySuccessMessageType));
        }

        [HttpPost]
        public JsonResult DeleteMessage(int id)
        {
            var pickyMessage = _pickyMessageService.GetById(id);
            if (pickyMessage != null)
            {
                try
                {
                    _pickyMessageService.Delete(pickyMessage);
                }
                catch (MyException e)
                {
                    ModelState.AddModelError("", e.Message);
                }
                catch (Exception)
                {
                    ModelState.AddModelError("", @"An error occured while deleting the message.");
                }
            }
            else
            {
                ModelState.AddModelError("", @"An error occured while deleting the message.");
            }

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, null, PickyMessageType.DeletePickyMessageSuccess));
        }
    }
}