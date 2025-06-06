package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsBranch;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.OutputModel.OBranch;
import com.example.OrderingSystem.model.QueryModel.QBranch;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class BranchService {

    private final JdbcTemplate jdbcTemplate;

    public BranchService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String insOrUpdBranches(InsBranch branch) {
        String message = "";
        String sql = "{call insOrUpdBranches(?, ?, ?)}"; 
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {
    
            callableStatement.setString(1, branch.getRid());
            callableStatement.setString(2, branch.getName());
            callableStatement.setString(3, branch.getDescription());
    
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

    public List<OBranch> getAllBranches(QBranch query) {
        String sql = "{call get_dsBranches(?, ?, ?)}"; 
        List<OBranch> branchList = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());
            callableStatement.setString(2, query.getName());
            callableStatement.setInt(3, query.getUserID());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OBranch branch = new OBranch();
                    branch.setId(resultSet.getInt("id"));
                    branch.setName(resultSet.getString("name"));
                    branch.setDescription(resultSet.getString("description"));
                    branch.setRid(resultSet.getString("rid"));

                    branchList.add(branch);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return branchList;
    }

    public String delBranches(InsRID id) {
        String message = "";
        String sql = "{call del_Branch(?)}"; 
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
             CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, id.getRid());

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
}
