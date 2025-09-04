package customer.sample.user;

import jakarta.persistence.*;
import java.util.Date;

@SqlResultSetMapping(name = "User_Mapping", entities = @EntityResult(entityClass = User.class, fields = {
        @FieldResult(name = "id", column = "ID"),
        @FieldResult(name = "name", column = "NAME"),
        @FieldResult(name = "designation", column = "DESIGNATION"),
        @FieldResult(name = "status", column = "STATUS"),
        @FieldResult(name = "createdBy", column = "CREATED_BY"),
        @FieldResult(name = "createdOn", column = "CREATED_ON")
}))
@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String designation;
    private Integer status;
    private String createdBy;
    private Date createdOn;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }
}
