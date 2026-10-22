import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * PasswordResult.java
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Demonstrates: OOP Encapsulation (private fields, validation, getters/setters)
 * 
 * Holds the analytical output of a password strength evaluation.
 * Note: For security best practices, the plain password itself is NEVER stored
 * or returned in this result object.
 */
public class PasswordResult {

    // Private fields enforcing Encapsulation
    private int score;                  // 0 to 100
    private String strengthLevel;       // Very Weak, Weak, Medium, Strong, Very Strong
    private boolean meetsLength;        // >= 8 characters
    private boolean hasUppercase;       // Contains [A-Z]
    private boolean hasLowercase;       // Contains [a-z]
    private boolean hasNumber;          // Contains [0-9]
    private boolean hasSpecial;         // Contains symbols
    private int length;                 // Character count
    private double entropyBits;         // Information entropy in bits
    private String crackTimeDisplay;    // Estimated brute force resistance heuristic
    private List<String> suggestions;   // Actionable improvement tips
    private long evaluatedTimestamp;    // Epoch timestamp

    // Default constructor
    public PasswordResult() {
        this.suggestions = new ArrayList<>();
        this.evaluatedTimestamp = System.currentTimeMillis();
    }

    // Parameterized constructor
    public PasswordResult(int score, String strengthLevel, boolean meetsLength,
                          boolean hasUppercase, boolean hasLowercase,
                          boolean hasNumber, boolean hasSpecial, int length,
                          double entropyBits, String crackTimeDisplay,
                          List<String> suggestions) {
        this.setScore(score);
        this.setStrengthLevel(strengthLevel);
        this.meetsLength = meetsLength;
        this.hasUppercase = hasUppercase;
        this.hasLowercase = hasLowercase;
        this.hasNumber = hasNumber;
        this.hasSpecial = hasSpecial;
        this.length = length;
        this.entropyBits = entropyBits;
        this.crackTimeDisplay = crackTimeDisplay;
        this.suggestions = suggestions != null ? new ArrayList<>(suggestions) : new ArrayList<>();
        this.evaluatedTimestamp = System.currentTimeMillis();
    }

    // Getters and Setters with validation (Encapsulation)
    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        // Enforce boundary constraint [0, 100]
        if (score < 0) this.score = 0;
        else if (score > 100) this.score = 100;
        else this.score = score;
    }

    public String getStrengthLevel() {
        return strengthLevel;
    }

    public void setStrengthLevel(String strengthLevel) {
        if (strengthLevel == null || strengthLevel.trim().isEmpty()) {
            this.strengthLevel = "Unknown";
        } else {
            this.strengthLevel = strengthLevel;
        }
    }

    public boolean isMeetsLength() {
        return meetsLength;
    }

    public void setMeetsLength(boolean meetsLength) {
        this.meetsLength = meetsLength;
    }

    public boolean isHasUppercase() {
        return hasUppercase;
    }

    public void setHasUppercase(boolean hasUppercase) {
        this.hasUppercase = hasUppercase;
    }

    public boolean isHasLowercase() {
        return hasLowercase;
    }

    public void setHasLowercase(boolean hasLowercase) {
        this.hasLowercase = hasLowercase;
    }

    public boolean isHasNumber() {
        return hasNumber;
    }

    public void setHasNumber(boolean hasNumber) {
        this.hasNumber = hasNumber;
    }

    public boolean isHasSpecial() {
        return hasSpecial;
    }

    public void setHasSpecial(boolean hasSpecial) {
        this.hasSpecial = hasSpecial;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = Math.max(0, length);
    }

    public double getEntropyBits() {
        return entropyBits;
    }

    public void setEntropyBits(double entropyBits) {
        this.entropyBits = Math.max(0.0, entropyBits);
    }

    public String getCrackTimeDisplay() {
        return crackTimeDisplay;
    }

    public void setCrackTimeDisplay(String crackTimeDisplay) {
        this.crackTimeDisplay = crackTimeDisplay;
    }

    public List<String> getSuggestions() {
        return Collections.unmodifiableList(suggestions);
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions != null ? new ArrayList<>(suggestions) : new ArrayList<>();
    }

    public void addSuggestion(String tip) {
        if (tip != null && !tip.trim().isEmpty() && !suggestions.contains(tip)) {
            suggestions.add(tip);
        }
    }

    public long getEvaluatedTimestamp() {
        return evaluatedTimestamp;
    }

    /**
     * Converts this result into clean JSON format without external dependencies.
     */
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"score\":").append(score).append(",");
        json.append("\"strengthLevel\":\"").append(escapeJson(strengthLevel)).append("\",");
        json.append("\"meetsLength\":").append(meetsLength).append(",");
        json.append("\"hasUppercase\":").append(hasUppercase).append(",");
        json.append("\"hasLowercase\":").append(hasLowercase).append(",");
        json.append("\"hasNumber\":").append(hasNumber).append(",");
        json.append("\"hasSpecial\":").append(hasSpecial).append(",");
        json.append("\"length\":").append(length).append(",");
        json.append("\"entropyBits\":").append(String.format(java.util.Locale.US, "%.1f", entropyBits)).append(",");
        json.append("\"crackTimeDisplay\":\"").append(escapeJson(crackTimeDisplay)).append("\",");
        json.append("\"evaluatedTimestamp\":").append(evaluatedTimestamp).append(",");

        json.append("\"suggestions\":[");
        for (int i = 0; i < suggestions.size(); i++) {
            json.append("\"").append(escapeJson(suggestions.get(i))).append("\"");
            if (i < suggestions.size() - 1) {
                json.append(",");
            }
        }
        json.append("]}");
        return json.toString();
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
}
