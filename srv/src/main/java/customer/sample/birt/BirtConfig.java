package customer.sample.birt;


import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.EngineConfig;
import org.eclipse.birt.report.engine.api.IReportEngine;
import org.eclipse.birt.report.engine.api.IReportEngineFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.logging.Level;
import java.util.logging.Logger;

@Configuration
public class BirtConfig {

    @Bean
    public IReportEngine reportEngine() throws BirtException {
        EngineConfig config = new EngineConfig();
        config.setLogConfig(null, Level.SEVERE);
        config.setEngineHome("birt"); // You can adjust this path if needed

        Platform.startup(config);
        IReportEngineFactory factory = (IReportEngineFactory) Platform.createFactoryObject(IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
        return factory.createReportEngine(config);
    }
}
