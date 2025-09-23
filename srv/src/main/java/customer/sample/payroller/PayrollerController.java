package customer.sample.payroller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payroll")
@RequiredArgsConstructor
public class PayrollerController {

    @Autowired
    private PayrollerService payrollerService;

    @PostMapping(path = "/payroller", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<byte[]> generatepayroll(@RequestBody PayslipNew payslipNew) {
        try {
            if (payslipNew.getEmployeeNumber() == null || payslipNew.getEmployeeNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null); // Return 400 if employee number is missing
            }

            byte[] pdf = payrollerService.generatePayroller("payroller", payslipNew);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename("payroller.pdf").build());

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace(); // Replace with logger in production
            return ResponseEntity.internalServerError().build();
        }
    }
}
