package customer.sample.payroller;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.*;

@Service
public class PayrollerService {

    @Autowired
    private DataSource dataSource;

    private IReportEngine engine;

    @PostConstruct
    public void startEngine() throws Exception {
        EngineConfig config = new EngineConfig();
        Platform.startup(config);
        IReportEngineFactory factory = (IReportEngineFactory) Platform.createFactoryObject(
                IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
        engine = factory.createReportEngine(config);
    }

    @PreDestroy
    public void stopEngine() {
        if (engine != null) {
            engine.destroy();
            Platform.shutdown();
        }
    }

    public boolean employeeExists(String employeeNumber) throws SQLException {
        String checkSql = "SELECT COUNT(1) FROM PAYSLIP WHERE EMPLOYEE_NUMBER = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(checkSql)) {
            ps.setString(1, employeeNumber);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    public void insertFullPayrollData(PayslipNew payslipNew) throws SQLException {
        // Validate required fields
        if (payslipNew.getEmployeeNumber() == null || payslipNew.getEmployeeNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Employee number is required.");
        }

        if (employeeExists(payslipNew.getEmployeeNumber())) {
            System.out.println("Employee already exists, skipping insert: " + payslipNew.getEmployeeNumber());
            return;
        }

        String sql = "{CALL INSERT_FULL_EMPLOYEE_PAYROLL_DATA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setString(1, payslipNew.getEmployeeNumber());
            stmt.setString(2, payslipNew.getEmployeeName());
            stmt.setString(3, payslipNew.getCostCenter());
            stmt.setString(4, payslipNew.getPosition());
            stmt.setDate(5, payslipNew.getDateOfJoining());
            stmt.setString(6, payslipNew.getNationality());
            stmt.setDate(7, payslipNew.getPaymentDate());
            stmt.setString(8, payslipNew.getUnpaidDays());
            stmt.setString(9, payslipNew.getPaymentCurrency());

            // Earnings
            String earningName = "";
            String earningCost = "0";
            if (payslipNew.getEarnings() != null && !payslipNew.getEarnings().isEmpty()) {
                earningName = payslipNew.getEarnings().get(0).getName();
                earningCost = payslipNew.getEarnings().get(0).getCost();
            }

            // Deductions
            String deductionName = "";
            String deductionCost = "0";
            if (payslipNew.getDeductions() != null && !payslipNew.getDeductions().isEmpty()) {
                deductionName = payslipNew.getDeductions().get(0).getName();
                deductionCost = payslipNew.getDeductions().get(0).getCost();
            }

            // Payment Info
            String method = "";
            String bankName = "";
            String iban = "";
            if (payslipNew.getPaymentInformation() != null && !payslipNew.getPaymentInformation().isEmpty()) {
                method = payslipNew.getPaymentInformation().get(0).getMethod();
                bankName = payslipNew.getPaymentInformation().get(0).getBankName();
                iban = payslipNew.getPaymentInformation().get(0).getIbanAccountNumber();
            }

            stmt.setString(10, earningName);
            stmt.setString(11, earningCost);
            stmt.setString(12, deductionName);
            stmt.setString(13, deductionCost);
            stmt.setString(14, method);
            stmt.setString(15, bankName);
            stmt.setString(16, iban);

            stmt.execute();
        }
    }

    public byte[] generatePayroller(String fileParam, PayslipNew payslipNew) throws Exception {
        insertFullPayrollData(payslipNew);

        String design = (fileParam != null && !fileParam.isBlank()) ? fileParam : "payroller";
        String path = "reports/" + design + ".rptdesign";

        try (InputStream designStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (designStream == null) {
                throw new IllegalArgumentException("Report not found: " + path);
            }

            IReportRunnable runnable = engine.openReportDesign(designStream);
            IRunAndRenderTask task = engine.createRunAndRenderTask(runnable);

            task.setParameterValue("employeeNumber", payslipNew.getEmployeeNumber());

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
