package customer.sample.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import customer.sample.employee.EmployeeRequest;

import java.util.Collection;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    public Collection<User> getUserByFilter(UserSearch userSearch) throws Exception {
        return userDAO.getUserByFilter(userSearch);
    }

    public UserRequest getUserById(Long id) throws Exception {
        try {
            return userDAO.getUserById(id);
        } catch (Exception e) {
            throw e;
        }
    }

    public String createUser(UserRequest userRequest) throws Exception {
        return userDAO.createUser(userRequest);
    }
}
