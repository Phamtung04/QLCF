package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsTable;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.OutputModel.OFilterBranch;
import com.example.OrderingSystem.model.OutputModel.OTable;
import com.example.OrderingSystem.model.QueryModel.QID;
import com.example.OrderingSystem.model.QueryModel.QTable;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class TablesService {

    private final JdbcTemplate jdbcTemplate;

    public TablesService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<OFilterBranch> getAllFilterTables(QID id) {
        String sql = "{call sp_Branches(?)}";
        List<OFilterBranch> tableList = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, id.getId());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OFilterBranch table = new OFilterBranch();
                    table.setId(resultSet.getInt("id"));
                    table.setName(resultSet.getString("name"));
                    table.setManagerEmails(resultSet.getString("manager_emails"));
                    tableList.add(table);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return tableList;
    }

    public String insOrUpdTables(InsTable table) {
        String message = "";
        String sql = "{call insOrUpdTables(?, ?, ?, ?)}";
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, table.getRid());
            callableStatement.setString(2, table.getName());
            callableStatement.setInt(3, table.getBranchId());
            callableStatement.setString(4, table.getDescription());

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

    public List<OTable> getAllTables(QTable query) {
        String sql = "{call get_dsTables(?, ?, ?, ?)}";
        List<OTable> tableList = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());
            callableStatement.setString(2, query.getName());
            callableStatement.setInt(3, query.getBranchId());
            callableStatement.setInt(4, query.getUserID());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OTable table = new OTable();
                    table.setId(resultSet.getInt("id"));
                    table.setName(resultSet.getString("name"));
                    table.setRid(resultSet.getString("rid"));
                    table.setDescription(resultSet.getString("description"));
                    table.setBranchId(resultSet.getInt("branchId"));
                    table.setBranchName(resultSet.getString("branchName"));
                    table.setStatus(resultSet.getInt("status"));
                    table.setQuantity(resultSet.getInt("quantity"));
                    tableList.add(table);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return tableList;
    }

    public String delTables(InsRID id) {
        String message = "";
        String sql = "{call del_Table(?)}";
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
