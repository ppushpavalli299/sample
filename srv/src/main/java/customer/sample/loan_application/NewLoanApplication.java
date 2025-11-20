package customer.sample.loan_application;

import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Component;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Component
public class NewLoanApplication {

    @Id
    private String payroll_period;
    private String loan_batch_name;
    private Date date;
    private String currency;
    private Long disbursal_method;
    private String remarks;
    private Long created_by;
    private Long modified_by;
    private Integer status;
    private Date created_on;
    private Date modified_on;
    private List<LoanApplicationDetail> loan_application_detail;
}
