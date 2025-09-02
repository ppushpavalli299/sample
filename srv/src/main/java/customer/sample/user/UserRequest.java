package customer.sample.user;

import java.time.LocalDate;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRequest {
    private Long id;
    private String name;
    private String designation;
    private String status;
    private String createdBy;
    private Date createdOn;
}
