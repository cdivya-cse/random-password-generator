/**
 * PasswordService.java
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Demonstrates:
 * - Service Layer Pattern / Facade Pattern: Coordinates checking and generation.
 * - Separation of Concerns: Keeps business logic independent of HTTP networking.
 * - Dependency Management: Owns and delegates to PasswordChecker and PasswordGenerator.
 */
public class PasswordService {

    private final PasswordChecker checker;
    private final PasswordGenerator generator;

    public PasswordService() {
        this.checker = new PasswordChecker();
        this.generator = new PasswordGenerator();
    }

    /**
     * Analyzes password strength and returns structured analytical results.
     * @param password Password to check.
     * @return Encapsulated PasswordResult.
     */
    public PasswordResult checkPassword(String password) {
        return checker.check(password);
    }

    /**
     * Generates a cryptographically secure random password based on user specifications.
     * @param length Desired length.
     * @param useUpper Include uppercase.
     * @param useLower Include lowercase.
     * @param useNumbers Include numbers.
     * @param useSpecial Include special characters.
     * @return Generated password string.
     */
    public String generatePassword(int length, boolean useUpper, boolean useLower,
                                  boolean useNumbers, boolean useSpecial) {
        return generator.generate(length, useUpper, useLower, useNumbers, useSpecial);
    }

    /**
     * Generates and immediately scores a password for full transparency.
     */
    public PasswordResult generateAndScore(int length, boolean useUpper, boolean useLower,
                                          boolean useNumbers, boolean useSpecial) {
        String generated = generator.generate(length, useUpper, useLower, useNumbers, useSpecial);
        PasswordResult result = checker.check(generated);
        return result;
    }

    public PasswordChecker getChecker() {
        return checker;
    }

    public PasswordGenerator getGenerator() {
        return generator;
    }
}
