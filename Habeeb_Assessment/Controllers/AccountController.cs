using System;
using System.Web.Mvc;

namespace Habeeb_Assessment.Controllers
{
    public class AccountController : Controller
    {

        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LoginUser(string Username, string Password)
        {
            try
            {
                
                if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
                    return Json(new { success = false, message = "Username and password are required." });

                string connStr = System.Configuration.ConfigurationManager
                                        .ConnectionStrings["EmployeeDB"].ConnectionString;

                using (var conn = new System.Data.SqlClient.SqlConnection(connStr))
                using (var cmd = new System.Data.SqlClient.SqlCommand("sp_ValidateUser", conn))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserName", Username);
                    cmd.Parameters.AddWithValue("@Password", Password);

                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.HasRows)
                        {
                            return Json(new { success = false, message = "Invalid username or password." });
                        }

                        reader.Read();
                        var userId = Convert.ToInt64(reader["UserId"]);
                        var userName = reader["UserName"].ToString();

                        Session["UserId"] = userId;
                        Session["UserName"] = userName;

                        return Json(new { success = true });
                    }
                }
            }
            catch
            {
                return Json(new { success = false, message = "Login failed. Try again." });
            }
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Login", "Account");
        }
    }
}