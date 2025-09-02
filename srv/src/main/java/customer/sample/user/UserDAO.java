package customer.sample.user;

import com.google.gson.Gson;
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
}
