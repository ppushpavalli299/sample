package customer.sample.payroll;


import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.stereotype.Service;

@Service
public class PayrollService {

    public byte[] generatePayroll(String fileParam, PayslipNew payslipNew) throws Exception {
        // Initialize BIRT engine
        EngineConfig cfg = new EngineConfig();
        Platform.startup(cfg);
        IReportEngineFactory factory = (IReportEngineFactory) Platform.createFactoryObject(
                IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
        IReportEngine engine = factory.createReportEngine(cfg);

        byte[] reportBytes = null;

        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payroll";
        String reportFolder = "reports/";
        String path = reportFolder + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);
            task.getAppContext().put("payslip", payslipNew);

            ByteArrayOutputStream pdf = new ByteArrayOutputStream();
            PDFRenderOption options = new PDFRenderOption();
            options.setOutputFormat(IRenderOption.OUTPUT_FORMAT_PDF);
            options.setOutputStream(pdf);
            task.setRenderOption(options);

            task.run();
            task.close();

            reportBytes = pdf.toByteArray();
        }

        // // Shutdown engine and platform after use
        // engine.destroy();
        // Platform.shutdown();

        return reportBytes;
    }
}



// package customer.sample.payroll;

// import java.io.ByteArrayOutputStream;
// import java.io.InputStream;
// import java.util.Map;

// import org.eclipse.birt.core.exception.BirtException;
// import org.eclipse.birt.core.framework.Platform;
// import org.eclipse.birt.report.engine.api.*;
// import org.springframework.stereotype.Service;

// import jakarta.annotation.PostConstruct;
// import jakarta.annotation.PreDestroy;

// @Service
// public class PayrollService {
//  private IReportEngine engine;

//     /* Engine life‑cycle */
//     @PostConstruct
//     public void startEngine() throws BirtException {
//         EngineConfig cfg = new EngineConfig();
//         Platform.startup(cfg);
//         IReportEngineFactory fac = (IReportEngineFactory) Platform.createFactoryObject(
//                 IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
//         engine = fac.createReportEngine(cfg);
//     }

//     @PreDestroy
//     public void stopEngine() {
//         if (engine != null) {
//             engine.destroy();
//             Platform.shutdown();
//         }
//     }


//     public byte[] generatePayroll(String fileParam, PayslipNew payslipNew) throws Exception {
//         // Save the payroll data to the database
       

//         // Load the BIRT .rptdesign file
//         String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payroll";
//         String reportFolder = "reports/";  // Make sure this is in src/main/resources
//         String path = reportFolder + design + ".rptdesign";

//         try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
//             if (designStream == null) {
//                 throw new IllegalArgumentException("Report not found: " + path);
//             }

//             // Open and prepare the report
//             IReportRunnable runnable = engine.openReportDesign(designStream);
//             IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

//             // ✅ Correct: Set report parameters using values from Payroll entity
//             // task.setParameterValue("totalEarnings", payroll.getTotalEarnings());
//             // task.setParameterValue("totalDeductions", payroll.getTotalDeductions());
//             // task.setParameterValue("netPay", payroll.getNetPay());

//             task.getAppContext().put("payslip",payslipNew);

//             // Render report to PDF
//             ByteArrayOutputStream pdf = new ByteArrayOutputStream();
//             PDFRenderOption options = new PDFRenderOption();
//             options.setOutputFormat(IRenderOption.OUTPUT_FORMAT_PDF);
//             options.setOutputStream(pdf);
//             task.setRenderOption(options);

//             // Run the report generation
//             task.run();
//             task.close();

//             return pdf.toByteArray();
//         }
//     }
// }
