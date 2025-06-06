package com.example.OrderingSystem.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.OrderingSystem.model.InputModel.InsStatistics;
import com.example.OrderingSystem.model.OutputModel.ORevenueByDate;
import com.example.OrderingSystem.model.OutputModel.OStatistics;
import com.example.OrderingSystem.model.OutputModel.OTopSellingProduct;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StatisticsService {

    private final JdbcTemplate jdbcTemplate;

    public StatisticsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public OStatistics getStatistics(InsStatistics request) {
        String sql = "{call GetStatistics(?, ?, ?)}";
        OStatistics output = new OStatistics();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, request.getStartDate());
            callableStatement.setString(2, request.getEndDate());
            callableStatement.setInt(3, request.getBranchId());

            boolean hasResults = callableStatement.execute();

            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    if (resultSet.next()) {
                        output.setTotalUsers(resultSet.getInt("total_users"));
                        output.setTotalOrders(resultSet.getInt("total_orders"));
                        output.setTotalItems(resultSet.getInt("total_items"));
                        output.setRevenueToday(resultSet.getBigDecimal("revenue_today"));
                        output.setGrowthVsYesterday(resultSet.getBigDecimal("growth_vs_yesterday"));
                        output.setRevenueThisMonth(resultSet.getBigDecimal("revenue_this_month"));
                        output.setGrowthVsLastMonth(resultSet.getBigDecimal("growth_vs_last_month"));
                        output.setRevenueThisYear(resultSet.getBigDecimal("revenue_this_year"));
                        output.setGrowthVsLastYear(resultSet.getBigDecimal("growth_vs_last_year"));
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    List<ORevenueByDate> revenueByDateList = new ArrayList<>();
                    while (resultSet.next()) {
                        ORevenueByDate revenueByDate = new ORevenueByDate();
                        revenueByDate.setDate(resultSet.getString("date"));
                        revenueByDate.setRevenue(resultSet.getBigDecimal("revenue"));
                        revenueByDateList.add(revenueByDate);
                    }
                    output.setRevenueByDate(revenueByDateList);
                }
            }

            hasResults = callableStatement.getMoreResults();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    List<OTopSellingProduct> topSellingProducts = new ArrayList<>();
                    while (resultSet.next()) {
                        OTopSellingProduct topProduct = new OTopSellingProduct();
                        topProduct.setItemId(resultSet.getInt("item_id"));
                        topProduct.setItemName(resultSet.getString("item_name"));
                        topProduct.setTotalSold(resultSet.getInt("total_sold"));
                        topSellingProducts.add(topProduct);
                    }
                    output.setTopSellingProducts(topSellingProducts);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error", e);
        }

        return output;
    }
}
