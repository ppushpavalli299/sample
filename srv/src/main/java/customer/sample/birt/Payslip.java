package customer.sample.birt;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class Payslip implements Serializable {

    private static final long serialVersionUID = 1L;

    private String earnings;

    @JsonProperty("earning_master")
    private Double earningMaster;

    @JsonProperty("earning_actual")
    private Double earningActual;

    private String deductions;

    @JsonProperty("deduction_actual")
    private Double deductionActual;
}
