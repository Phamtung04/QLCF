package com.example.OrderingSystem.model.OutputModel;

import java.math.BigDecimal;
import java.util.List;

public class OStatistics {
    private int totalUsers;
    private int totalOrders;
    private int totalItems;
    private BigDecimal revenueToday;
    private BigDecimal growthVsYesterday;
    private BigDecimal revenueThisMonth;
    private BigDecimal growthVsLastMonth;
    private BigDecimal revenueThisYear;
    private BigDecimal growthVsLastYear;
    private List<ORevenueByDate> revenueByDate;
    private List<OTopSellingProduct> topSellingProducts;

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getRevenueToday() {
        return revenueToday;
    }

    public void setRevenueToday(BigDecimal revenueToday) {
        this.revenueToday = revenueToday;
    }

    public BigDecimal getGrowthVsYesterday() {
        return growthVsYesterday;
    }

    public void setGrowthVsYesterday(BigDecimal growthVsYesterday) {
        this.growthVsYesterday = growthVsYesterday;
    }

    public BigDecimal getRevenueThisMonth() {
        return revenueThisMonth;
    }

    public void setRevenueThisMonth(BigDecimal revenueThisMonth) {
        this.revenueThisMonth = revenueThisMonth;
    }

    public BigDecimal getGrowthVsLastMonth() {
        return growthVsLastMonth;
    }

    public void setGrowthVsLastMonth(BigDecimal growthVsLastMonth) {
        this.growthVsLastMonth = growthVsLastMonth;
    }

    public BigDecimal getRevenueThisYear() {
        return revenueThisYear;
    }

    public void setRevenueThisYear(BigDecimal revenueThisYear) {
        this.revenueThisYear = revenueThisYear;
    }

    public BigDecimal getGrowthVsLastYear() {
        return growthVsLastYear;
    }

    public void setGrowthVsLastYear(BigDecimal growthVsLastYear) {
        this.growthVsLastYear = growthVsLastYear;
    }

    public List<ORevenueByDate> getRevenueByDate() {
        return revenueByDate;
    }

    public void setRevenueByDate(List<ORevenueByDate> revenueByDate) {
        this.revenueByDate = revenueByDate;
    }

    public List<OTopSellingProduct> getTopSellingProducts() {
        return topSellingProducts;
    }

    public void setTopSellingProducts(List<OTopSellingProduct> topSellingProducts) {
        this.topSellingProducts = topSellingProducts;
    }
}