sap.ui.define([], () => {
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
        }
    };
});
