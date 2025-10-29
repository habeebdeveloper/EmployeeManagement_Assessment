    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    namespace Habeeb_Assessment.Models
    {
        public class EmployeeViewModel
        {
            public int EmployeeId { get; set; }
            public string EmployeeNumber { get; set; }
            public string EmployeeName { get; set; }
            public string RoleName { get; set; }
            public decimal BasicSalary { get; set; }
            public string DOB { get; set; }
            public string DOJ { get; set; }
            public int ReligionId { get; set; }
            public string ReligionName { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedDate { get; set; }
        }
    }
