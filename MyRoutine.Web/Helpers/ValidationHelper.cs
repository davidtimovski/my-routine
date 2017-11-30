using MyRoutine.Service;
using MyRoutine.Service.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;
using System.Web.Mvc;

namespace MyRoutine.Web.Helpers
{
    public class ValidationHelper
    {
        private readonly IPickyMessageService _pickyMessageService;
        private readonly string _currentUserName;

        public ValidationHelper(IPickyMessageService pickyMessageService, string currentUserName)
        {
            _pickyMessageService = pickyMessageService;
            _currentUserName = currentUserName;
        }



        public string ModelStateToJsonResult(ModelStateDictionary modelState, object result = null, PickyMessageType? pickySuccessMessageType = null)
        {
            var formErrors = (from pair in modelState
                              where pair.Value.Errors.Count > 0
                              select new ModelError
                              {
                                  FieldId = pair.Key,
                                  ErrorMessages = pair.Value.Errors.Select(error => error.ErrorMessage).ToList()
                              }).ToList();

            var validationJsonResult = new ValidationJsonResult();

            if (formErrors.Count == 0)
            {
                validationJsonResult.IsSuccessful = true;
                validationJsonResult.Result = result;

                if (pickySuccessMessageType.HasValue)
                    validationJsonResult.PickyMessage = _pickyMessageService.GetRandomByType((PickyMessageType)pickySuccessMessageType, _currentUserName);
            }
            else
            {
                validationJsonResult.IsSuccessful = false;
                validationJsonResult.Errors = formErrors;
                validationJsonResult.PickyMessage = _pickyMessageService.GetRandomByType(PickyMessageType.FormErrors, _currentUserName);
            }

            return JsonConvert.SerializeObject(validationJsonResult, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }
    }
}