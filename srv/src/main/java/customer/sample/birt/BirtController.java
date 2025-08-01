package customer.sample.birt;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BirtController {

    private static final Logger log = LoggerFactory.getLogger(BirtController.class);

    private final BirtService birtService;
    private final ImageBase64Service imageBase64Service;

    @PostMapping(path = "/payslip", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> generatePaySlipReport(
            @RequestParam(name = "file", required = false) String file,
            @RequestBody(required = false) Payslip payslip) {
        try {
            byte[] pdfBytes = birtService.generatePayslip(file, payslip);
            String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
            return ResponseEntity.ok().body(base64Pdf);
        } catch (Exception ex) {
            log.error("Could not create payslip PDF", ex);
            return ResponseEntity.internalServerError().body("Error generating payslip");
        }
    }

    @GetMapping("/image-base64")
    public ResponseEntity<String> getBase64Image(@RequestParam(name = "fileName") String fileName) {
        String base64 = imageBase64Service.getImageAsBase64(fileName);
        if (base64 != null) {
            return ResponseEntity.ok(base64);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found or failed to convert");
        }
    }
}
