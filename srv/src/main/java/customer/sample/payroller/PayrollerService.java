package customer.sample.payroller;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.stereotype.Service;


import jakarta.annotation.PostConstruct;
@Service
public class PayrollerService {
    
 private IReportEngine engine;

    /* Engine life‑cycle */
    @PostConstruct
    public void startEngine() throws BirtException {
        EngineConfig cfg = new EngineConfig();
        Platform.startup(cfg);
        IReportEngineFactory fac = (IReportEngineFactory) Platform.createFactoryObject(
                IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
        engine = fac.createReportEngine(cfg);
    }

    @jakarta.annotation.PreDestroy
    public void stopEngine() {
        if (engine != null) {
            engine.destroy();
            Platform.shutdown();
        }
    }


    public byte[] generatePayroller(String fileParam, PayslipNew payslipNew) throws Exception {
        // Save the payroll data to the database
       

        // Load the BIRT .rptdesign file
        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payroller";
        String reportFolder = "reports/";  // Make sure this is in src/main/resources
        String path = reportFolder + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            // Open and prepare the report
            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

            if (payslipNew != null) {
                Field[] fields = payslipNew.getClass().getDeclaredFields();

                for (Field field : fields) {
                    field.setAccessible(true);
                    String fieldName = field.getName();
                    Object fieldValue = field.get(payslipNew);

                    try {
                        task.setParameterValue(fieldName, fieldValue);
                    } catch (Exception e) {
                        System.out.println("Skipping parameter: " + fieldName + " - not found in report");
                    }
                }
            }
            task.getAppContext().put("payslip",payslipNew);

            // Render report to PDF
            ByteArrayOutputStream pdf = new ByteArrayOutputStream();
            PDFRenderOption options = new PDFRenderOption();
            options.setOutputFormat(IRenderOption.OUTPUT_FORMAT_PDF);
            options.setOutputStream(pdf);
            task.setRenderOption(options);

            // Run the report generation
            task.run();
            task.close();

            return pdf.toByteArray();
        }
    }
}
