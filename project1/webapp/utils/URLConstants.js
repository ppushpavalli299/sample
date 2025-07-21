sap.ui.define([], function () {
    "use strict";
    return {
        URL: {
            app_endPoint: "http://localhost:8080/",

            payslip_template_report_full: "api/payslip", //payslip templates
            employee_filter: "employee/filter", //filter
            employee_by_id: "employee/{id}",//id
            emp_add: "employee/add",//create
            employee_delete: "employee/{id}",//delete
            emp_add_edit: "employee/addEdit",//addedit




        },
        Paging: {
            page_size: 50
        }
    };
});
