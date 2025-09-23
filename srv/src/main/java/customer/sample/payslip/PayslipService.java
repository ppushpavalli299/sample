package customer.sample.payslip;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.eclipse.birt.core.exception.BirtException;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Service
public class PayslipService {

    private IReportEngine engine;

    @PostConstruct
    public void startEngine() throws BirtException {
        EngineConfig config = new EngineConfig();
        Platform.startup(config);
        IReportEngineFactory factory = (IReportEngineFactory)
                Platform.createFactoryObject(IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
        engine = factory.createReportEngine(config);
    }

    @PreDestroy
    public void stopEngine() {
        if (engine != null) {
            engine.destroy();
            Platform.shutdown();
        }
    }

    public byte[] generatePayroll(String reportName, PayslipNew payslipNew) throws Exception {
        String reportPath = "reports/" + reportName + ".rptdesign";

        try (InputStream reportStream = getClass().getClassLoader().getResourceAsStream(reportPath)) {
            if (reportStream == null) {
                throw new IllegalArgumentException("Report not found: " + reportPath);
            }

            IReportRunnable report = engine.openReportDesign(reportStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(report);

            // Explicitly set parameters based on your DTO fields
            task.setParameterValue("basicSalary", payslipNew.getBasicSalary());
            task.setParameterValue("otherAllowances", payslipNew.getOtherAllowances());
            task.setParameterValue("normalOT", payslipNew.getNormalOT());
            task.setParameterValue("holidayOT", payslipNew.getHolidayOT());
            task.setParameterValue("dailyAllowance", payslipNew.getDailyAllowance());
            task.setParameterValue("payable", payslipNew.getPayable());

            // Render to PDF
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PDFRenderOption options = new PDFRenderOption();
            options.setOutputFormat(IRenderOption.OUTPUT_FORMAT_PDF);
            options.setOutputStream(out);
            task.setRenderOption(options);

            task.run();
            task.close();

            return out.toByteArray();
        }
    }
}
