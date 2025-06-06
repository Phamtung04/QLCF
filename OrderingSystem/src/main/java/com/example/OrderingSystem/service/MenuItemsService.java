package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsMenuItem;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.InputModel.InsStatusMenuItem;
import com.example.OrderingSystem.model.OutputModel.OFilterBranch;
import com.example.OrderingSystem.model.OutputModel.OFilterMenuCategories;
import com.example.OrderingSystem.model.OutputModel.OMenuItem;
import com.example.OrderingSystem.model.QueryModel.QID;
import com.example.OrderingSystem.model.QueryModel.QMenuItem;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MenuItemsService {

    private final JdbcTemplate jdbcTemplate;

    public MenuItemsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getAllFilterMenuItems(QID input) {
        String sql = "{call sp_BranchesMenuCategories(?)}";
        Map<String, Object> output = new HashMap<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, input.getId());

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

            output.put("listBranch", listBranch);
            output.put("listMenuCategories", listMenuCategories);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return output;
    }

    public String insOrUpdMenuItems(InsMenuItem input) {
        String message = "";
        String sql = "{call insOrUpdMenuItems(?, ?, ?, ?, ?, ?, ?, ?)}";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, input.getRid());
            callableStatement.setInt(2, input.getBranchId());
            callableStatement.setInt(3, input.getCategoryId());
            callableStatement.setString(4, input.getName());
            callableStatement.setString(5, input.getDescription());
            callableStatement.setString(6, input.getImage());
            callableStatement.setBoolean(7, input.isDisabled());
            callableStatement.setDouble(8, input.getPrice());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    message = resultSet.getString("message");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
        return message;
    }

    public String delMenuItems(InsRID id) {
        String sql = "{call del_MenuItems(?)}";
        String message = "";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, id.getRid());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    message = resultSet.getString("message");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
        return message;
    }

    public List<OMenuItem> getAllMenuItems(QMenuItem query) {
        String sql = "{call get_dsMenuItems(?, ?, ?, ?, ?, ?)}";
        List<OMenuItem> menuItems = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());
            callableStatement.setInt(2, query.getCategoryId());
            callableStatement.setString(3, query.getName());
            callableStatement.setInt(4, query.getBranchId());
            callableStatement.setInt(5, query.getIsDisabled());
            callableStatement.setInt(6, query.getUserID());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OMenuItem item = new OMenuItem();
                    item.setRid(resultSet.getString("rid"));
                    item.setId(resultSet.getInt("id"));
                    item.setName(resultSet.getString("name"));
                    item.setCategoryId(resultSet.getInt("categoryId"));
                    item.setCategoryName(resultSet.getString("categoryName"));
                    item.setDescription(resultSet.getString("description"));
                    item.setImage(resultSet.getString("image"));
                    item.setDisabled(resultSet.getBoolean("isDisabled"));
                    item.setBranchId(resultSet.getInt("branchID"));
                    item.setBranchName(resultSet.getString("branchName"));
                    item.setPrice(resultSet.getDouble("price"));
                    menuItems.add(item);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return menuItems;
    }

    public String updateMenuItemStatus(InsStatusMenuItem input) {
        String sql = "{call up_TT_MenuItems(?, ?)}";
        String message = "";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, input.getRid());
            callableStatement.setBoolean(2, input.isDisabled());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    message = resultSet.getString("message");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
        return message;
    }
}
