/**
 * PasswordRule.java
 * 
 * Part of: SecurePass - Random Password Checker and Generator
 * Demonstrates: OOP Abstraction & Polymorphism
 * 
 * Defines the contract for an individual password validation rule.
 * Concrete implementations represent specific criteria (Length, Uppercase, etc.)
 */
public interface PasswordRule {
    /**
     * Evaluates whether the given password satisfies this rule.
     * @param password The password string to test.
     * @return true if valid, false otherwise.
     */
    boolean evaluate(String password);

    /**
     * Provides an actionable suggestion to help the user satisfy this rule.
     * @return Improvement suggestion string.
     */
    String getSuggestion();

    /**
     * Human-readable name of the requirement rule.
     * @return Rule title.
     */
    String getRuleName();

    /**
     * Weight of this rule in the final 0-100 score calculation.
     * @return Score weight (points).
     */
    int getScoreWeight();
}
