package customer.sample.payroller;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Payroller {
    private String totalEarnings;
    private String totalDeductions;
    private String netPay;
}
