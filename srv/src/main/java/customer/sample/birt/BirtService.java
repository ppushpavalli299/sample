package customer.sample.birt;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream; 
import java.io.File; 
import java.io.IOException; 
import java.io.InputStream; 
import java.nio.file.DirectoryStream; 
import java.nio.file.Files; 
import java.nio.file.Path; 
import java.nio.file.Paths; 
import java.util.ArrayList; 
import java.util.Base64; 
import java.util.HashMap; 
import java.util.List; 
import java.util.Map; 

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
    public byte[] generatePayslip(String fileParam, Payslip payslip) throws Exception {
        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payslip";
        String path = reportFolder + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

            /* Data from procedure */
            // List<Payslip> payslips = payslipDAO.getPayslipsFromProcedure();
            task.getAppContext().put("payslip", payslip);

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


    //dynamicimagesbase64
     /* Produce PDF containing Base64 images */
    public byte[] generateImageReport() throws Exception {
        String fileParam = null;
        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payslip";
        String path = reportFolder + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

            List<Images> imagesList = new ArrayList<>();

            ClassPathResource resource = new ClassPathResource("reports/images");
            File folder = resource.getFile();
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(folder.toPath())) {
                for (Path filePath : stream) {
                    byte[] fileContent = Files.readAllBytes(filePath);
                    String base64 = Base64.getEncoder().encodeToString(fileContent);
                    Images img = new Images();
                    img.setImagesBase64(base64);
                    imagesList.add(img);
                }

            }
            task.getAppContext().put("images", imagesList);

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
