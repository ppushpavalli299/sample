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
            byte[] pdf = payrollerService.generatePayroller("payroller", payslipNew);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename("payroller.pdf").build());

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
