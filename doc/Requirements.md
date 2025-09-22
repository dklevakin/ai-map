# Requirements — AI Compass

## 1. Context and Scope
- **Product description:** a static web map of AI services for SMBs, implemented in `index.html` without third-party dependencies.
- **System boundaries:** the site runs fully on the client, has no backend, and only links out to public external resources.
- **Key stakeholders:**
  - Business owners and operations managers who decide which AI tools to adopt.
  - Marketing and product teams selecting tools for specific campaigns.
  - The site maintenance team that updates the catalog and keeps localizations in sync.

## 2. Functional Requirements
### 2.1 Content Structure
1. The system must store categories, subcategories (groups), and services in two localized JSON datasets (`data/ua.json` and `data/en.json`) to keep translations aligned.
2. Every service entry must include a name, short description, and hyperlink to the official resource.
3. Categories and groups must have unique colors/titles to stay visually distinct on the map.
4. Optional metadata such as documentation, code samples, and community links may be stored in `data/resources.json` and merged with services by matching the service name, slug, or official URL.

### 2.2 Map Interactivity
5. After the page loads, the user must see a radial diagram with the “AI Compass” central node.
6. Clicking a category must expand or collapse its related services; clicking again returns it to the default state.
7. Groups inside categories must expand/collapse independently so long lists remain readable.
8. Hovering over a service must provide a visual focus cue (expanded node) without hiding existing cards; clicking must open a persistent detail card with the description and available resource links.
9. The official site and supplemental resources must open from the detail card in new tabs to avoid losing the map context.
10. Icons next to services must reflect the tool type and speed up scanning for the right solution.

### 2.3 Localization and Management
11. Users must be able to switch the interface language between Ukrainian and English; the choice is persisted between sessions via LocalStorage.
12. Core text blocks (banner, hero, notes, footer) must update automatically according to the selected language.
13. Categories and services on the map must respond to keyboard `Enter` and `Space` events to provide basic accessibility, and pressing `Esc` must dismiss an open detail card.
14. The catalog must document manual update instructions for future content editors, including how to maintain the resource metadata file.

### 2.4 Deployment and Documentation
15. The site must open directly from the file system or through any static hosting without a build step.
16. Project documentation must live in the `/doc` folder and be ready for publication via GitHub Pages.
17. Provide cross-links to related documents (ADR, backlog, requirements) to simplify navigation for the team.

## 3. Non-functional Requirements
| ID | Requirement | Type |
| --- | --- | --- |
| NF-1 | The solution must work offline and without a server component. | Reliability / Autonomy |
| NF-2 | `index.html` must be self-contained and avoid external libraries for rendering the map. | Architecture |
| NF-3 | The interface must be readable on screens from 1024px and remain usable on tablets/mobile devices. | Usability |
| NF-4 | All text and data must be stored in UTF-8 to support Ukrainian and English languages. | Compatibility |
| NF-5 | Interaction logic must stay understandable without reading the code thanks to comments and documentation. | Maintainability |
| NF-6 | Catalog expansion must not significantly degrade performance; position calculations run on the client in O(n). | Performance |
| NF-7 | The code must follow accessibility principles: focusable elements, ARIA attributes, and sufficient contrast. | Accessibility |

## 4. Constraints and Assumptions
- The project does not store user data and does not require a privacy policy.
- Users need a modern browser with SVG and LocalStorage support.
- Traffic analytics requires integrating third-party tools (not included in the base version).

## 5. Open Questions
- Is there a need for JSON or Google Sheets import/export of the catalog?
- What is the review process for new services before publication, and who owns it?
- Should we integrate with CRM/Slack to notify stakeholders about catalog updates?
