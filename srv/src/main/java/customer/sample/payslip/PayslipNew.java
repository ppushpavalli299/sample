package customer.sample.payslip;

import lombok.Data;

@Data
public class PayslipNew {
    private String basicSalary;
    private String otherAllowances;
    private String normalOT;
    private String holidayOT;
    private String dailyAllowance;
    private String payable;
}
