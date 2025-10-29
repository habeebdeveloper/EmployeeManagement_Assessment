document.addEventListener('DOMContentLoaded', function () {

    var tableElement = document.getElementById('tblEmployees');
    var form = document.getElementById('empForm');
    var addButton = document.getElementById('btnAdd');
    var showActiveButton = document.getElementById('btnShowActive');
    var showInactiveButton = document.getElementById('btnShowInactive');
    var bulkDeleteButton = document.getElementById('btnBulkDelete');
    var selectAllCheckbox = document.getElementById('selectAll');

    var employeeModal = new bootstrap.Modal(document.getElementById('empModal'));
    var viewModal = new bootstrap.Modal(document.getElementById('viewEmpModal'));

    if (form === null) {
        return;
    }

    var showActive = true;

    var employeeTable = new DataTable('#tblEmployees', {
        ajax: {
            url: '/Employee/GetEmployees',
            dataSrc: function (result) {
                if (result.success === true) {
                    if (showActive === true) {
                        return result.data.filter(function (item) { return item.IsActive === true; });
                    } else {
                        return result.data.filter(function (item) { return item.IsActive === false; });
                    }
                } else {
                    notie.alert({ type: 3, text: 'Error loading employees.', time: 3, position: "bottom" });
                    return [];
                }
            }
        },
        columns: [
            {
                data: 'EmployeeId',
                className: 'text-center',
                render: function (data) {
                    return '<input type="checkbox" class="form-check-input emp-select" value="' + data + '">';
                }
            },
            { data: 'EmployeeId', className: 'text-center' },
            { data: 'EmployeeName' },
            { data: 'RoleName' },
            {
                data: 'BasicSalary',
                className: 'text-end',
                render: function (data) {
                    return parseFloat(data).toFixed(2);
                }
            },
            {
                data: 'IsActive',
                className: 'text-center',
                render: function (data) {
                    if (data === true) {
                        return '<span class="badge bg-success">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactive</span>';
                    }
                }
            },
            {
                data: 'EmployeeId',
                className: 'text-center',
                render: function (data) {
                    return (
                        '<button class="btn btn-sm me-1 view-btn" data-id="' + data + '"><i class="bi bi-eye"></i></button>' +
                        '<button class="btn btn-sm me-1 edit-btn" data-id="' + data + '"><i class="bi bi-pencil-square"></i></button>' +
                        '<button class="btn btn-sm delete-btn" data-id="' + data + '"><i class="bi bi-trash"></i></button>'
                    );
                }
            }
        ]
    });

    addButton.addEventListener('click', function () {
        form.reset();
        document.getElementById('EmployeeId').value = 0;
        employeeModal.show();
    });

    showActiveButton.addEventListener('click', function () {
        showActive = true;
        notie.alert({ type: 1, text: 'Showing Active Employees', time: 1.5, position: "bottom" });
        employeeTable.ajax.reload();
    });

    showInactiveButton.addEventListener('click', function () {
        showActive = false;
        notie.alert({ type: 3, text: 'Showing Inactive Employees', time: 1.5, position: "bottom" });
        employeeTable.ajax.reload();
    });

    if (selectAllCheckbox !== null) {
        selectAllCheckbox.addEventListener('change', function () {
            var allCheckboxes = document.querySelectorAll('.emp-select');
            for (var i = 0; i < allCheckboxes.length; i++) {
                allCheckboxes[i].checked = selectAllCheckbox.checked;
            }
            if (selectAllCheckbox.checked === true) {
                bulkDeleteButton.style.display = 'inline-block';
            } else {
                bulkDeleteButton.style.display = 'none';
            }
        });
    }

    tableElement.addEventListener('change', function (event) {
        if (event.target.classList.contains('emp-select')) {
            var checked = document.querySelectorAll('.emp-select:checked');
            if (checked.length > 0) {
                bulkDeleteButton.style.display = 'inline-block';
            } else {
                bulkDeleteButton.style.display = 'none';
            }
        }
    });

    bulkDeleteButton.addEventListener('click', function () {
        var checkedBoxes = document.querySelectorAll('.emp-select:checked');
        if (checkedBoxes.length === 0) {
            notie.alert({ type: 3, text: 'Please select at least one employee.', time: 2, position: "bottom" });
            return;
        }
        var employeeIds = [];
        for (var i = 0; i < checkedBoxes.length; i++) {
            employeeIds.push(checkedBoxes[i].value);
        }
        notie.confirm({
            text: 'Deactivate ' + employeeIds.length + ' selected employee(s)?',
            submitText: 'Yes',
            cancelText: 'No',
            submitCallback: function () {
                var index = 0;
                function deactivateNext() {
                    if (index < employeeIds.length) {
                        var currentId = employeeIds[index];
                        fetch('/Employee/Deactivate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: 'id=' + currentId
                        }).then(function () {
                            index++;
                            deactivateNext();
                        });
                    } else {
                        notie.alert({ type: 1, text: 'Selected employees deactivated.', time: 2, position: "bottom" });
                        employeeTable.ajax.reload();
                        bulkDeleteButton.style.display = 'none';
                    }
                }
                deactivateNext();
            }
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var empId = document.getElementById('EmployeeId').value;
        var empNumber = document.getElementById('EmployeeNumber');
        var empName = document.getElementById('EmployeeName');
        var role = document.getElementById('RoleName');
        var salary = document.getElementById('BasicSalary');
        var dob = document.getElementById('DOB');
        var doj = document.getElementById('DOJ');
        var religion = document.getElementById('ReligionId');
        var isActive = document.getElementById('ActiveStatus').checked;
        if (empNumber.value.trim() === '') { notie.alert({ type: 3, text: 'Please enter Employee Number.', time: 3, position: "bottom" }); empNumber.focus(); return; }
        if (empName.value.trim() === '') { notie.alert({ type: 3, text: 'Please enter Employee Name.', time: 3, position: "bottom" }); empName.focus(); return; }
        if (role.value.trim() === '') { notie.alert({ type: 3, text: 'Please enter Role/Position.', time: 3, position: "bottom" }); role.focus(); return; }
        if (salary.value.trim() === '') { notie.alert({ type: 3, text: 'Please enter Salary.', time: 3, position: "bottom" }); salary.focus(); return; }
        if (dob.value.trim() === '') { notie.alert({ type: 3, text: 'Please enter Date of Birth.', time: 3, position: "bottom" }); dob.focus(); return; }
        if (doj.value.trim() === '') { notie.alert({ type: 3, text: 'Please enter Date of Joining.', time: 3, position: "bottom" }); doj.focus(); return; }
        if (religion.value === '') { notie.alert({ type: 3, text: 'Please select Religion.', time: 3, position: "bottom" }); religion.focus(); return; }
        var data = new URLSearchParams();
        data.append('EmployeeId', empId);
        data.append('EmployeeNumber', empNumber.value);
        data.append('EmployeeName', empName.value);
        data.append('RoleName', role.value);
        data.append('BasicSalary', salary.value);
        data.append('DOB', dob.value);
        data.append('DOJ', doj.value);
        data.append('ReligionId', religion.value);
        data.append('IsActive', isActive);
        fetch('/Employee/SaveEmployee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString()
        }).then(function (response) { return response.json(); }).then(function (res) {
            if (res.success === true) {
                notie.alert({ type: 1, text: res.message || 'Saved successfully.', time: 2, position: "bottom" });
                employeeTable.ajax.reload();
                employeeModal.hide();
            } else {
                notie.alert({ type: 3, text: res.message || 'Save failed.', time: 3, position: "bottom" });
            }
        }).catch(function () {
            notie.alert({ type: 3, text: 'A server error occurred.', time: 3, position: "bottom" });
        });
    });

    tableElement.addEventListener('click', function (event) {
        var target = event.target;
        if (target.tagName === 'I') {
            target = target.parentElement;
        }
        if (target.classList.contains('edit-btn')) {
            var id = target.getAttribute('data-id');
            fetch('/Employee/GetEmployee?id=' + id).then(function (response) { return response.json(); }).then(function (res) {
                if (res.success === true) {
                    var emp = res.data;
                    document.getElementById('EmployeeId').value = emp.EmployeeId;
                    document.getElementById('EmployeeNumber').value = emp.EmployeeNumber;
                    document.getElementById('EmployeeName').value = emp.EmployeeName;
                    document.getElementById('RoleName').value = emp.RoleName;
                    document.getElementById('BasicSalary').value = emp.BasicSalary;
                    document.getElementById('DOB').value = emp.DOB;
                    document.getElementById('DOJ').value = emp.DOJ;
                    document.getElementById('ReligionId').value = emp.ReligionId;
                    document.getElementById('ActiveStatus').checked = emp.IsActive;
                    employeeModal.show();
                } else {
                    notie.alert({ type: 3, text: 'Failed to load employee.', time: 3, position: "bottom" });
                }
            });
        }

        if (target.classList.contains('view-btn')) {
            var id = target.getAttribute('data-id');
            fetch('/Employee/GetEmployee?id=' + id).then(function (response) { return response.json(); }).then(function (res) {
                if (res.success === true) {
                    var e = res.data;
                    document.getElementById('viewEmployeeNumber').innerText = e.EmployeeNumber;
                    document.getElementById('viewEmployeeName').innerText = e.EmployeeName;
                    document.getElementById('viewDOB').innerText = e.DOB;
                    document.getElementById('viewReligionName').innerText = e.ReligionName;
                    document.getElementById('viewRoleName').innerText = e.RoleName;
                    document.getElementById('viewDOJ').innerText = e.DOJ;
                    document.getElementById('viewBasicSalary').innerText = e.BasicSalary;
                    document.getElementById('viewActiveStatus').innerText = e.IsActive ? 'Active' : 'Inactive';
                    document.getElementById('viewCreatedBy').innerText = e.CreatedBy || '-';
                    document.getElementById('viewCreatedDate').innerText = e.CreatedDate ? e.CreatedDate : '-';
                    viewModal.show();
                } else {
                    notie.alert({ type: 3, text: 'Failed to load details.', time: 3, position: "bottom" });
                }
            });
        }

        if (target.classList.contains('delete-btn')) {
            var id = target.getAttribute('data-id');
            notie.confirm({
                text: 'Are you sure you want to deactivate this employee?',
                submitText: 'Yes',
                cancelText: 'No',
                submitCallback: function () {
                    fetch('/Employee/Deactivate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'id=' + id
                    }).then(function (response) { return response.json(); }).then(function (res) {
                        if (res.success === true) {
                            notie.alert({ type: 1, text: 'Employee deactivated.', time: 2, position: "bottom" });
                            employeeTable.ajax.reload();
                        } else {
                            notie.alert({ type: 3, text: 'Action failed.', time: 3, position: "bottom" });
                        }
                    });
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var activeCheckbox = document.getElementById('ActiveStatus');
    var statusBadge = document.getElementById('statusBadge');
    if (activeCheckbox !== null && statusBadge !== null) {
        activeCheckbox.addEventListener('change', function () {
            if (activeCheckbox.checked === true) {
                statusBadge.textContent = 'Active';
                statusBadge.className = 'badge bg-success-subtle text-success-emphasis';
            } else {
                statusBadge.textContent = 'Inactive';
                statusBadge.className = 'badge bg-danger-subtle text-danger-emphasis';
            }
        });
    }
});
