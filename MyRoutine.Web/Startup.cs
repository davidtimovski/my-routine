using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MyRoutine.Web.Startup))]
namespace MyRoutine.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
