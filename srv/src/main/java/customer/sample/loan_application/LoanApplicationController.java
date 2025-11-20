package customer.sample.loan_application;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/loan-application")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationService loanApplicationService;

    // Add New Loan Application
    @PostMapping("/add")
    public ResponseEntity<?> addLoanApplication(@RequestBody NewLoanApplication newLoanApplication) {
        try {
            String response = loanApplicationService.addLoanApplication(newLoanApplication);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get All Loan Applications
    @GetMapping("/all")
    public ResponseEntity<?> getAllLoanApplications() {
        try {
            List<LoanApplication> applications = loanApplicationService.getAllLoanApplications();
            return new ResponseEntity<>(applications, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get Loan Application By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getLoanApplicationById(@PathVariable("id") Long id) {  // <-- fixed here
        try {
            List<LoanApplicationDetail> result = loanApplicationService.getLoanApplicationById(id);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
