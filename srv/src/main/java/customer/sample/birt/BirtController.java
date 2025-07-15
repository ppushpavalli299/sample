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

    // @PostMapping(path = "/payslip", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<Map<String, byte[]>> generatePaySlipReport(
    //         @RequestParam(name = "file", required = false) String file,
    //         @RequestBody(required = false) PayslipHeader header) {
    //     try {
    //         byte[] base64Pdf = birtService.generatePayslip(file, header);
    //         return ResponseEntity.ok(Map.of("data", base64Pdf));
    //     } catch (Exception ex) {
    //         log.error("Could not create payslip PDF", ex);
    //         return ResponseEntity.internalServerError().build();
    //     }
    // }

    @PostMapping(path = "/payslip", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> generatePaySlipReport(
            @RequestParam(name = "file", required = false) String file,
            @RequestBody(required = false) PayslipHeader header) {
        try {
            byte[] pdfBytes = birtService.generatePayslip(file, header);
            String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(base64Pdf);

        } catch (Exception ex) {
            log.error("Could not create payslip PDF", ex);
            return ResponseEntity.internalServerError().build();
        }
    }
}
