package customer.sample.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    public Collection<User> getUserByFilter(UserSearch userSearch) throws Exception {
        return userDAO.getUserByFilter(userSearch);
    }
}
