using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using MyRoutine.Web.Helpers;
using MyRoutine.Web.ViewModels.Picky;
using System.Web.Mvc;

namespace MyRoutine.Web.Controllers
{
    public class PickyController : BaseController
    {
        readonly IPickyMessageService _pickyMessageService;
        readonly ValidationHelper _validationHelper;

        public PickyController(IPickyMessageService pickyMessageService)
        {
            _pickyMessageService = pickyMessageService;
            _validationHelper = new ValidationHelper(pickyMessageService, UserSessionData.Name);
        }



        public JsonResult GetRandomMessageByType(PickyMessageType pickyMessageType)
        {
            if (pickyMessageType == PickyMessageType.Introduction)
            {
                UserSessionData.HasBeenIntroducedToPicky = true;
                UserSessionData.HasBeenGreetedByPicky = true;
            }

            if (pickyMessageType == PickyMessageType.Greeting || pickyMessageType == PickyMessageType.GreetingBeenAWhile)
            {
                UserSessionData.HasBeenGreetedByPicky = true;
            }

            var pickyViewModel = new PickyViewModel
            {
                Message = _pickyMessageService.GetRandomByType(pickyMessageType, UserSessionData.Name)
            };

            return Json(_validationHelper.ModelStateToJsonResult(ModelState, pickyViewModel), JsonRequestBehavior.AllowGet);
        }
	}
}