package customer.sample.birt;

import lombok.Data;
import java.util.List;

@Data
public class PayslipHeader {
    private List<Payslip> payslips;  
}
