package customer.sample.payslip;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payslip")
@Data
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String basicSalary;
    private String otherAllowances;
    private String normalOT;
    private String holidayOT;
    private String dailyAllowance;
    private String payable;
}
