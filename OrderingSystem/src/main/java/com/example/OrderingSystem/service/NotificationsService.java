package com.example.OrderingSystem.service;

import com.example.OrderingSystem.model.InputModel.InsStatusNotification;
import com.example.OrderingSystem.model.OutputModel.ONotification;
import com.example.OrderingSystem.model.QueryModel.QNotification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationsService {

    private final JdbcTemplate jdbcTemplate;

    public NotificationsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ONotification> getAllNotifications(QNotification query) {
        String sql = "{call get_dsNotifications(?, ?, ?, ?, ?, ?, ?)}";
        List<ONotification> notifications = new ArrayList<>();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, query.getRid());
            callableStatement.setInt(2, query.getUserId());
            callableStatement.setInt(3, query.getBranchId());
            callableStatement.setInt(4, query.getTableId());
            callableStatement.setString(5, query.getClientId());
            callableStatement.setInt(6, query.getStatusAdmin());
            callableStatement.setInt(7, query.getStatusClient());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    ONotification notification = new ONotification();
                    notification.setRid(resultSet.getString("rid"));
                    notification.setNotificationId(resultSet.getInt("notificationId"));
                    notification.setOrderId(resultSet.getInt("orderId"));
                    notification.setBranchId(resultSet.getInt("branchId"));
                    notification.setBranchName(resultSet.getString("branchName"));
                    notification.setTableId(resultSet.getInt("tableId"));
                    notification.setTableName(resultSet.getString("tableName"));
                    notification.setSentTime(resultSet.getString("sentTime"));
                    notification.setAdminStatus(resultSet.getInt("adminStatus"));
                    notification.setClientStatus(resultSet.getInt("clientStatus"));
                    notification.setOrderStatus(resultSet.getString("orderStatus"));
                    notifications.add(notification);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return notifications;
    }

    public String updateNotificationStatus(InsStatusNotification input) {
        String sql = "{call up_Notifications(?, ?, ?)}";
        String message = "";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, input.getRid());
            callableStatement.setInt(2, input.getStatusAdmin());
            callableStatement.setInt(3, input.getStatusClient());

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
