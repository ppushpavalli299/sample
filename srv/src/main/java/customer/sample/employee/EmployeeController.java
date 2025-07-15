package customer.sample.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/filter")
    public ResponseEntity<?> getEmployeeByFilter(@RequestBody EmployeeSearch employeeSearch) {
        try {
            return ResponseEntity.ok(employeeService.getEmployeeByFilter(employeeSearch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable("id") Long id) {
        try {
            return new ResponseEntity<>(employeeService.getEmployeeById(id), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
