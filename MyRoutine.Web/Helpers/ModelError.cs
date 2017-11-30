using System.Collections.Generic;

namespace MyRoutine.Web.Helpers
{
    public class ModelError
    {
        public ModelError()
        {
            ErrorMessages = new List<string>();
        }

        public string FieldId { get; set; }
        public List<string> ErrorMessages { get; set; }
    }
}