package customer.sample.birt;

import org.springframework.stereotype.Repository;

import javax.sql.rowset.serial.SerialBlob;
import java.io.InputStream;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ImageDAO {

    public List<Image> getImages() {
        List<Image> images = new ArrayList<>();

        String[] fileNames = {
            "reports/images/camera1.png",
            "reports/images/diploma2.png",
            "reports/images/image3.png"
        };

        for (String fileName : fileNames) {
            try (InputStream is = getClass().getClassLoader().getResourceAsStream(fileName)) {
                if (is == null) {
                    System.err.println("Image not found: " + fileName);
                    continue;
                }

                byte[] bytes = is.readAllBytes();
                Blob blob = new SerialBlob(bytes);

                Image image = new Image();
                image.setImage(blob);
                images.add(image);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return images;
    }
}
