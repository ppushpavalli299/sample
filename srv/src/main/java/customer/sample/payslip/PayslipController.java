package customer.sample.payslip;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payslip")
@RequiredArgsConstructor
public class PayslipController {

    private final PayslipService payslipService;

    @PostMapping(path = "/payslip2", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<byte[]> generatePayslip(@RequestBody PayslipNew payslipNew) {
        try {
            byte[] pdf = payslipService.generatePayroll("payslip2", payslipNew);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename("payslip2.pdf").build());

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
