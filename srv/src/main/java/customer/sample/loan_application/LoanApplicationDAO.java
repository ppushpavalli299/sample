package customer.sample.loan_application;

import java.util.List;
import jakarta.persistence.*;
import org.springframework.stereotype.Repository;

import com.google.gson.Gson;

import customer.sample.employee.EmployeeRequest;

@Repository
public class LoanApplicationDAO {

    @PersistenceContext
    private EntityManager entityManager;

    // Add Loan Application
    // public String addLoanApplication(String newLoanApplication) {
    // try {
    // StoredProcedureQuery la_AddLoanApplication = entityManager
    // .createStoredProcedureQuery("SAMPLE_HDI_DB_1.ADD_EDIT_LOAN_APPLICATION");

    // la_AddLoanApplication.registerStoredProcedureParameter("IN_PARAM",
    // String.class, ParameterMode.IN);
    // la_AddLoanApplication.registerStoredProcedureParameter("EX_MESSAGE",
    // String.class, ParameterMode.OUT);

    // la_AddLoanApplication.setParameter("IN_PARAM", newLoanApplication);
    // la_AddLoanApplication.execute();

    // return (String) la_AddLoanApplication.getOutputParameterValue("EX_MESSAGE");
    // } catch (Exception exception) {
    // throw new RuntimeException("Error while adding loan application: " +
    // exception.getMessage(), exception);
    // }
    // }

    public String addLoanApplication(String jsonString) throws Exception {
        try {
            String loanapplicationJson = new Gson().toJson(jsonString);

            StoredProcedureQuery spQuery = entityManager
                    .createStoredProcedureQuery("SAMPLE_HDI_DB_1.ADD_EDIT_LOAN_APPLICATION");

            spQuery.registerStoredProcedureParameter(1, String.class, ParameterMode.IN); // EMPLOYEE_DATA
            spQuery.registerStoredProcedureParameter(2, String.class, ParameterMode.OUT); // RESULT_MESSAGE

            spQuery.setParameter(1, loanapplicationJson);
            spQuery.execute();

            return (String) spQuery.getOutputParameterValue(2);
        } catch (Exception e) {
            throw new Exception("Error while inserting employee: " + e.getMessage(), e);
        }
    }

    // Get All Loan Applications
    public List<LoanApplication> getAllLoanApplications() {
        try {
            StoredProcedureQuery query = entityManager
                    .createStoredProcedureQuery("SAMPLE_HDI_DB_1.GET_LOAN_APPLICATION", "LoanApplication_Mapping");
            query.execute();
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching all loan applications: " + e.getMessage(), e);
        }
    }

    // Get Loan Application By ID
    public List<LoanApplicationDetail> getLoanApplicationById(Long id) {
        try {
            StoredProcedureQuery query = entityManager
                    .createStoredProcedureQuery("SAMPLE_HDI_DB_1.GET_LOAN_APPLICATION_BY_ID",
                            "LoanApplicationDetail_Mapping");

            query.registerStoredProcedureParameter("ID", Long.class, ParameterMode.IN);
            query.setParameter("ID", id);

            query.execute();
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching loan application by ID: " + e.getMessage(), e);
        }
    }
}
