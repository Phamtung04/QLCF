package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsUserBranch;
import com.example.OrderingSystem.model.OutputModel.OUserBranch;
import com.example.OrderingSystem.model.QueryModel.QRID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserBranchService {

    private final JdbcTemplate jdbcTemplate;

    public UserBranchService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String insOrUpdUserBranch(InsUserBranch userBranch) {
        String message = "";
        String sql = "{call ins_UserBranch(?, ?)}"; 
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, userBranch.getRid());
            callableStatement.setString(2, userBranch.getListBranch());

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

    public List<OUserBranch> getAllUserBranches(QRID query) {
        String sql = "{call get_dsUserBranch(?)}"; 
        List<OUserBranch> userBranchList = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OUserBranch oUserBranch = new OUserBranch();
                    oUserBranch.setId(resultSet.getInt("id"));
                    oUserBranch.setName(resultSet.getString("name")); 
                    oUserBranch.setStatus(resultSet.getString("status")); 
                    userBranchList.add(oUserBranch);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return userBranchList;
    }
}
