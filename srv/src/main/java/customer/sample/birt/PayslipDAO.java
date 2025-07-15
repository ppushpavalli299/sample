package customer.sample.birt;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.persistence.StoredProcedureQuery;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PayslipDAO {

    private final JdbcTemplate jdbc;

    public List<Payslip> getPayslipsFromProcedure() {
        return jdbc.query(
                "CALL GET_EMPLOYEE_PDF()",
                BeanPropertyRowMapper.newInstance(Payslip.class)
        );
    }
    

    
}
