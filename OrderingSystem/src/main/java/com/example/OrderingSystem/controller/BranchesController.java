package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsBranch;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.OutputModel.OBranch;
import com.example.OrderingSystem.model.QueryModel.QBranch;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.BranchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchesController {

    @Autowired
    private BranchService branchService;
    
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/InsOrUpdBranches")
    public ResponseEntity<Response<InsBranch>> insOrUpdBranches(@RequestBody InsBranch input) {
        try {
            String result = branchService.insOrUpdBranches(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/DelBranches")
    public ResponseEntity<Response<InsRID>> delBranches(@RequestBody InsRID id) {
        try {
            String result = branchService.delBranches(id);
            var response = PaginationHelper.paginate(id, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(id, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/GetAllBranches")
    public ResponseEntity<Response<List<OBranch>>> getAllBranches(@RequestBody QBranch query) {
        try {
            List<OBranch> resultList = branchService.getAllBranches(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OBranch>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
