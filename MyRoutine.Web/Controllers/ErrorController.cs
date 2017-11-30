using System.Web.Mvc;

namespace MyRoutine.Web.Controllers
{
    public class ErrorController : BaseController
    {
        public ActionResult PageNotFound()
        {
            Response.StatusCode = 404;
            return View();
        }
	}
}