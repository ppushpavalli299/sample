package customer.sample.payroller;

import org.osgi.service.component.annotations.Component;

import customer.sample.payroll.Payroll;
import lombok.*;
import java.util.List;


@Data
@Component
public class PayslipNew {
       
    private Long id; 
    private List<Payroll> payroll;
    private List<Earnings> earnings;
    private List<Deductions>deductions;
    private List<PaymentInformation>paymentInformation;

}
