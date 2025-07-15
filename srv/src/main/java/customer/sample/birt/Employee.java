package customer.sample.birt;

import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@Component

public class Employee {
    private String earnings;
    private Double earning_master;
    private Double earning_actual;
    private String deductions;
    private Double deduction_actual;

}
