package com.example.OrderingSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsStatistics;
import com.example.OrderingSystem.model.OutputModel.OStatistics;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.StatisticsService;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @PostMapping("/get")
    public ResponseEntity<Response<OStatistics>> getStatistics(@RequestBody InsStatistics request) {
        try {
            OStatistics statistics = statisticsService.getStatistics(request);
            var response = PaginationHelper.paginate(statistics, "Data fetched successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new OStatistics(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
