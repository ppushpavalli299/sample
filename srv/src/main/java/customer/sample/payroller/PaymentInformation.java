package customer.sample.payroller;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentInformation {
    private String method;
    private String bankName;
    private String ibanAccountNumber;
    private String amount;
}
