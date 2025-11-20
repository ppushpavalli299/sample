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
    name = "LoanApplication_Mapping",
    entities = {
        @EntityResult(
            entityClass = LoanApplication.class,
            fields = {
                @FieldResult(name = "id", column = "id"),
                @FieldResult(name = "loan_batch_name", column = "loan_batch_name"),
                @FieldResult(name = "payroll_period", column = "payroll_period"),
                @FieldResult(name = "date", column = "date"),
                @FieldResult(name = "currency", column = "currency"),
                @FieldResult(name = "disbursal_method", column = "disbursal_method"),
                @FieldResult(name = "remarks", column = "remarks"),
                @FieldResult(name = "created_by", column = "created_by"),
                @FieldResult(name = "created_on", column = "created_on"),
                @FieldResult(name = "modified_by", column = "modified_by"),
                @FieldResult(name = "modified_on", column = "modified_on"),
                @FieldResult(name = "status", column = "status")
            }
        )
    }
)
public class LoanApplication {

    @Id
    private Long id;
    private String loan_batch_name;
    private String payroll_period;
    private Date date;
    private String currency;
    private Long disbursal_method;
    private String remarks;
    private Long created_by;
    private Long modified_by;
    private Integer status;
    private Date created_on;
    private Date modified_on;
}
