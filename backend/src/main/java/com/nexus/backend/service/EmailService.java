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
        System.out.println("[✉️ EmailService] Initialized with sender: " + fromName + " <" + fromEmail + ">, API Key (first 10 chars): " + (apiKey != null && apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "invalid"));
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Async
    public void sendOtpEmail(String email, String otp) {
        String subject = "GMC Nexus - Verify Your Email";
        
        String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "  <meta charset='utf-8'>"
                + "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "  <title>Verify Your Email</title>"
                + "  <style>"
                + "    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; }"
                + "    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }"
                + "    .container { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }"
                + "    .header-gradient { height: 6px; background: linear-gradient(90deg, #f97316 0%, #f59e0b 100%); }"
                + "    .content { padding: 40px 32px; text-align: center; }"
                + "    .brand { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a; margin-bottom: 24px; }"
                + "    .brand span { color: #f97316; }"
                + "    .title { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }"
                + "    .subtitle { font-size: 14px; line-height: 22px; color: #64748b; margin-top: 0; margin-bottom: 32px; }"
                + "    .code-container { background: #fff7ed; border: 2px dashed #ffedd5; border-radius: 16px; padding: 24px; margin-bottom: 32px; }"
                + "    .code-label { font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; color: #c2410c; margin-bottom: 8px; }"
                + "    .code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #ea580c; letter-spacing: 8px; padding-left: 8px; }"
                + "    .security-notice { font-size: 12px; line-height: 18px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px; }"
                + "    .footer-text { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px; }"
                + "  </style>"
                + "</head>"
                + "<body>"
                + "  <div class='wrapper'>"
                + "    <div class='container'>"
                + "      <div class='header-gradient'></div>"
                + "      <div class='content'>"
                + "        <div class='brand'>Flash AI</div>"
                + "        <h1 class='title'>Verify your email address</h1>"
                + "        <p class='subtitle'>Please use the verification code below to complete your registration process. This code is active for 10 minutes.</p>"
                + "        <div class='code-container'>"
                + "          <div class='code-label'>Verification Code</div>"
                + "          <div class='code'>" + otp + "</div>"
                + "        </div>"
                + "        <p class='security-notice'>If you did not request this email, please ignore this message. Your account security has not been compromised.</p>"
                + "      </div>"
                + "    </div>"
                + "    <p class='footer-text'>&copy; " + java.time.Year.now().getValue() + " GMC Nexus. All rights reserved.<br>GMC Vertex Hackathon Project</p>"
                + "  </div>"
                + "</body>"
                + "</html>";

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
