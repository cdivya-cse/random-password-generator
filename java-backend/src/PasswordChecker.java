import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * PasswordChecker.java
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Demonstrates:
 * - OOP Abstraction: Complex regex checks and entropy mathematics are hidden behind a simple check() method.
 * - OOP Polymorphism: Uses a polymorphic collection of PasswordRule implementations.
 * - Single Responsibility: Focuses purely on analyzing and scoring password strength.
 */
public class PasswordChecker {

    // Concrete rule implementations demonstrating Polymorphism & Abstraction
    private final List<PasswordRule> rules;

    // Common weak patterns for penalty deductions
    private static final List<String> COMMON_PATTERNS = Arrays.asList(
        "123456", "password", "12345678", "qwerty", "123456789", "12345",
        "1234", "111111", "1234567", "dragon", "welcome", "admin", "admin123"
    );

    public PasswordChecker() {
        this.rules = new ArrayList<>();
        initializeRules();
    }

    /**
     * Registers polymorphic rule implementations.
     */
    private void initializeRules() {
        // 1. Length Rule
        rules.add(new PasswordRule() {
            @Override
            public boolean evaluate(String pwd) {
                return pwd != null && pwd.length() >= 8;
            }

            @Override
            public String getSuggestion() {
                return "Increase length to at least 8 characters (12+ recommended for high security).";
            }

            @Override
            public String getRuleName() {
                return "Minimum 8 Characters";
            }

            @Override
            public int getScoreWeight() {
                return 25;
            }
        });

        // 2. Uppercase Rule
        rules.add(new PasswordRule() {
            private final Pattern UPPER = Pattern.compile("[A-Z]");

            @Override
            public boolean evaluate(String pwd) {
                return pwd != null && UPPER.matcher(pwd).find();
            }

            @Override
            public String getSuggestion() {
                return "Add at least one uppercase letter (A-Z).";
            }

            @Override
            public String getRuleName() {
                return "Uppercase Letter";
            }

            @Override
            public int getScoreWeight() {
                return 15;
            }
        });

        // 3. Lowercase Rule
        rules.add(new PasswordRule() {
            private final Pattern LOWER = Pattern.compile("[a-z]");

            @Override
            public boolean evaluate(String pwd) {
                return pwd != null && LOWER.matcher(pwd).find();
            }

            @Override
            public String getSuggestion() {
                return "Add at least one lowercase letter (a-z).";
            }

            @Override
            public String getRuleName() {
                return "Lowercase Letter";
            }

            @Override
            public int getScoreWeight() {
                return 15;
            }
        });

        // 4. Number Rule
        rules.add(new PasswordRule() {
            private final Pattern DIGIT = Pattern.compile("[0-9]");

            @Override
            public boolean evaluate(String pwd) {
                return pwd != null && DIGIT.matcher(pwd).find();
            }

            @Override
            public String getSuggestion() {
                return "Include at least one numerical digit (0-9).";
            }

            @Override
            public String getRuleName() {
                return "Numeric Digit";
            }

            @Override
            public int getScoreWeight() {
                return 15;
            }
        });

        // 5. Special Character Rule
        rules.add(new PasswordRule() {
            private final Pattern SPECIAL = Pattern.compile("[!@#$%^&*()\\-_=+\\[\\]{}|;:,.<>?/~`]");

            @Override
            public boolean evaluate(String pwd) {
                return pwd != null && SPECIAL.matcher(pwd).find();
            }

            @Override
            public String getSuggestion() {
                return "Add at least one symbol or special character (!@#$%^&*).";
            }

            @Override
            public String getRuleName() {
                return "Special Character";
            }

            @Override
            public int getScoreWeight() {
                return 20;
            }
        });
    }

