package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsUser;
import com.example.OrderingSystem.model.InputModel.InsStatusUser;
import com.example.OrderingSystem.model.OutputModel.OUser;
import com.example.OrderingSystem.model.QueryModel.QUser;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final JdbcTemplate jdbcTemplate;

    public UserService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String insOrUpdUsers(InsUser user) {
        String message = "";
        String sql = "{call insOrUpdUsers(?, ?, ?, ?, ?, ?, ?)}";
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {
    
            callableStatement.setString(1, user.getRid());
            callableStatement.setString(2, user.getUserName());
            callableStatement.setInt(3, user.getBranchId());
            callableStatement.setString(4, user.getPassword());
            callableStatement.setString(5, user.getPermission());
            callableStatement.setString(6, user.getEmail());
            callableStatement.setBoolean(7, user.isLockUp());
    
            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    message = resultSet.getString("message");
                }
            }
    
            return message;
    
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }    

    public List<OUser> getUsers(QUser query) {
        String sql = "{call get_dsUsers(?, ?, ?)}";
        List<OUser> userList = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());
            callableStatement.setString(2, query.getName());
            callableStatement.setInt(3, query.getBranchId());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OUser user = new OUser();
                    user.setId(resultSet.getInt("id"));
                    user.setName(resultSet.getString("name"));
                    user.setEmail(resultSet.getString("email"));
                    user.setPermission(resultSet.getString("permission"));
                    user.setRid(resultSet.getString("rid"));
                    user.setLockUp(resultSet.getBoolean("lockUp"));
                    user.setListBranchId(resultSet.getString("listBranch"));
                    user.setListNameBranch(resultSet.getString("listNameBranch"));

                    userList.add(user);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return userList;
    }

    public String upTTUser(InsStatusUser input) {
        String message = "";
        String sql = "{call up_TT_Users(?, ?)}"; 
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, input.getRid());
            callableStatement.setBoolean(2, input.isLockUp());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    message = resultSet.getString("message");
                }
            }
            return message;

        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }
    //

//    public boolean deleteUser(String userId) {
//        String sql = "DELETE FROM users WHERE id = ?";
//        boolean isDeleted = false;
//
//        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
//             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
//
//            // Gán giá trị tham số
//            preparedStatement.setString(1, userId);
//
//            // Thực thi lệnh DELETE
//            int rowsAffected = preparedStatement.executeUpdate();
//
//            // Kiểm tra nếu xóa thành công
//            isDeleted = rowsAffected > 0;
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return isDeleted;
//    }



}
