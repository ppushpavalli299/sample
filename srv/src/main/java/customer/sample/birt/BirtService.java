package customer.sample.birt;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BirtService {

    @Value("${report.folder:reports/}")
    private String reportFolder;

    private final PayslipDAO payslipDAO;
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

    @PreDestroy
    public void stopEngine() {
        if (engine != null) {
            engine.destroy();
            Platform.shutdown();
        }
    }

    /* Produce PDF */
    public byte[] generatePayslip(String fileParam, PayslipHeader header) throws Exception {
        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payslip";
        String path = reportFolder + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

            /* Data from procedure */
            List<Payslip> payslips = payslipDAO.getPayslipsFromProcedure();
            task.getAppContext().put("payslip", payslips);

            /* Render */
            ByteArrayOutputStream pdf = new ByteArrayOutputStream();
            PDFRenderOption opt = new PDFRenderOption();
            opt.setOutputFormat(IRenderOption.OUTPUT_FORMAT_PDF);
            opt.setOutputStream(pdf);
            task.setRenderOption(opt);

            task.run();
            task.close();
            return pdf.toByteArray();
        }
    }

}
