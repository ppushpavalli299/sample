package customer.sample.user;

import com.google.gson.Gson;

import customer.sample.employee.Employee;
import customer.sample.employee.EmployeeRequest;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public class UserDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private Gson gson;

    public Collection<User> getUserByFilter(UserSearch userSearch) throws Exception {
        try {
            String filterParams = gson.toJson(userSearch);

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery("FBC5AAD3564D4EEBBCFF6701C64CECD5.GET_USER", "User_Mapping");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
            spQuery.registerStoredProcedureParameter(2, Integer.class, ParameterMode.IN);
            spQuery.registerStoredProcedureParameter(3, Integer.class, ParameterMode.IN);

            spQuery.setParameter(1, filterParams);
            spQuery.setParameter(2, userSearch.getPageNo());
            spQuery.setParameter(3, userSearch.getPageSize());

            spQuery.execute();

            return spQuery.getResultList();
        } catch (Exception e) {
            throw new Exception("Error executing stored procedure: " + e.getMessage(), e);
        }
    }

    
    @SuppressWarnings("unchecked")
    public UserRequest getUserById(Long id) throws Exception {
        try {
            // Initialize stored procedure
            StoredProcedureQuery sp_GetUser = entityManager
                    .createStoredProcedureQuery("GET_USER_BY_ID", "User_Mapping");

            // Register input parameter
            sp_GetUser.registerStoredProcedureParameter(1, Long.class, ParameterMode.IN);
            sp_GetUser.setParameter(1, id);

            // Execute the procedure
            sp_GetUser.execute();

            // Retrieve results
            @SuppressWarnings("unchecked")
            List<User> result = sp_GetUser.getResultList();

            // Check if the result is not empty
            if (result != null && !result.isEmpty()) {
                // Extract customer details
                User req = result.get(0);

                // Map to EmployeeRequest object
                UserRequest UserRequest = new UserRequest();
                UserRequest.setId(req.getId());
                UserRequest.setName(req.getName());
                UserRequest.setDesignation(req.getDesignation());
                UserRequest.setStatus(req.getStatus());
                UserRequest.setCreatedOn(req.getCreatedOn());
                UserRequest.setCreatedBy(req.getCreatedBy());

                return UserRequest;
            } else {
                throw new Exception("Employee not found for ID: " + id);
            }

        } catch (Exception ex) {
            throw new Exception("Error fetching Employee by ID", ex);
        }
    }


       public String createUser(UserRequest userRequest) throws Exception {
        try {
            String userJson = new Gson().toJson(userRequest);

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery( "FBC5AAD3564D4EEBBCFF6701C64CECD5.ADD_USER");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN); // USER_DATA
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT); // RESULT_MESSAGE

            spQuery.setParameter(1, userJson);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while inserting user: " + e.getMessage(), e);
        }
    }

      public String addEditUser(UserRequest userRequest) throws Exception {
        try {
            String userJson = new Gson().toJson(userRequest); 

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery( "FBC5AAD3564D4EEBBCFF6701C64CECD5.ADDEDIT_USER");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN); // USER_DATA
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT); // RESULT_MESSAGE

            spQuery.setParameter(1, userJson);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while inserting user: " + e.getMessage(), e);
        }
    }
}
