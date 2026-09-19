# Vanilla Architecture & State Management (SPA)

## 1. What is this and how to run it?
This project is a client-side e-commerce catalog application that lists products fetched from the DummyJSON API with support for search, pagination, detail routing, and a 404 page. It is built with **TypeScript** without any external UI frameworks to explore identity-based reconciliation, centralized state management, and SPA client-side routing under the hood.

### Scripts
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript typechecker (strict mode, zero emit)
npm run typecheck

# Build for production
npm run build
```

---

## 2. Architecture & File Responsibilities
* `index.html`: Application shell containing the `#app` container mount point.
* `src/main.ts`: Entry point, event delegates, and router initialization.
* `src/types.ts`: Centralized TypeScript interfaces and discriminated unions for application state.
* `src/store.ts`: Central Single Source of Truth (SSOT) state store.
* `src/router.ts`: Popstate/pushState-based client-side SPA router.
* `src/actions.ts`: Asynchronous actions, side-effects, and fetch orchestration with `AbortController`.
* `src/selectors.ts`: Memoized/derived state helpers (`visibleItems`, `visibleTotal`, `statusText`) using strict pattern matching and exhaustive checks.
* `src/render.ts`: Decoupled layout engine executing shell mounting and content reconciliation via fail-fast DOM queries.
* `src/views/listView.ts`, `src/views/detailView.ts`, `src/views/notFoundView.ts`: Pure view templates returning string markup.
* `src/lib/dom.ts`: Generic type-safe DOM querying helper (`getElement`) ensuring fail-fast runtime element retrieval.
* `src/lib/assertNever.ts`: Exhaustive compile-time check utility for discriminated unions.
* `src/lib/updateList.ts`: Identity-based (DOM `data-id`) list reconciler patching DOM nodes in-place to retain input values and focus ..
* `src/api/products.ts`: API client validating incoming data through Zod schemas into strict DTOs.
* `src/lib/http.ts`: Standardized fetch wrapper throwing strongly typed `HttpError` instances.
* `src/lib/deepFreeze.ts`: Recursive object freeze utility protecting state from unintentional runtime mutations.
* `src/lib/debounce.ts`: Input throttler preventing redundant API dispatches.
* `src/lib/escapeHtml.ts`: Basic XSS sanitization filter for dynamic user input strings.

---

## 3. Decisions Made
* **Decision:** Use `AbortController` for in-flight queries.  
  * *Trade-off:* Added boilerplate over pure debouncing, but completely eliminates race conditions when slow responses arrive late.
* **Decision:** Map-based identity reconciliation using `data-id` instead of full `innerHTML` sweeps.  
  * *Trade-off:* Requires manual DOM nodes bookkeeping, but preserves form input state and browser focus without re-mounting.
* **Decision:** DTO validation via Zod schemas.  
  * *Trade-off:* Extra runtime layer; guarantees compile-time model isolation if the upstream API payload changes .
* **Decision:** Restrict `deepFreeze` execution to the development environment.  
  * *Trade-off:* Small risk of unhandled mutation in production, but avoids recursive CPU overhead on user devices .

---

## 4. Architectural Pain Points
* **Cost of Schema Evolution:** Adding a single attribute (e.g., `rating`) requires coordinated edits across API DTOs, initial template builders, and reconciliation mappers .
* **Implicit Coupling via CSS Selectors:** Selectors (`.cards`, `.status`, `#search`) create invisible contracts between view strings and render orchestration .
* **Lack of Render Bail-out:** Any state transition invokes a complete DOM reconciler pass regardless of whether the actual data payload changed .

---

## 5. Conscious Tech Debt
1. **Detail View Placeholder:** `loadProduct` action and real product API data are not connected yet; `detailView` currently acts as a skeleton displaying only the route ID.
2. **Missing Formatter Setup:** Prettier/code formatter is not configured yet; quotes and indentation inconsistencies remain across files.
3. **Selector Coupling:** Class names like `.status`, `.meta`, and `.cards` tightly couple view templates directly to `render.ts` .
4. **Scattered Pager Logic:** Query URL builders and button representations are partially distributed between view templates and render loops ..
5. **No Store Re-entrancy Protection:** The store does not block `setState` dispatches originating from inside ongoing subscription listeners ..
6. **No Subscription Error Boundary:** Uncaught subscriber errors can disrupt the entire render lifecycle .

---

## 6. Retrospective
* Building the reconciler manually clarifies why Virtual DOM implementations exist: the problem was never about DOM speed, but about managing synchronization complexity without bespoke DOM code.
* Moving to TypeScript early eliminates runtime query regressions (`container.children`, `e.target` typing) directly at compilation phase .