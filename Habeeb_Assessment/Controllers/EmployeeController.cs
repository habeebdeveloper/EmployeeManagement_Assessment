using Habeeb_Assessment.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;



namespace Habeeb_Assessment.Controllers
{
    public class EmployeeController : Controller
    {
        public new ActionResult Profile()
        {
            if (Session["UserName"] == null) return RedirectToAction("Login", "Account");
            return View("Profile");
        }

        [HttpGet]
        public JsonResult GetEmployees()
        {
            var list = new List<EmployeeViewModel>();
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["EmployeeDB"].ConnectionString;
                using (var con = new SqlConnection(cs))
                using (var cmd = new SqlCommand("sp_GetAllEmployees", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    using (var r = cmd.ExecuteReader())
                    {
                        while (r.Read())
                        {
                            list.Add(new EmployeeViewModel
                            {
                                EmployeeId = r["EmployeeId"] != DBNull.Value ? Convert.ToInt32(r["EmployeeId"]) : 0,
                                EmployeeNumber = r["EmployeeNumber"]?.ToString() ?? "",
                                EmployeeName = r["EmployeeName"]?.ToString() ?? "",
                                RoleName = r["RoleName"]?.ToString() ?? "",
                                BasicSalary = r["BasicSalary"] != DBNull.Value ? Convert.ToDecimal(r["BasicSalary"]) : 0,
                                DOB = r["DOB"] != DBNull.Value ? Convert.ToDateTime(r["DOB"]).ToString("dd-MM-yyyy") : "",
                                DOJ = r["DOJ"] != DBNull.Value ? Convert.ToDateTime(r["DOJ"]).ToString("dd-MM-yyyy") : "",
                                ReligionId = r["ReligionId"] != DBNull.Value ? Convert.ToInt32(r["ReligionId"]) : 0,
                                ReligionName = r["ReligionName"]?.ToString() ?? "",
                                IsActive = r["IsActive"] != DBNull.Value ? Convert.ToBoolean(r["IsActive"]) : true
                            });
                        }
                    }
                }
                return Json(new { success = true, data = list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetEmployee(int id)
        {
            EmployeeViewModel emp = null;
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["EmployeeDB"].ConnectionString;
                using (var con = new SqlConnection(cs))
                using (var cmd = new SqlCommand("sp_GetEmployeeById", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EmployeeId", id);
                    con.Open();
                    using (var r = cmd.ExecuteReader())
                    {
                        if (r.Read())
                        {
                            emp = new EmployeeViewModel
                            {
                                EmployeeId = r["EmployeeId"] != DBNull.Value ? Convert.ToInt32(r["EmployeeId"]) : 0,
                                EmployeeNumber = r["EmployeeNumber"]?.ToString() ?? "",
                                EmployeeName = r["EmployeeName"]?.ToString() ?? "",
                                RoleName = r["RoleName"]?.ToString() ?? "",
                                BasicSalary = r["BasicSalary"] != DBNull.Value ? Convert.ToDecimal(r["BasicSalary"]) : 0,
                                DOB = r["DOB"] != DBNull.Value ? Convert.ToDateTime(r["DOB"]).ToString("dd-MM-yyyy") : "",
                                DOJ = r["DOJ"] != DBNull.Value ? Convert.ToDateTime(r["DOJ"]).ToString("dd-MM-yyyy") : "",
                                ReligionId = r["ReligionId"] != DBNull.Value ? Convert.ToInt32(r["ReligionId"]) : 0,
                                ReligionName = r["ReligionName"]?.ToString() ?? "",
                                IsActive = r["IsActive"] != DBNull.Value ? Convert.ToBoolean(r["IsActive"]) : true,
                                CreatedBy = r["CreatedBy"]?.ToString() ?? "-",
                                CreatedDate = r["CreatedDate"] != DBNull.Value
                    ? Convert.ToDateTime(r["CreatedDate"]).ToString("dd-MM-yyyy")
                    : "-"
                            };

                        }
                    }
                }

                if (emp == null) return Json(new { success = false, message = "Employee not found" }, JsonRequestBehavior.AllowGet);
                return Json(new { success = true, data = emp }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetReligions()
        {
            var list = new List<object>();
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["EmployeeDB"].ConnectionString;
                using (var con = new SqlConnection(cs))
                using (var cmd = new SqlCommand("sp_GetReligions", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    using (var r = cmd.ExecuteReader())
                    {
                        while (r.Read())
                        {
                            list.Add(new { Id = r["ReligionId"] != DBNull.Value ? Convert.ToInt32(r["ReligionId"]) : 0, Name = r["ReligionName"]?.ToString() ?? "" });
                        }
                    }
                }
                return Json(new { success = true, data = list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveEmployee(EmployeeViewModel emp)
        {
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["EmployeeDB"].ConnectionString;
                using (var con = new SqlConnection(cs))
                using (var cmd = new SqlCommand(emp.EmployeeId == 0 ? "sp_InsertEmployee" : "sp_UpdateEmployee", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (emp.EmployeeId > 0) cmd.Parameters.AddWithValue("@EmployeeId", emp.EmployeeId);
                    cmd.Parameters.AddWithValue("@EmployeeNumber", emp.EmployeeNumber ?? "");
                    cmd.Parameters.AddWithValue("@EmployeeName", emp.EmployeeName ?? "");
                    cmd.Parameters.AddWithValue("@RoleName", emp.RoleName ?? "");
                    cmd.Parameters.AddWithValue("@BasicSalary", emp.BasicSalary);
                    cmd.Parameters.AddWithValue("@DOB", string.IsNullOrEmpty(emp.DOB) ? (object)DBNull.Value : Convert.ToDateTime(emp.DOB));
                    cmd.Parameters.AddWithValue("@DOJ", string.IsNullOrEmpty(emp.DOJ) ? (object)DBNull.Value : Convert.ToDateTime(emp.DOJ));
                    cmd.Parameters.AddWithValue("@ReligionId", emp.ReligionId);
                    cmd.Parameters.AddWithValue("@IsActive", emp.IsActive);
                    cmd.Parameters.AddWithValue("@SavedBy", Session["UserName"] ?? "system");
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return Json(new { success = true, message = "Saved successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult Deactivate(int id)
        {
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["EmployeeDB"].ConnectionString;
                using (var con = new SqlConnection(cs))
                using (var cmd = new SqlCommand("sp_DeactivateEmployee", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EmployeeId", id);
                    cmd.Parameters.AddWithValue("@ModifiedBy", Session["UserName"] ?? "system");
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return Json(new { success = true, message = "Employee deactivated." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}