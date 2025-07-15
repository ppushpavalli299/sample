package customer.sample.employee;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)

public class EmployeeRequest {

    private Long id;  
    private String name;  
    private String designation;  
    private String status;
   

}
