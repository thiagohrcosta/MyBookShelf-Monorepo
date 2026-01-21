
## 🧠 Project Background & AI-Assisted Development Process
See project instructions in [INSTRUCTION_README.md](INSTRUCTION_README.md).

**21, JANUARY - 2026** <br>
Development started at: 02:30PM <br>
Development finished at: 04:30PM <br>

The development of this project started at **2:30 PM (14:30) on January 21, 2026**, as a practical initiative to design, implement, and document the complete development lifecycle of a modern **API-only application**, applying the best software engineering practices currently adopted by the market.

A central focus of this project was the **strategic use of Artificial Intelligence as an agile development tool**, positioning the author in the role of a **mid-level to senior software engineer**, responsible for guiding how a **junior developer** should proceed throughout the project. This included identifying mistakes, suggesting improvements, enforcing best practices, and continuously steering development decisions toward scalable and maintainable solutions.

This project demonstrates not only technical proficiency in backend development but also how AI can be effectively leveraged to **accelerate project initialization and evolution**, enabling in a matter of hours what traditionally required days or weeks before reaching a testable state.

---

### Initial Setup and Copilot Guidance

The project began with the creation of a detailed **README.md**, containing explicit architectural guidelines, business rules, stack definitions, and development standards. This document served as the primary source of instructions for **GitHub Copilot**, ensuring consistent code generation aligned with the project’s goals.

Once instructed, Copilot proved effective in:

- Creating the initial Rails API-only project structure
- Installing the main gems required by the project
- Executing initial setup commands
- Generating empty or baseline configuration files

This significantly reduced the time required to bootstrap the project from scratch, allowing the use of **project-specific dependencies** rather than relying on generic and poorly adaptable boilerplates.

---

### Limitations, Human Review, and Key Adjustments

Despite its efficiency, Copilot initially overlooked that several gems require **explicit post-installation steps** and complementary dependencies to function correctly.

One concrete example involved environment variable management. When the application failed to access values defined in the `.env` file, Copilot was unable to identify that the root cause was the **absence of the `dotenv` gem**. It was therefore necessary to explicitly instruct Copilot to:

- Add the `dotenv-rails` gem to the `Gemfile`
- Run `bundle install`
- Reload the application environment

Only after these steps was the issue with environment variable loading resolved.

Copilot also showed limitations when dealing with more complex setup scenarios, notably:

- **Devise**, due to:
  - Required generators not being executed automatically
  - API-only configuration nuances
  - JWT authentication flow adjustments
  - The absence of traditional Rails views

- **Active Storage and Cloudinary**, where additional guidance was required to:
  - Properly configure Active Record
  - Establish a correct connection with Cloudinary
  - Ensure compatibility within an API-only context

After careful human review and more precise instructions, Copilot was able to adjust the setup and complete the correct configuration of Devise, environment variables, Active Storage, and Cloudinary.

---

### Authentication Scope in the Initial Version

Although the project requirements explicitly requested **JWT-based authentication**, the initial implementation followed **Devise’s default authentication flow**. As a result, in this first version it was possible to perform **direct CRUD operations without enforcing proper authentication or authorization checks**.

This limitation was intentionally accepted at this stage, as the primary goal of the first development round was to validate:

- Project structure
- Data modeling
- Endpoint availability
- Test coverage
- API documentation

The authentication flow will be **revisited and hardened in the next development iteration**, after a careful analysis of the requirements defined in the README and the actual deliverables produced by the AI in this first phase.

---

### Routing, Testing, and Swagger Documentation

The `routes.rb` file was not generated as expected, likely because routing conventions were not explicitly detailed in the initial README. After providing clear instructions regarding:

- API versioning using `/api/v1`
- RESTful routing standards
- Swagger integration

Copilot successfully created and organized the routing layer.

Once routes and core resources were defined, Copilot was instructed to:

- Create **model tests**
- Create **request tests** for all endpoints
- Edit or create models and controllers as needed to ensure testability

---

### Test Coverage Evolution

Initially, Copilot generated **53 automated tests**, reaching **69% total test coverage**, as measured by the **SimpleCov** report.

After reviewing the coverage report, Copilot was explicitly instructed to:

- Analyze uncovered files
- Add missing tests
- Improve overall test coverage where feasible

Based on these new instructions:

- The test suite increased to **83 tests**
- Overall coverage reached **83.71%**

The remaining uncovered files corresponded to **methods and structures already created but not yet implemented**, indicating that this percentage represents the **maximum achievable coverage at the current stage of development**.

---

### MVP Readiness, Time Investment, and Results

The first AI-assisted development iteration started at **2:30PM** and ended at **4:30PM**, totaling approximately **2 hours of effective development time**.

By **4:30 PM**, starting entirely from scratch, the application had already reached a functional **MVP**, featuring:

- Full CRUD endpoints for all core entities
- User authentication via API (initial Devise-based flow)
- Ability to register and log in users
- Ability to create publishers, authors, and books
- External image storage fully integrated with **Cloudinary**
- **83 automated model and request tests**
- Approximately **83% total test coverage**
- Complete API documentation available via **Swagger**

---

### Final State at This Stage

At the end of this first development phase, the project included:

- All core gems installed and configured
- Database schema correctly modeled according to the README specifications
- All required models and controllers created
- **83 model and request tests**, ensuring high confidence in core API behavior
- Fully documented API via **Swagger**
- External services properly integrated, including **Cloudinary**

---

### General Feedback and Outcome

From a broader perspective, this first development round clearly demonstrates the **impact of AI-assisted software development when combined with precise guidance and continuous human supervision**.

A project of this scope, which would traditionally take **several days or even a full week** to reach a usable and testable state, was successfully brought to a solid **MVP in approximately 2 hours**.

The key factor enabling this acceleration was not AI alone, but rather:

- Well-defined requirements
- Explicit architectural guidance
- Continuous review of generated code
- Immediate correction of mistakes and gaps

This approach made it possible to achieve **exceptional development speed without sacrificing code quality**, resulting in a clean, well-tested, and well-documented MVP.

---

### Project Status and Next Steps

This project is **still under active development**.

The **README.md will continue to be updated** to reflect:
- New development phases
- Architectural refinements
- Security improvements
- CI/CD pipeline implementation
- Code quality and security tooling
- Full JWT authentication and authorization enforcement

Future iterations will build upon this foundation, further strengthening the platform while maintaining the same development standards and AI-assisted workflow.
