import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * PasswordServer.java
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Demonstrates:
 * - Controller / Server Layer: Bridges HTTP transport with Java OOP business logic.
 * - Built-in Java HTTP Server: Uses com.sun.net.httpserver.HttpServer (no heavy frameworks or external JARs).
 * - RESTful Endpoints & JSON Serialization: POST /api/check-password, POST /api/generate-password, GET /api/health.
 * - Defensive Error Handling and CORS Preflight Support.
 */
public class PasswordServer {

    private final HttpServer server;
    private final PasswordService passwordService;
    private final int port;

    public PasswordServer(int port) throws IOException {
        this.port = port;
        this.passwordService = new PasswordService();
        // Create server bound to all interfaces
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        registerRoutes();
        // Uses default executor
        this.server.setExecutor(null);
    }

    private void registerRoutes() {
        // Health check endpoint
        server.createContext("/api/health", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                handleCors(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendError(exchange, 405, "Method Not Allowed. Use GET.");
                    return;
                }

                String response = "{"
                    + "\"status\":\"UP\","
                    + "\"service\":\"SecurePass Java OOP Backend\","
                    + "\"engine\":\"Java 17 (OpenJDK)\","
                    + "\"serverType\":\"com.sun.net.httpserver.HttpServer\","
                    + "\"timestamp\":" + System.currentTimeMillis()
                    + "}";
                sendJsonResponse(exchange, 200, response);
            }
        });

        // Architecture endpoint for college viva & demo
        server.createContext("/api/architecture", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                handleCors(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                String response = "{"
                    + "\"project\":\"SecurePass - Random Password Checker and Generator\","
                    + "\"architecture\":{"
                    +   "\"classes\":["
                    +     "{\"name\":\"PasswordChecker.java\",\"role\":\"Analyzes length, entropy, regex rules, and produces PasswordResult.\"},"
                    +     "{\"name\":\"PasswordGenerator.java\",\"role\":\"Generates cryptographically secure passwords with SecureRandom and Fisher-Yates shuffle.\"},"
                    +     "{\"name\":\"PasswordResult.java\",\"role\":\"Encapsulates strength scores, requirements, entropy bits, and suggestions.\"},"
                    +     "{\"name\":\"PasswordRule.java\",\"role\":\"Interface demonstrating Polymorphism and Abstraction for pluggable validation criteria.\"},"
                    +     "{\"name\":\"PasswordService.java\",\"role\":\"Coordinates checker and generator; decouples business logic from networking.\"},"
                    +     "{\"name\":\"PasswordServer.java\",\"role\":\"Java HttpServer handling REST API endpoints with robust error handling.\"}"
                    +   "],"
                    +   "\"oopPrinciples\":["
                    +     "{\"principle\":\"Encapsulation\",\"description\":\"Private fields in PasswordResult, PasswordChecker, and PasswordGenerator with validated accessors.\"},"
                    +     "{\"principle\":\"Abstraction\",\"description\":\"Complex Shannon entropy, regex patterns, and SecureRandom bit operations are abstracted behind simple interfaces.\"},"
                    +     "{\"principle\":\"Polymorphism\",\"description\":\"PasswordRule interface enables dynamic registration and polymorphic evaluation of individual rules.\"},"
                    +     "{\"principle\":\"Separation of Concerns\",\"description\":\"Domain logic (checker/generator) is decoupled from HTTP I/O (controller/server).\"}"
                    +   "]"
                    + "}}";
                sendJsonResponse(exchange, 200, response);
            }
        });

        // Password Checker endpoint
        server.createContext("/api/check-password", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                handleCors(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendError(exchange, 405, "Method Not Allowed. Use POST.");
                    return;
                }

                try {
                    String requestBody = readBody(exchange.getRequestBody());
                    String password = extractJsonStringField(requestBody, "password");

                    if (password == null) {
                        password = "";
                    }

                    // Perform check using OOP service
                    PasswordResult result = passwordService.checkPassword(password);
                    sendJsonResponse(exchange, 200, result.toJson());
                } catch (Exception e) {
                    sendError(exchange, 400, "Invalid JSON request: " + e.getMessage());
                }
            }
        });

        // Password Generator endpoint
        server.createContext("/api/generate-password", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                handleCors(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendError(exchange, 405, "Method Not Allowed. Use POST.");
                    return;
                }

                try {
                    String requestBody = readBody(exchange.getRequestBody());
                    
                    // Parse options with safe defaults
                    int length = extractJsonIntField(requestBody, "length", 16);
                    boolean useUpper = extractJsonBooleanField(requestBody, "uppercase", true);
                    boolean useLower = extractJsonBooleanField(requestBody, "lowercase", true);
                    boolean useNumbers = extractJsonBooleanField(requestBody, "numbers", true);
                    boolean useSpecial = extractJsonBooleanField(requestBody, "special", true);

                    if (!useUpper && !useLower && !useNumbers && !useSpecial) {
                        sendError(exchange, 400, "At least one character category (uppercase, lowercase, numbers, or special) must be enabled.");
                        return;
                    }

                    // Generate using SecureRandom via Java service
                    String generatedPassword = passwordService.generatePassword(length, useUpper, useLower, useNumbers, useSpecial);
                    // Also calculate its strength result
                    PasswordResult strengthResult = passwordService.checkPassword(generatedPassword);

                    StringBuilder json = new StringBuilder();
                    json.append("{");
                    json.append("\"password\":\"").append(escapeJson(generatedPassword)).append("\",");
                    json.append("\"length\":").append(generatedPassword.length()).append(",");
                    json.append("\"analysis\":").append(strengthResult.toJson());
                    json.append("}");

                    sendJsonResponse(exchange, 200, json.toString());
                } catch (Exception e) {
                    sendError(exchange, 500, "Error generating password: " + e.getMessage());
                }
            }
        });
    }

    public void start() {
        server.start();
        System.out.println("=================================================");
        System.out.println(" SecurePass Java Server Started Successfully!");
        System.out.println(" Port: " + port);
        System.out.println(" Endpoints:");
        System.out.println("   POST http://localhost:" + port + "/api/check-password");
        System.out.println("   POST http://localhost:" + port + "/api/generate-password");
        System.out.println("   GET  http://localhost:" + port + "/api/health");
        System.out.println("   GET  http://localhost:" + port + "/api/architecture");
        System.out.println("=================================================");
    }

    public void stop() {
        server.stop(1);
    }

    // CORS handler for browser cross-origin requests
    private void handleCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        String errorJson = "{\"error\":\"" + escapeJson(message) + "\",\"statusCode\":" + statusCode + "}";
        sendJsonResponse(exchange, statusCode, errorJson);
    }

    private String readBody(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    // Beginner-friendly JSON extraction helper methods without third-party dependencies
    private static String extractJsonStringField(String json, String field) {
        Pattern pattern = Pattern.compile("\"" + field + "\"\\s*:\\s*\"([^\"]*)\"");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private static int extractJsonIntField(String json, String field, int defaultValue) {
        Pattern pattern = Pattern.compile("\"" + field + "\"\\s*:\\s*(\\d+)");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException ignored) {}
        }
        return defaultValue;
    }

    private static boolean extractJsonBooleanField(String json, String field, boolean defaultValue) {
        Pattern pattern = Pattern.compile("\"" + field + "\"\\s*:\\s*(true|false)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return Boolean.parseBoolean(matcher.group(1));
        }
        return defaultValue;
    }

    private static String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r");
    }

    public static void main(String[] args) {
        int port = 8085;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("Invalid port parameter, using default 8085");
            }
        } else if (System.getenv("JAVA_PORT") != null) {
            try {
                port = Integer.parseInt(System.getenv("JAVA_PORT"));
            } catch (NumberFormatException ignored) {}
        }

        try {
            PasswordServer server = new PasswordServer(port);
            server.start();
        } catch (IOException e) {
            System.err.println("Failed to start Java PasswordServer: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
