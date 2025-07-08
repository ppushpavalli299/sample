package customer.sample.employee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeSearch {
    private String name;
    private String designation;
    private Integer status;
    private Integer pageNo = 1;
    private Integer pageSize = 10;
}
