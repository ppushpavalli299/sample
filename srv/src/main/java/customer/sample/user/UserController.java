package customer.sample.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/filter")
    public ResponseEntity<Collection<User>> getUserByFilter(@RequestBody UserSearch userSearch) {
        try {
            Collection<User> users = userService.getUserByFilter(userSearch);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
