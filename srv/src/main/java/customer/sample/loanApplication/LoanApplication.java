package customer.sample.loanApplication;

import jakarta.persistence.*;
import java.util.Date;

@SqlResultSetMapping(
    name = "LoanApplication_Mapping",
    entities = @EntityResult(
        entityClass = LoanApplication.class,
        fields = {
            @FieldResult(name = "payrollPeriod", column = "payroll_period"),
            @FieldResult(name = "applicationDate", column = "application_date"),
            @FieldResult(name = "currency", column = "currency"),
            @FieldResult(name = "disbursalMethod", column = "disbursal_method"),
            @FieldResult(name = "remarks", column = "remarks"),
            @FieldResult(name = "status", column = "status")
        }
    )
)
@Entity
@Table(name = "LoanApplication")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String payrollPeriod;

    @Temporal(TemporalType.DATE)
    private Date applicationDate;

    private String currency;

    private String disbursalMethod;

    private String remarks;

    private String status;

 

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPayrollPeriod() {
        return payrollPeriod;
    }

    public void setPayrollPeriod(String payrollPeriod) {
        this.payrollPeriod = payrollPeriod;
    }

    public Date getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDisbursalMethod() {
        return disbursalMethod;
    }

    public void setDisbursalMethod(String disbursalMethod) {
        this.disbursalMethod = disbursalMethod;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    
}
