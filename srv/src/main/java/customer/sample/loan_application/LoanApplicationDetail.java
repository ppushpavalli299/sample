package customer.sample.loan_application;

import java.sql.Date;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityResult;
import jakarta.persistence.FieldResult;
import jakarta.persistence.Id;
import jakarta.persistence.SqlResultSetMapping;
import lombok.Getter;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@Component
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@SqlResultSetMapping(
    name = "LoanApplicationDetail_Mapping",
    entities = {
        @EntityResult(entityClass = LoanApplicationDetail.class, fields = {
            @FieldResult(name = "id", column = "lad_id"),
            @FieldResult(name = "loan_application_id", column = "loan_application_id"),
            @FieldResult(name = "employee_id", column = "employee_id"),
            @FieldResult(name = "loan_code", column = "loan_code"),
            @FieldResult(name = "loan_amount", column = "loan_amount"),
            @FieldResult(name = "disbursal_date", column = "disbursal_date"),
            @FieldResult(name = "repayment_start_date", column = "repayment_start_date"),
            @FieldResult(name = "repayment_installments", column = "repayment_installments"),
            @FieldResult(name = "remarks", column = "lad_remarks")
        })
    }
)
public class LoanApplicationDetail {

    @Id
    private Long id;
    private Long loan_application_id;
    private Long employee_id;
    private String loan_code;
    private Double loan_amount;
    private Date disbursal_date;
    private Date repayment_start_date;
    private Integer repayment_installments;
    private String remarks;
}
