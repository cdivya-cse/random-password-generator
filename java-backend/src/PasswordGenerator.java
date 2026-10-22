import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * PasswordGenerator.java
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Demonstrates:
 * - Security Best Practices: Uses java.security.SecureRandom instead of Math.random().
 * - OOP Encapsulation: Character sets and generator logic are encapsulated in private constants and methods.
 * - Input Validation & Defensive Programming: Prevents invalid lengths and zero-category selections.
 */
public class PasswordGenerator {

    // Cryptographically strong random number generator
    private final SecureRandom random;

    // Character pools
    public static final String UPPERCASE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluded ambiguous chars if desired, but standard:
    public static final String STANDARD_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static final String STANDARD_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    public static final String STANDARD_NUMBERS = "0123456789";
    public static final String STANDARD_SPECIAL = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    public PasswordGenerator() {
        this.random = new SecureRandom();
    }

    /**
     * Generates a secure random password adhering to user constraints.
     * Guarantees at least one character from each selected category when length permits.
     * 
     * @param length Desired length (clamped between 8 and 32).
     * @param useUpper Include uppercase letters (A-Z).
     * @param useLower Include lowercase letters (a-z).
     * @param useNumbers Include numbers (0-9).
     * @param useSpecial Include special symbols (!@#$...).
     * @return Generated secure password string.
     * @throws IllegalArgumentException if no character category is selected.
     */
    public String generate(int length, boolean useUpper, boolean useLower,
                           boolean useNumbers, boolean useSpecial) {
        // Enforce valid length constraints
        if (length < 8) {
            length = 8;
        } else if (length > 32) {
            length = 32;
        }

        // Validate that at least one character category is selected
        if (!useUpper && !useLower && !useNumbers && !useSpecial) {
            throw new IllegalArgumentException("At least one character category must be selected.");
        }

        List<Character> passwordChars = new ArrayList<>(length);
        StringBuilder combinedPool = new StringBuilder();

        // 1. Mandatory inclusion: Add 1 guaranteed character from each chosen category
        if (useUpper) {
            passwordChars.add(getRandomChar(STANDARD_UPPERCASE));
            combinedPool.append(STANDARD_UPPERCASE);
        }
        if (useLower) {
            passwordChars.add(getRandomChar(STANDARD_LOWERCASE));
            combinedPool.append(STANDARD_LOWERCASE);
        }
        if (useNumbers) {
            passwordChars.add(getRandomChar(STANDARD_NUMBERS));
            combinedPool.append(STANDARD_NUMBERS);
        }
        if (useSpecial) {
            passwordChars.add(getRandomChar(STANDARD_SPECIAL));
            combinedPool.append(STANDARD_SPECIAL);
        }

        String pool = combinedPool.toString();

        // 2. Fill remaining characters uniformly from the combined pool
        while (passwordChars.size() < length) {
            passwordChars.add(getRandomChar(pool));
        }

        // 3. Perform Fisher-Yates shuffle using SecureRandom
        // This ensures the guaranteed characters are distributed randomly rather than grouped at the start
        shuffleList(passwordChars);

        // Convert list to String
        StringBuilder result = new StringBuilder(length);
        for (char c : passwordChars) {
            result.append(c);
        }

        return result.toString();
    }

    /**
     * Selects a single character uniformly at random from the candidate pool using SecureRandom.
     */
    private char getRandomChar(String charset) {
        int index = random.nextInt(charset.length());
        return charset.charAt(index);
    }

    /**
     * Fisher-Yates in-place shuffle backed by SecureRandom.
     */
    private void shuffleList(List<Character> list) {
        for (int i = list.size() - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            Character temp = list.get(i);
            list.set(i, list.get(j));
            list.set(j, temp);
        }
    }
}
