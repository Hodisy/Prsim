const steps = [
  ["brand", "Brand"],
  ["library", "Layouts"],
  ["assets", "Assets"],
  ["blocks", "Blocs"],
  ["assemblies", "Assemblages"],
  ["scenarios", "Scénarios"],
  ["mcp", "MCP State"],
  ["preview", "Preview"],
];

export function systemPipeline(active) {
  return `
    <nav class="system-pipeline" aria-label="Chaîne de construction PRSIM">
      <span class="pipeline-label">SYSTÈME</span>
      <div class="pipeline-steps">
        ${steps.map(([key, label], index) => `
          ${index ? '<i aria-hidden="true">→</i>' : ""}
          <button type="button" data-view="${key}" class="${active === key ? "active" : ""}">${label}</button>
        `).join("")}
      </div>
      <p><b>Layouts + Assets</b> forment des blocs génériques. Les assemblages les ordonnent et les adaptent aux scénarios.</p>
    </nav>`;
}
