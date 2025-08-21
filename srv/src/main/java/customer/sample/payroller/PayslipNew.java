package customer.sample.payroller;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.List;

import org.osgi.service.component.annotations.Component;

@Data
@Component
public class PayslipNew {
    @Id
    private Long id;
    private String employeeNumber;
    private String employeeName;
    private String costCenter;
    private String position;
    private Date dateOfJoining;
    private String nationality;
    private Date paymentDate;
    private String unpaidDays;
    private String paymentCurrency;

    private List<Payroller> payroller;
    private List<Earnings> earnings;
    private List<Deductions> deductions;
    private List<PaymentInformation> paymentInformation;

}
