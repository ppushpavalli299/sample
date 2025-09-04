package customer.sample.payroll;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import customer.sample.birt.Payslip;

import java.util.Base64;

@RestController
@RequestMapping("/payroll")
@RequiredArgsConstructor
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    // @PostMapping(path = "/payroll", consumes = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<byte[]> generatepayroll(@RequestBody PayslipNew
    // payslipNew) {
    // try {
    // byte[] pdf = payrollService.generatePayroll("payroll", payslipNew);

    // HttpHeaders headers = new HttpHeaders();
    // headers.setContentType(MediaType.APPLICATION_PDF);
    // headers.setContentDisposition(ContentDisposition.inline().filename("payroll.pdf").build());

    // return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    // } catch (Exception ex) {
    // ex.printStackTrace();
    // return ResponseEntity.internalServerError().build();
    // }
    // }

    @PostMapping(path = "/payroll", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> generatepayroll(@RequestBody PayslipNew payslipNew) {
        try {
            byte[] pdf = payrollService.generatePayroll("payroll", payslipNew);

            // Convert PDF byte[] to Base64-encoded String
            String base64Pdf = Base64.getEncoder().encodeToString(pdf);

            return ResponseEntity.ok(base64Pdf);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

 

}
