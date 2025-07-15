package customer.sample.employee;

import com.google.gson.Gson;
import jakarta.persistence.*;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public class EmployeeDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public Collection<Employee> getEmployeeByFilter(EmployeeSearch employeeSearch) throws Exception {
        try {
            String filterParams = new Gson().toJson(employeeSearch);

            StoredProcedureQuery spQuery = entityManager
                   .createStoredProcedureQuery("FBC5AAD3564D4EEBBCFF6701C64CECD5.GET_EMPLOYEE", "Employee_Mapping");


            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
            spQuery.registerStoredProcedureParameter(2, Integer.class, ParameterMode.IN);
            spQuery.registerStoredProcedureParameter(3, Integer.class, ParameterMode.IN);

            spQuery.setParameter(1, filterParams);
            spQuery.setParameter(2, employeeSearch.getPageNo());
            spQuery.setParameter(3, employeeSearch.getPageSize());

            spQuery.execute();

            List<Employee> result = spQuery.getResultList();
            return result;
        } catch (Exception e) {
            throw new Exception("Error executing stored procedure: " + e.getMessage(), e);
        }
    }

    @SuppressWarnings("unchecked")
    public EmployeeRequest getEmployeeById(Long id) throws Exception {
        try {
            // Initialize stored procedure
            StoredProcedureQuery sp_GetEmployee = entityManager
                    .createStoredProcedureQuery("GET_EMPLOYEE_BY_ID", "Employee_Mapping");

            // Register input parameter
            sp_GetEmployee.registerStoredProcedureParameter(1, Long.class, ParameterMode.IN);
            sp_GetEmployee.setParameter(1, id);

            // Execute the procedure
            sp_GetEmployee.execute();

            // Retrieve results
            @SuppressWarnings("unchecked")
            List<Employee> result = sp_GetEmployee.getResultList();

            // Check if the result is not empty
            if (result != null && !result.isEmpty()) {
                // Extract customer details
                Employee req = result.get(0);

                // Map to EmployeeRequest object
                EmployeeRequest EmployeeRequest = new EmployeeRequest();
                EmployeeRequest.setId(req.getId());
                EmployeeRequest.setName(req.getName());
                EmployeeRequest.setDesignation(req.getDesignation());
                EmployeeRequest.setStatus(req.getStatus());

                return EmployeeRequest;
            } else {
                throw new Exception("Employee not found for ID: " + id);
            }

        } catch (Exception ex) {
            throw new Exception("Error fetching Employee by ID", ex);
        }
    }
}
