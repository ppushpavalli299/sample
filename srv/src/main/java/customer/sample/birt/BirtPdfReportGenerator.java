package customer.sample.birt;

import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.EngineConfig;
import org.eclipse.birt.report.engine.api.IReportEngine;
import org.eclipse.birt.report.engine.api.IReportEngineFactory;
import org.eclipse.birt.report.engine.api.IRunAndRenderTask;
import org.eclipse.birt.report.engine.api.PDFRenderOption;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;

public class BirtPdfReportGenerator {

    public static void main(String[] args) {
        EngineConfig config = null;
        IReportEngine engine = null;

        try {
            // 1. Setup BIRT Engine Configuration
            config = new EngineConfig();

            // 2. Start BIRT Platform
            Platform.startup(config);

            // 3. Create the Report Engine
            IReportEngineFactory factory = (IReportEngineFactory) Platform
                    .createFactoryObject(IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
            engine = factory.createReportEngine(config);

            // 4. Open the report design
            String reportDesignPath = "path/to/payrollstaticreport.rptdesign";
            IRunAndRenderTask task = engine.createRunAndRenderTask(engine.openReportDesign(reportDesignPath));

            // 5. Configure PDF output options
            PDFRenderOption pdfOptions = new PDFRenderOption();
            String outputFile = "output/payrollstaticreport.pdf";

            pdfOptions.setOutputFileName(outputFile);
            pdfOptions.setOutputFormat("pdf");

            task.setRenderOption(pdfOptions);

            // 6. Run and render the report
            task.run();
            task.close();

            System.out.println("PDF report generated at: " + new File(outputFile).getAbsolutePath());

            // 7. Open the generated PDF file in default system viewer
            openPdfFile(outputFile);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 8. Cleanup BIRT Engine and Platform
            if (engine != null) {
                engine.destroy();
            }
            try {
                Platform.shutdown();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static void openPdfFile(String filePath) {
        try {
            File pdfFile = new File(filePath);
            if (pdfFile.exists()) {
                if (Desktop.isDesktopSupported()) {
                    Desktop.getDesktop().open(pdfFile);
                } else {
                    System.err.println("Desktop is not supported. Please open the PDF manually at: " + filePath);
                }
            } else {
                System.err.println("PDF file does not exist: " + filePath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
