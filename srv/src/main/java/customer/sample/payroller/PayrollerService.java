package customer.sample.payroller;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import customer.sample.birt.PreDestroy;
import customer.sample.payroll.Payroll;
import jakarta.annotation.PostConstruct;

@Service
public class PayrollerService {

    private IReportEngine engine;

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

    public byte[] generatePayroller(String fileParam, PayslipNew payslipNew) throws Exception {

        // Load the BIRT .rptdesign file
        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payroll";
        String reportFolder = "reports/"; // Make sure this is in src/main/resources
        String path = reportFolder + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            // Open and prepare the report
            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

            // Values
            // PayslipNew object is already passed as a parameter, no need to re-declare it

            // Set report parameters
            // task.setParameterValue("employeeNumber", payslipNew.getEmployeeNumber());
            // task.setParameterValue("employeeName", payslipNew.getEmployeeName());
            // task.setParameterValue("costCenter", payslipNew.getCostCenter());
            // task.setParameterValue("position", payslipNew.getPosition());
            // task.setParameterValue("dateOfJoining", payslipNew.getDateOfJoining());
            // task.setParameterValue("nationality", payslipNew.getNationality());
            // task.setParameterValue("paymentDate", payslipNew.getPaymentDate());
            // task.setParameterValue("unpaidDays", payslipNew.getUnpaidDays());
            // task.setParameterValue("paymentCurrency", payslipNew.getPaymentCurrency());

             // Set Payroll
            Payroll payroll = new Payroll();
            // payroll.setTotalEarnings("676,91.72");
            // payroll.setTotalDeductions("7,500.00");
            // payroll.setNetPay("60,191.72");
            payslipNew.setPayroll(List.of(payroll));

            // Set Earnings
            Earnings e1 = new Earnings();
            e1.setName("Basic Salary");
            // e1.setCost("33,000.00");
            // Earnings e2 = new Earnings();
            // e2.setName("Consolidated Allowance");
            // e2.setCost("33,000.00");
            // Earnings e3 = new Earnings();
            // e3.setName("Airfare Payment");
            // e3.setCost("1,139.72");
            // Earnings e4 = new Earnings();
            // e4.setName("Other Expenses");
            // e4.setCost("552.00");
            // payslipNew.setEarnings(List.of(e1, e2, e3, e4));

            // Set Deductions
            Deductions d1 = new Deductions();
            d1.setName("Housing Advance Recovery");
            // d1.setCost("7,500.00");
            payslipNew.setDeductions(List.of(d1));

            // Set Payment Information
            PaymentInformation p1 = new PaymentInformation();
            p1.setMethod("Payroll");
            p1.setBankName("Emirates NBD");
            p1.setIbanAccountNumber("2356897549");
            p1.setAmount("60191.72");
            payslipNew.setPaymentInformation(List.of(p1));


            // ✅ Pass full object to report context
            task.getAppContext().put("payslip", payslipNew);

            // Render as PDF
            ByteArrayOutputStream pdf = new ByteArrayOutputStream();
            PDFRenderOption options = new PDFRenderOption();
            options.setOutputFormat(IRenderOption.OUTPUT_FORMAT_PDF);
            options.setOutputStream(pdf);
            task.setRenderOption(options);

            task.run();
            task.close();

            return pdf.toByteArray();
        }
    }
}
