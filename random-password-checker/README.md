# SecurePass: Random Password Checker and Generator Using Java OOP

**Engineering Mini-Project:** Object-Oriented Random Password Checker and Generator  
**Technologies:** Java 17+ (OOP Backend), HTML5, CSS3, JavaScript (Frontend), HTTP REST API  
**Server Architecture:** Lightweight `com.sun.net.httpserver.HttpServer` (zero external dependencies)

---

## 1. Project Overview & Architecture

SecurePass is a complete full-stack cybersecurity utility that evaluates password resilience and generates cryptographically secure passwords. 
Unlike typical script-based generators that rely on insecure `Math.random()`, SecurePass uses Java's `java.security.SecureRandom` combined with Fisher-Yates array shuffling and Shannon entropy calculations.

### High-Level Architecture Diagram

```
[ Frontend: Browser / HTML5 + CSS3 + JS ]
          │  ▲
   POST   │  │  JSON Response
          ▼  │
┌────────────────────────────────────────────────────────┐
│  Java Backend HTTP Server (PasswordServer.java : 8085) │
└──────────────────────────┬─────────────────────────────┘
                           │ delegates
                           ▼
┌────────────────────────────────────────────────────────┐
│         PasswordService.java (Facade Layer)            │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  PasswordChecker.java        │ │  PasswordGenerator.java      │
│  - Evaluates rules           │ │  - SecureRandom CSPRNG       │
│  - Calculates Shannon entropy│ │  - Character Category Rules  │
│  - Estimates crack time      │ │  - Fisher-Yates Shuffling    │
│  - Returns PasswordResult    │ └──────────────────────────────┘
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  PasswordRule.java           │
│  <<interface>>               │
│  Polymorphic rule contracts  │
└──────────────────────────────┘
```

---

## 2. Directory Structure

```
random-password-checker/
├── src/
│   ├── PasswordRule.java        # Interface for polymorphic criteria validation
│   ├── PasswordResult.java      # Encapsulated analytical POJO model
│   ├── PasswordChecker.java     # Strength engine, entropy & heuristics
│   ├── PasswordGenerator.java   # SecureRandom generator & Fisher-Yates shuffle
│   ├── PasswordService.java     # Service facade coordinating business operations
│   └── PasswordServer.java      # Built-in Java HTTP Server & REST Controller
├── public/
│   ├── index.html               # Responsive cybersecurity UI
│   ├── style.css                # Glassmorphism dark-navy theme & animations
│   └── script.js                # Fetch API client & live UI synchronization
├── compile-and-run.sh           # Unix/Linux/macOS one-click run script
├── compile-and-run.bat          # Windows one-click run script
├── sample-tests.json            # Viva/demo test suite with inputs & expected outputs
└── README.md                    # Detailed documentation & Viva preparation guide
```

---

## 3. Java OOP Concepts Demonstrated

### A. Encapsulation
- **Implementation in `PasswordResult.java`:**
  All member fields (`score`, `strengthLevel`, `meetsLength`, `entropyBits`, `crackTimeDisplay`, `suggestions`) are declared `private`.
  Access is strictly governed through validated getter and setter methods. For example, `setScore(int score)` clamps input to the valid interval `[0, 100]`.
- **Implementation in `PasswordGenerator.java`:**
  Character sets (`STANDARD_UPPERCASE`, `STANDARD_SPECIAL`) and internal shuffle algorithms are encapsulated. The raw password generation logic prevents unselected charsets from leaking into the output.

### B. Abstraction
- **Implementation in `PasswordChecker.java`:**
  The calling layer only needs to invoke `checker.check(password)`. Complex details—such as regular expression matching, sequential pattern penalties, Shannon information entropy ($L \times \log_2(N)$), and offline hash crack time estimation—are completely hidden from consumers.
- **Implementation in `PasswordService.java`:**
  Acts as an abstraction boundary (Facade) between the HTTP transport layer (`PasswordServer`) and the core business logic.

### C. Polymorphism & Interfaces
- **Implementation in `PasswordRule.java`:**
  Defines a uniform contract:
  ```java
  public interface PasswordRule {
      boolean evaluate(String password);
      String getSuggestion();
      String getRuleName();
      int getScoreWeight();
  }
  ```
  `PasswordChecker` registers multiple polymorphic rules (`LengthRule`, `UppercaseRule`, `LowercaseRule`, `NumberRule`, `SpecialCharRule`). During evaluation, the checker iterates over the `List<PasswordRule>` polymorphically without needing `instanceof` or manual type casting.

