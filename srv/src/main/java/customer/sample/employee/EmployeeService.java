package customer.sample.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDAO employeeDAO;

    public Collection<Employee> getEmployeeByFilter(EmployeeSearch employeeSearch) throws Exception {
        return employeeDAO.getEmployeeByFilter(employeeSearch);
    }

    public EmployeeRequest getEmployeeById(Long id) throws Exception {
        try {
            return employeeDAO.getEmployeeById(id);
        } catch (Exception e) {
            throw e;
        }
    }
}
