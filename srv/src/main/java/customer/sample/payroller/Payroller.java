package customer.sample.payroller;

import org.osgi.service.component.annotations.Component;
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization;

import lombok.Data;

@Component
@Data
public class Payroller {
    private String totalEarnings;
    private String totalDeductions;
    private String netPay;
}

