package customer.sample.employee;

import jakarta.persistence.*;

@SqlResultSetMapping(name = "Employee_Mapping", entities = @EntityResult(entityClass = Employee.class, fields = {
        @FieldResult(name = "id", column = "id"),
        @FieldResult(name = "name", column = "name"),
        @FieldResult(name = "designation", column = "designation"),
        @FieldResult(name = "status", column = "status")
}))
@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String designation;
    private String status;

    // Getters & Setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    
}
