package customer.sample.birt;

import java.util.List;

import org.osgi.service.component.annotations.Component;

import jakarta.persistence.Id;
import lombok.Data;

@Component
@Data
public class Payslip {
    @Id
    private Long id;
    private String earnings;
    private String master;
    private String actual;
    private String deductions;
    private String actuals;

    private List<PayslipEarnings> payslipEarnings;  

}

