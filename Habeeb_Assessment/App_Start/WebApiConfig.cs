using Newtonsoft.Json;
using System.Web.Http;

namespace Habeeb_Assessment
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Enable attribute routing
            config.MapHttpAttributeRoutes();

            // Default route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Force JSON as the default response format
            config.Formatters.JsonFormatter.SerializerSettings.Formatting = Formatting.Indented;

            // Make JSON property names use camelCase
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
                new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();

            // Remove XML formatter so only JSON is returned
            config.Formatters.Remove(config.Formatters.XmlFormatter);
        }
    }
}
