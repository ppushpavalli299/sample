sap.ui.define([], function () {
    "use strict";
    return {
        URL: {
            app_endPoint: "http://localhost:8080/",
            employee_filter: "employee/filter",
            employee_by_id: "employee/{id}", 
            payslip_template_report_full: "api/payslip"
           
        },
        Paging: {
            page_size: 50
        }
    };
});
