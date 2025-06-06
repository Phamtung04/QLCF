package com.example.OrderingSystem.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.OrderingSystem.model.OutputModel.OFilterBranch;
import com.example.OrderingSystem.model.OutputModel.OFilterMenuCategories;
import com.example.OrderingSystem.model.OutputModel.OFilterTable;
import com.example.OrderingSystem.model.OutputModel.OIDNAME;
import com.example.OrderingSystem.model.QueryModel.QHome;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    private final JdbcTemplate jdbcTemplate;

    public HomeService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getAllFilterHome(QHome input) {
        String sql = "{call sp_Home(?, ?)}";
        Map<String, Object> output = new HashMap<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, input.getId());
            callableStatement.setInt(2, input.getBranchId());

            boolean hasResults = callableStatement.execute();

            List<OFilterBranch> listBranch = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OFilterBranch oFilterBranch = new OFilterBranch();
                        oFilterBranch.setId(resultSet.getInt("id"));
                        oFilterBranch.setName(resultSet.getString("name"));
                        oFilterBranch.setManagerEmails(resultSet.getString("manager_emails"));
                        listBranch.add(oFilterBranch);
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();

            List<OFilterTable> listTable = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OFilterTable oFilterTable = new OFilterTable();
                        oFilterTable.setId(resultSet.getInt("id"));
                        oFilterTable.setName(resultSet.getString("name"));
                        oFilterTable.setBranchId(resultSet.getInt("branchId"));
                        listTable.add(oFilterTable);
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();

            List<OFilterMenuCategories> listMenuCategories = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OFilterMenuCategories oFilterMenuCategories = new OFilterMenuCategories();
                        oFilterMenuCategories.setId(resultSet.getInt("id"));
                        oFilterMenuCategories.setName(resultSet.getString("name"));
                        oFilterMenuCategories.setImage(resultSet.getString("image"));
                        oFilterMenuCategories.setQuantity(resultSet.getInt("quantity"));
                        listMenuCategories.add(oFilterMenuCategories);
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();

            List<OIDNAME> listDate = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OIDNAME date = new OIDNAME();
                        date.setId(resultSet.getInt("id"));
                        date.setName(resultSet.getString("name"));
                        listDate.add(date);
                    }
                }
            }

            output.put("listBranch", listBranch);
            output.put("listTable", listTable);
            output.put("listMenuCategories", listMenuCategories);
            output.put("listDate", listDate);

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error", e);
        }

        return output;
    }
}
