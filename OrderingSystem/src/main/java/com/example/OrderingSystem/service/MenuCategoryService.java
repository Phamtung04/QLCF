package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsMenuCategory;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.OutputModel.OMenuCategories;
import com.example.OrderingSystem.model.QueryModel.QMenuCategories;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class MenuCategoryService {

    private final JdbcTemplate jdbcTemplate;

    public MenuCategoryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String insOrUpdMenuCategorie(InsMenuCategory menuCategory) {
        String message = "";
        String sql = "{call insOrUpdMenuCategories(?, ?, ?)}";
        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, menuCategory.getRid());
            callableStatement.setString(2, menuCategory.getName());
            callableStatement.setString(3, menuCategory.getImage()); 

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

    public String delMenuCategories(InsRID id) {
        String message = "";
        String sql = "{call del_MenuCategories(?)}";
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

    public List<OMenuCategories> getAllMenuCategories(QMenuCategories query) {
        String sql = "{call get_dsMenuCategories(?, ?)}";
        List<OMenuCategories> menuCategoriesList = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());
            callableStatement.setString(2, query.getName());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    OMenuCategories menuCategory = new OMenuCategories();

                    menuCategory.setId(resultSet.getInt("id"));
                    menuCategory.setName(resultSet.getString("name"));
                    menuCategory.setImage(resultSet.getString("image")); 
                    menuCategory.setRid(resultSet.getString("rid")); 

                    menuCategoriesList.add(menuCategory);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return menuCategoriesList;
    }
}
