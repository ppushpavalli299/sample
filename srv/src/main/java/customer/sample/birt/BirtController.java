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

    // dynamicimagesbase64

    @PostMapping("/images")
    public ResponseEntity<byte[]> getBase64Image() {
        try {
            // Pass Input object to service
            byte[] pdfBytes = birtService.generateImageReport();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("inline")
                            .filename("statement_of_accounts.pdf")
                            .build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // imagesblob
    @PostMapping("/imageblob")
    public ResponseEntity<byte[]> generateBlobImageReport() {
        try {
            byte[] pdfBytes = birtService.generateBlobImageReport();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("inline")
                            .filename("image.pdf")
                            .build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