    /**
     * Analyzes the strength of a given password and returns a structured PasswordResult.
     * @param password The raw password to evaluate.
     * @return Encapsulated analysis result.
     */
    public PasswordResult check(String password) {
        if (password == null || password.isEmpty()) {
            List<String> initialTips = new ArrayList<>();
            initialTips.add("Enter a password to begin real-time security analysis.");
            return new PasswordResult(0, "Very Weak", false, false, false, false, false, 0, 0.0, "Instant", initialTips);
        }

        int length = password.length();
        boolean meetsLength = length >= 8;
        boolean hasUppercase = Pattern.compile("[A-Z]").matcher(password).find();
        boolean hasLowercase = Pattern.compile("[a-z]").matcher(password).find();
        boolean hasNumber = Pattern.compile("[0-9]").matcher(password).find();
        boolean hasSpecial = Pattern.compile("[!@#$%^&*()\\-_=+\\[\\]{}|;:,.<>?/~`]").matcher(password).find();

        List<String> suggestions = new ArrayList<>();

        // Polymorphic rule evaluation
        for (PasswordRule rule : rules) {
            if (!rule.evaluate(password)) {
                suggestions.add(rule.getSuggestion());
            }
        }

        // Calculate base score from criteria
        int rawScore = 0;

        // Length bonus points:
        // < 6 chars: 5 pts
        // 6-7 chars: 10 pts
        // 8-11 chars: 25 pts
        // 12-15 chars: 35 pts
        // 16+ chars: 45 pts
        if (length >= 16) {
            rawScore += 45;
        } else if (length >= 12) {
            rawScore += 35;
        } else if (length >= 8) {
            rawScore += 25;
        } else if (length >= 6) {
            rawScore += 10;
        } else {
            rawScore += 5;
        }

        // Character pool bonus
        if (hasUppercase) rawScore += 15;
        if (hasLowercase) rawScore += 15;
        if (hasNumber) rawScore += 15;
        if (hasSpecial) rawScore += 20;

        // Bonus for length >= 14 combined with all 4 types
        if (length >= 14 && hasUppercase && hasLowercase && hasNumber && hasSpecial) {
            rawScore += 10;
        }

        // Penalty checks:
        // 1. Common dictionary or trivial password patterns
        String lowerPwd = password.toLowerCase();
        for (String pattern : COMMON_PATTERNS) {
            if (lowerPwd.contains(pattern)) {
                rawScore -= 30;
                suggestions.add("Avoid common sequences or dictionary words like '" + pattern + "'.");
                break;
            }
        }

        // 2. Sequential character check (e.g. abc, 123)
        if (hasSequentialChars(password)) {
            rawScore -= 10;
            suggestions.add("Avoid sequential character sequences (e.g., '123' or 'abc').");
        }

        // 3. Repeated identical characters (e.g. 'aaaa', '1111')
        if (hasRepeatedChars(password)) {
            rawScore -= 10;
            suggestions.add("Avoid repeating identical characters consecutively.");
        }

        // If length is very short (< 6), score cannot exceed 20
        if (length < 6) {
            rawScore = Math.min(rawScore, 20);
        } else if (length < 8) {
            rawScore = Math.min(rawScore, 40);
        }

        // Clamp final score between 0 and 100
        int finalScore = Math.max(0, Math.min(100, rawScore));

        // Derive Strength Level from final score
        String strengthLevel;
        if (finalScore < 30) {
            strengthLevel = "Very Weak";
        } else if (finalScore < 50) {
            strengthLevel = "Weak";
        } else if (finalScore < 70) {
            strengthLevel = "Medium";
        } else if (finalScore < 85) {
            strengthLevel = "Strong";
        } else {
            strengthLevel = "Very Strong";
        }

        // Calculate Information Entropy (Shannon entropy heuristic):
        // Pool size N, length L -> Entropy = L * log2(N)
        int poolSize = 0;
        if (hasLowercase) poolSize += 26;
        if (hasUppercase) poolSize += 26;
        if (hasNumber) poolSize += 10;
        if (hasSpecial) poolSize += 32;
        if (poolSize == 0) poolSize = 1;

        double entropyBits = length * (Math.log(poolSize) / Math.log(2));

        // Estimate Crack Time heuristic based on offline hash rate of ~10^10 guesses/sec
        String crackTime = estimateCrackTime(entropyBits);

        // Positive feedback if strong
        if (finalScore >= 85 && suggestions.isEmpty()) {
            suggestions.add("Excellent! This password is very strong and resilient against brute-force attacks.");
        } else if (length >= 8 && length < 12 && !suggestions.contains("Increase length to at least 8 characters (12+ recommended for high security).")) {
            suggestions.add("Pro-tip: Expanding length to 12-16 characters exponentially increases crack time.");
        }

        return new PasswordResult(
            finalScore,
            strengthLevel,
            meetsLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial,
            length,
            entropyBits,
            crackTime,
            suggestions
        );
    }

    private boolean hasSequentialChars(String pwd) {
        if (pwd.length() < 3) return false;
        String s = pwd.toLowerCase();
        for (int i = 0; i < s.length() - 2; i++) {
            char c1 = s.charAt(i);
            char c2 = s.charAt(i + 1);
            char c3 = s.charAt(i + 2);
            if ((c2 == c1 + 1 && c3 == c2 + 1) || (c2 == c1 - 1 && c3 == c2 - 1)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasRepeatedChars(String pwd) {
        if (pwd.length() < 3) return false;
        for (int i = 0; i < pwd.length() - 2; i++) {
            if (pwd.charAt(i) == pwd.charAt(i + 1) && pwd.charAt(i + 1) == pwd.charAt(i + 2)) {
                return true;
            }
        }
        return false;
    }

    private String estimateCrackTime(double entropyBits) {
        if (entropyBits < 28) return "Instant (< 1 millisecond)";
        if (entropyBits < 36) return "Few seconds";
        if (entropyBits < 45) return "Several hours";
        if (entropyBits < 55) return "3 to 6 months";
        if (entropyBits < 65) return "50 to 100 years";
        if (entropyBits < 80) return "10,000+ years";
        return "Millions of years (Cryptographically Robust)";
    }
}
