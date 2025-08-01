package customer.sample.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

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

    public String createEmployee(EmployeeRequest employeeRequest) throws Exception {
        return employeeDAO.createEmployee(employeeRequest);
    }

    public String deleteEmployee(Long id) throws Exception {
        return employeeDAO.deleteEmployee(id);
    }

    public String addEditEmployee(EmployeeRequest employeeRequest) throws Exception {
        return employeeDAO.addEditEmployee(employeeRequest);
    }

    // New method for update
    public String updateEmployee(EmployeeRequest employeeRequest) throws Exception {
        return employeeDAO.updateEmployee(employeeRequest);
    }

 

}
