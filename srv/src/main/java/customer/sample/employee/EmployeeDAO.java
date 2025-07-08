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
                   .createStoredProcedureQuery("BBAD081973004D8C886D4EC81BEA6576.GET_EMPLOYEE", "Employee_Mapping");


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
}
