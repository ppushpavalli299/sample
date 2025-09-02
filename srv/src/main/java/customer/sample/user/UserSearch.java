package customer.sample.user;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserSearch {
    private String name;
    private String designation;
    private String status;
    private String createdBy;
    private Date createdOn;
    private Integer pageNo = 1;
    private Integer pageSize = 10;
}
