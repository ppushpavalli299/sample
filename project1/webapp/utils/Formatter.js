sap.ui.define([], function () {
    "use strict";
    return {
        formatDate: function (sDate) {
            if (!sDate) return "";

            const oDate = new Date(sDate);
            if (isNaN(oDate)) return "";

            const day = String(oDate.getDate()).padStart(2, "0");
            const month = String(oDate.getMonth() + 1).padStart(2, "0");
            const year = oDate.getFullYear();

            return `${day}-${month}-${year}`;
        },

        getStatusText: function (value) {
            switch (Number(value)) {
                case 1: return "Draft";
                case 2: return "Active";
                case 3: return "InActive";
                default: return "Unknown";
            }
        },

        getStatusState: function (value) {
            switch (Number(value)) {
                case 1: return "Warning";
                case 2: return "Success";
                case 3: return "Error";
                default: return "None";
            }
        },

        //Loan Application
        getStatusText: function (value) {
            switch (Number(value)) {
                case 1: return "Pending";
                case 2: return "Approval";
                case 3: return "Warning";
                case 4: return "Cancelled";
                default: return "Unknown";
            }
        },

        getStatusState: function (value) {
            switch (Number(value)) {
                case 1: return "Warning";
                case 2: return "Success";
                case 3: return "Error";
                case 4: return "Error";
                default: return "None";
            }
        },
        formatDateToYYYYMMDD: function (inputDate) {
            if (!inputDate) return null;

            let dateObj = new Date(inputDate);
            if (isNaN(dateObj)) return inputDate;

            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');

            return `${yyyy}-${mm}-${dd}`;

        },
        formatDate: function (sDate) {
            if (!sDate) return "";
            const parts = sDate.split("-");
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-MM-yyyy
        }
    };
});
