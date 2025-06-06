package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsLogin;
import com.example.OrderingSystem.model.OutputModel.OUser;
import com.example.OrderingSystem.security.jwt.JwtUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;

@Service
public class AuthService {

    private final JdbcTemplate jdbcTemplate;
    private final JwtUtils jwtUtils;

    public AuthService(JdbcTemplate jdbcTemplate, JwtUtils jwtUtils) {
        this.jdbcTemplate = jdbcTemplate;
        this.jwtUtils = jwtUtils;
    }

    public String login(InsLogin insLogin) throws Exception {
        String sql = "{call loginUser(?, ?)}";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, insLogin.getUserName());
            callableStatement.setString(2, insLogin.getPassword());

            ResultSet resultSet = callableStatement.executeQuery();
            if (resultSet.next()) {
                boolean lockUp = resultSet.getBoolean("lock_up");
                if (lockUp) {
                    throw new Exception("Account has been locked");
                }
                int userId = resultSet.getInt("user_id");
                String permission = resultSet.getString("permission");
                return jwtUtils.generateJwtToken(String.valueOf(userId), permission);
            } else {
                throw new Exception("Invalid credentials");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public OUser getMe(String token) throws Exception {
        int userId = Integer.parseInt(jwtUtils.parseToken(token).getSubject());

        String sql = "{call getUserById(?)}";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, userId);
            ResultSet resultSet = callableStatement.executeQuery();
            if (resultSet.next()) {
                boolean lockUp = resultSet.getBoolean("lockUp");
                if (lockUp) {
                    throw new Exception("Account has been locked");
                }
                OUser user = new OUser();
                user.setId(resultSet.getInt("id"));
                user.setName(resultSet.getString("name"));
                user.setEmail(resultSet.getString("email"));
                user.setPermission(resultSet.getString("permission"));
                user.setRid(resultSet.getString("rid"));
                user.setLockUp(lockUp);
                user.setListBranchId(resultSet.getString("listBranch"));
                user.setListNameBranch(resultSet.getString("listNameBranch"));
                return user;
            } else {
                throw new Exception("User not found.");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}
