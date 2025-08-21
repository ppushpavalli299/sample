package customer.sample.payroller;

import org.osgi.service.component.annotations.Component;
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization;

import lombok.Data;

@Component
@Data
public class Earnings {

    private String name;
    private String cost;


}
