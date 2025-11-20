package customer.sample.loan_application;

import java.sql.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Service
public class LoanApplicationService {
    
    @Autowired
    private LoanApplicationDAO loanApplicationDAO;

    // Add New Loan Application
    public String addLoanApplication(NewLoanApplication newLoanApplication) {
        try {
            Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
            String jsonString = gson.toJson(newLoanApplication);
            return loanApplicationDAO.addLoanApplication(jsonString);
        } catch (Exception ex) {
            throw new RuntimeException("Error while adding loan application: " + ex.getMessage(), ex);
        }
    }

    // Get All Loan Applications
    public List<LoanApplication> getAllLoanApplications() {
        try {
            return loanApplicationDAO.getAllLoanApplications();
        } catch (Exception ex) {
            throw new RuntimeException("Error while fetching all loan applications: " + ex.getMessage(), ex);
        }
    }

    // Get Loan Application By ID
    public List<LoanApplicationDetail> getLoanApplicationById(Long id) {
        try {
            return loanApplicationDAO.getLoanApplicationById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching loan application by ID: " + e.getMessage(), e);
        }
    }
}
