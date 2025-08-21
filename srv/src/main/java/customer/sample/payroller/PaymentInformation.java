package customer.sample.payroller;


import org.osgi.service.component.annotations.Component;
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization;

import lombok.Data;

@Component
@Data
public class PaymentInformation {

    private String method;
    private String bankName;
    private String ibanAccountNumber;
    private String amount;
    
}
