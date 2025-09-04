package customer.sample.payroll;

import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/report")
public class StaticReportController {

    private static final Logger log = Logger.getLogger(StaticReportController.class.getName());

    @PostMapping(path = "/static-payslip", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateStaticPayslipReport() {
        EngineConfig config = null;
        IReportEngine engine = null;
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            // 1. Setup BIRT Engine Configuration
            config = new EngineConfig();
            Platform.startup(config);

            // 2. Create the Report Engine
            IReportEngineFactory factory = (IReportEngineFactory) Platform
                    .createFactoryObject(IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
            engine = factory.createReportEngine(config);

            // 3. Load report design from classpath (resources folder)
            String reportDesignFile = "/reports/payrollstaticreport.rptdesign";
            InputStream reportDesignStream = getClass().getResourceAsStream(reportDesignFile);

            if (reportDesignStream == null) {
                log.severe("Report design file not found in classpath at " + reportDesignFile);
                return ResponseEntity.internalServerError()
                        .body(null);
            }

            // Open the design from InputStream instead of file path
            IReportRunnable design = engine.openReportDesign(reportDesignStream);

            IRunAndRenderTask task = engine.createRunAndRenderTask(design);

            // 4. Configure PDF output to write to outputStream (in-memory)
            PDFRenderOption pdfOptions = new PDFRenderOption();
            pdfOptions.setOutputStream(outputStream);
            pdfOptions.setOutputFormat("pdf");

            task.setRenderOption(pdfOptions);

            // 5. Run and render the report
            task.run();
            task.close();

            // 6. Return PDF bytes in response
            byte[] pdfBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=payrollstaticreport.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            log.log(Level.SEVERE, "Could not generate static payslip PDF", e);
            return ResponseEntity.internalServerError()
                    .body(null);
        } finally {
            if (engine != null) {
                engine.destroy();
            }
            try {
                Platform.shutdown();
            } catch (Exception e) {
                log.log(Level.SEVERE, "Error shutting down BIRT platform", e);
            }
        }
    }
}
