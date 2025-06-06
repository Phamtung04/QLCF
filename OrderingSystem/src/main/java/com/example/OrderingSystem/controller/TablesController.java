package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsTable;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.OutputModel.OFilterBranch;
import com.example.OrderingSystem.model.OutputModel.OTable;
import com.example.OrderingSystem.model.QueryModel.QID;
import com.example.OrderingSystem.model.QueryModel.QTable;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.TablesService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TablesController {

    @Autowired
    private TablesService tablesService;

    @PostMapping("/GetAllFilterTables")
    public ResponseEntity<Response<List<OFilterBranch>>> GetAllFilterTables(@RequestBody QID id) {
        try {
            List<OFilterBranch> result = tablesService.getAllFilterTables(id);
            var response = PaginationHelper.paginate(result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OFilterBranch>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/InsOrUpdTables")
    public ResponseEntity<Response<InsTable>> insOrUpdTables(@RequestBody InsTable input) {
        try {
            String result = tablesService.insOrUpdTables(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/DelTables")
    public ResponseEntity<Response<InsRID>> delTables(@RequestBody InsRID id) {
        try {
            String result = tablesService.delTables(id);
            var response = PaginationHelper.paginate(id, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(id, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/GetAllTables")
    public ResponseEntity<Response<List<OTable>>> getAllTables(@RequestBody QTable query) {
        try {
            List<OTable> resultList = tablesService.getAllTables(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OTable>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