### D. Single Responsibility Principle (SRP)
- `PasswordChecker`: Focuses solely on assessing password strength and computing metrics.
- `PasswordGenerator`: Focuses solely on generating cryptographically sound random characters.
- `PasswordResult`: Serves as an immutable data transport container with zero networking code.
- `PasswordServer`: Handles network sockets, HTTP verbs, CORS headers, and JSON serialization.

---

## 4. How the Frontend Connects to the Java Backend

1. **User Types a Password** or clicks **"Analyze Password"**.
2. JavaScript's `fetch('/api/check-password', { method: 'POST', body: JSON.stringify({ password }) })` triggers an HTTP request.
3. `PasswordServer.java` receives the HTTP POST on `/api/check-password`, extracts the JSON payload, and passes it to `PasswordService`.
4. `PasswordChecker` evaluates the password across all criteria and returns a `PasswordResult`.
5. `PasswordResult.toJson()` serializes the result into JSON:
   ```json
   {
     "score": 85,
     "strengthLevel": "Strong",
     "meetsLength": true,
     "hasUppercase": true,
     "hasLowercase": true,
     "hasNumber": true,
     "hasSpecial": true,
     "length": 14,
     "entropyBits": 78.4,
     "crackTimeDisplay": "10,000+ years",
     "suggestions": [
       "Pro-tip: Expanding length to 16+ characters exponentially increases crack time."
     ]
   }
   ```
6. The frontend JavaScript parses the JSON response and updates the strength meter, score pill, requirement checkboxes, and suggestions dynamically.

---

## 5. Step-by-Step Instructions to Run in VS Code

### Prerequisites
- Java JDK 11, 17, or 21 installed (`java -version` and `javac -version`).
- Visual Studio Code with the **Extension Pack for Java** (optional, but recommended).

### Running via Terminal
1. Open terminal inside `random-password-checker/`:
   ```bash
   # Compile all Java files into a bin directory
   mkdir -p bin
   javac -d bin src/*.java

   # Run the server on port 8085
   java -cp bin PasswordServer 8085
   ```
2. Open another terminal or use a static file server to serve the `public/` directory:
   ```bash
   # Option A: Using Python built-in server
   cd public
   python3 -m http.server 3000

   # Option B: Using Node http-server or Live Server extension in VS Code
   npx serve public -p 3000
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 6. Sample Inputs and Expected Results (College Viva & Testing)

| Test Case | Sample Input Password | Expected Score | Expected Level | Key Evaluation Details |
|---|---|---|---|---|
| **1. Trivial Sequence** | `123456` | 10 / 100 | Very Weak | Penalized for common pattern, short length, missing letters & symbols. |
| **2. Dictionary Word** | `password` | 20 / 100 | Very Weak | Length 8 met, but heavy deduction for common dictionary word. |
| **3. Common Corporate** | `Admin123` | 45 / 100 | Weak | Contains upper, lower, numbers, but length is 8 and lacks special symbols. |
| **4. Good Mixed Password** | `K9#mQ2$vP8` | 75 / 100 | Strong | 10 chars, all 4 character pools met, entropy ~65 bits. |
| **5. Robust Password** | `G7!mX9#vL2$qR8@z` | 100 / 100 | Very Strong | 16 chars, complex distribution, crack time heuristic: Millions of years. |

---

## 7. Common Errors & Solutions

1. **`javac: command not found`**  
   *Cause:* Java Development Kit (JDK) is not installed or not added to your system `PATH`.  
   *Solution:* Install OpenJDK 17 (`sudo apt install openjdk-17-jdk` on Linux or download from Adoptium.net for Windows/macOS), then configure `JAVA_HOME`.

2. **`Address already in use: bind`**  
   *Cause:* Port 8085 or 3000 is occupied by another process.  
   *Solution:* Kill existing process (`lsof -i :8085` then `kill -9 <PID>`) or pass a custom port: `java -cp bin PasswordServer 9000`.

3. **CORS Error in Browser Console**  
   *Cause:* Frontend served from one port and Java server on another without CORS headers.  
   *Solution:* `PasswordServer.java` is pre-configured with `Access-Control-Allow-Origin: *` to prevent CORS issues.
