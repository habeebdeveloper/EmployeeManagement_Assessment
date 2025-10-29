using System.Web.Mvc;
using System.Web.Routing;

namespace Habeeb_Assessment
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Add specific route for login page
            routes.MapRoute(
                name: "Login",
                url: "Account/Login",
                defaults: new { controller = "Account", action = "Login" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}",
                defaults: new { controller = "Account", action = "Login" }
            );
        }
    }
}
