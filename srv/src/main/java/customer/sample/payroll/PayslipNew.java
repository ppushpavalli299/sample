package customer.sample.payroll;

import org.osgi.service.component.annotations.Component;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;


@Data
@Component
public class PayslipNew{
@Id
    private Long id; 

    private List<Payroll> payroll;
    private List<Earnings> earnings;
    private List<Deductions>deductions;
    private List<PaymentInformation>paymentInformation;
}
