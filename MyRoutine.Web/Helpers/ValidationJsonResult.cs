using System.Collections.Generic;

namespace MyRoutine.Web.Helpers
{
    public class ValidationJsonResult
    {
        public ValidationJsonResult()
        {
            Errors = new List<ModelError>();
        }

        public bool IsSuccessful { get; set; }
        public string PickyMessage { get; set; }
        public List<ModelError> Errors { get; set; }
        public object Result { get; set; }
    }
}