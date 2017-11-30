using MyRoutine.Service;
using MyRoutine.Web.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Web.Mvc;

namespace MyRoutine.Web.Controllers
{
    public class BaseController : Controller
    {
        protected override void OnException(ExceptionContext exceptionContext)
        {
            exceptionContext.ExceptionHandled = true;
            var modelError = new Helpers.ModelError();
            var validationResult = new ValidationJsonResult { IsSuccessful = false };

            if (exceptionContext.Exception is MyException)
            {
                modelError.ErrorMessages.Add(exceptionContext.Exception.Message);
            }
            else
            {
                ExceptionLogging.SendErrorToText(exceptionContext);
                modelError.ErrorMessages.Add("An error occurred. Please try again later.");
            }

            validationResult.Errors.Add(modelError);

            var validationResultJson = JsonConvert.SerializeObject(validationResult,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });

            exceptionContext.Result = new JsonResult
            {
                Data = validationResultJson,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}