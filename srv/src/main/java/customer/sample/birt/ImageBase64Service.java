package customer.sample.birt;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@Service
public class ImageBase64Service {

    public String getImageAsBase64(String fileName) {
        try {
            ClassPathResource imgFile = new ClassPathResource("reports/images/" + fileName);
            byte[] fileContent = Files.readAllBytes(imgFile.getFile().toPath());
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
