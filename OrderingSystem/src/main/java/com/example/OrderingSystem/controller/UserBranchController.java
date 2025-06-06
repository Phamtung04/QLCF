package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsUserBranch;
import com.example.OrderingSystem.model.OutputModel.OUserBranch;
import com.example.OrderingSystem.model.QueryModel.QRID;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.UserBranchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/userBranches")
public class UserBranchController {

    @Autowired
    private UserBranchService userBranchService;
    
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/InsOrUpdUserBranch")
    public ResponseEntity<Response<InsUserBranch>> insOrUpdUserBranch(@RequestBody InsUserBranch input) {
        try {
            String result = userBranchService.insOrUpdUserBranch(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/GetAllUserBranches")
    public ResponseEntity<Response<List<OUserBranch>>> getAllUserBranches(@RequestBody QRID query) {
        try {
            List<OUserBranch> resultList = userBranchService.getAllUserBranches(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OUserBranch>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
