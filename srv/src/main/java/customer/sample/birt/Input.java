package customer.sample.birt;

import java.util.List;
import jakarta.persistence.Id;
import lombok.Data;


@Data
public class Input {
      @Id
      private Long id;
      private List<Images> images;
   
    
}
