package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsLogin;
import com.example.OrderingSystem.model.OutputModel.OUser;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Response<InsLogin>> login(@RequestBody InsLogin insLogin) {
        try {
            String token = authService.login(insLogin);
            var response = PaginationHelper.paginate(insLogin, token);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
             var errorResponse = PaginationHelper.error(insLogin, ex.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Response<OUser>> getMe(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            OUser user = authService.getMe(jwtToken);
            var response = PaginationHelper.paginate(user, jwtToken);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new OUser(), ex.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}
