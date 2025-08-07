package customer.sample.payroll;

import org.osgi.service.component.annotations.Component;
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization;

import lombok.Data;

@Component
@Data
public class Deductions {
    private String name;
    private String cost;

}
