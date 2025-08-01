package customer.sample.employee;

import com.google.gson.Gson;
import jakarta.persistence.*;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Map;

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

    public String createEmployee(EmployeeRequest employeeRequest) throws Exception {
        try {
            String employeeJson = new Gson().toJson(employeeRequest);

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery("FBC5AAD3564D4EEBBCFF6701C64CECD5.ADD_EMPLOYEE");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN); // EMPLOYEE_DATA
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT); // RESULT_MESSAGE

            spQuery.setParameter(1, employeeJson);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while inserting employee: " + e.getMessage(), e);
        }
    }

    public String deleteEmployee(Long id) throws Exception {
        try {
            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery("FBC5AAD3564D4EEBBCFF6701C64CECD5.DELETE_EMPLOYEE");

            spQuery.registerStoredProcedureParameter(1, Long.class, ParameterMode.IN); // ID
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT); // RESULT_MESSAGE

            spQuery.setParameter(1, id);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while deleting employee: " + e.getMessage(), e);
        }
    }

    public String addEditEmployee(EmployeeRequest employeeRequest) throws Exception {
        try {
            String employeeJson = new Gson().toJson(employeeRequest); // Convert object to JSON

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery("FBC5AAD3564D4EEBBCFF6701C64CECD5.ADDEDIT_EMPLOYEE");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN); // EMPLOYEE_DATA
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT); // RESULT_MESSAGE

            spQuery.setParameter(1, employeeJson);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while inserting employee: " + e.getMessage(), e);
        }
    }

    // ✅ New update method using ADDEDIT_EMPLOYEE procedure
    public String updateEmployee(EmployeeRequest employeeRequest) throws Exception {
        try {
            String employeeJson = new Gson().toJson(employeeRequest);

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery("FBC5AAD3564D4EEBBCFF6701C64CECD5.ADDEDIT_EMPLOYEE");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT);

            spQuery.setParameter(1, employeeJson);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while updating employee: " + e.getMessage(), e);
        }
    }

   

}
