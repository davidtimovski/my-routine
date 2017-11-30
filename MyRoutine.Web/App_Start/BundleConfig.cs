using System.Web.Optimization;

namespace MyRoutine.Web.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/styles").Include(
                        "~/Content/css/reset.css",
                        "~/Content/css/responsive.gs.12col.css",
                        "~/Content/css/icons.css",
                        "~/Content/css/site.css"));

            bundles.Add(new ScriptBundle("~/Scripts/global").Include(
                        "~/Scripts/jquery-2.1.4.min.js",
                        "~/Scripts/knockout-3.4.0.min.js",
                        "~/Scripts/knockout-mapping-2.4.1.min.js",
                        "~/Scripts/velocity-1.2.3.min.js",
                        "~/Scripts/velocity-ui-1.2.3.min.js",
                        "~/Scripts/moment-2.13.0.min.js",
                        "~/JS/app.js"));

            bundles.Add(new ScriptBundle("~/JS/picky").Include(
                        "~/JS/picky.js"));
        }
    }
}