package com.nexus.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final String apiKey;
    private final String fromName;
    private final String fromEmail;
    private final HttpClient httpClient;

    public EmailService(
            @Value("${brevo.api.key}") String apiKey,
            @Value("${brevo.from.name}") String fromName,
            @Value("${brevo.from.email}") String fromEmail) {
        this.apiKey = apiKey;
        this.fromName = fromName;
        this.fromEmail = fromEmail;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Async
    public void sendOtpEmail(String email, String otp) {
        String subject = "GMC Nexus - Verify Your Email";
        
        String htmlContent = "<!DOCTYPE html><html><head><style>"
                + "body { font-family: Arial, sans-serif; background-color: #0b0c10; color: #ffffff; padding: 30px; }"
                + ".card { background-color: #13141c; border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; max-width: 500px; margin: 0 auto; }"
                + ".otp { font-size: 32px; font-weight: bold; color: #f97316; letter-spacing: 4px; text-align: center; margin: 20px 0; }"
                + ".footer { font-size: 11px; color: #888; text-align: center; margin-top: 25px; }"
                + "</style></head><body>"
                + "<div class='card'><h2>Email Verification Code</h2>"
                + "<p>Thank you for registering at GMC Nexus. Use the following One-Time Password (OTP) to complete your signup process. This code is valid for 10 minutes.</p>"
                + "<div class='otp'>" + otp + "</div>"
                + "<p>If you did not request this code, please ignore this email.</p>"
                + "<div class='footer'>&copy; " + java.time.Year.now().getValue() + " GMC Nexus. All rights reserved.</div>"
                + "</div></body></html>";

        String escapedHtml = htmlContent.replace("\"", "\\\"");

        String jsonPayload = "{"
                + "\"sender\":{\"name\":\"" + fromName + "\",\"email\":\"" + fromEmail + "\"},"
                + "\"to\":[{\"email\":\"" + email + "\"}],"
                + "\"subject\":\"" + subject + "\","
                + "\"htmlContent\":\"" + escapedHtml + "\""
                + "}";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 201) {
                System.out.println("[⚡ Email Success] OTP sent successfully to " + email);
            } else {
                System.err.println("[❌ Email Error] Failed to send OTP email to " + email + ". Status: " + response.statusCode() + ", Response: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("[⚠️ Email Exception] Error sending OTP email: " + e.getMessage());
        }
    }
}
