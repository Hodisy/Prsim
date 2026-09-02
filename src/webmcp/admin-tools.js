const objectSchema = (properties = {}, required = []) => ({ type: "object", properties, required, additionalProperties: false });
const stringEnum = (values, description = "") => ({ type: "string", enum: values, description });
const result = (data) => ({ content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data });

export const studioDestinations = Object.freeze(["foundation", "brand", "library", "assets", "blocks", "assemblies", "scenarios", "mcp", "preview"]);

export const adminToolsByPage = Object.freeze({
  foundation: ["get_prsim_studio_state", "navigate_prsim_studio"],
  brand: ["get_prsim_studio_state", "navigate_prsim_studio", "update_prsim_brand"],
  library: ["get_prsim_studio_state", "navigate_prsim_studio"],
  assets: ["get_prsim_studio_state", "navigate_prsim_studio", "filter_prsim_assets"],
  blocks: ["get_prsim_studio_state", "navigate_prsim_studio"],
  assemblies: ["get_prsim_studio_state", "navigate_prsim_studio", "select_prsim_assembly", "duplicate_prsim_assembly"],
  scenarios: ["get_prsim_studio_state", "navigate_prsim_studio", "select_prsim_scenario", "browse_prsim_scenarios", "reset_prsim_scenario"],
  mcp: ["get_prsim_studio_state", "navigate_prsim_studio"],
});

export const adminStudioToolGroups = Object.freeze([{
  protocol: "PRSIM STUDIO",
  label: "Actions des écrans existants",
  tools: [
    ["get_prsim_studio_state", "lit l’écran et ses sélections"],
    ["navigate_prsim_studio", "navigue entre les écrans"],
    ["update_prsim_brand", "édite la Brand"],
    ["filter_prsim_assets", "filtre le registre Assets"],
    ["select_prsim_assembly", "sélectionne un assemblage"],
    ["duplicate_prsim_assembly", "duplique l’assemblage sélectionné"],
    ["select_prsim_scenario", "sélectionne un scénario dans Preview"],
    ["browse_prsim_scenarios", "parcourt les scénarios existants"],
    ["reset_prsim_scenario", "revient au site classique"],
  ].map(([name, effect]) => ({ name, effect })),
}]);

function registerTools(tools, scope) {
  window.prsimTools = Object.fromEntries(tools.map((tool) => [tool.name, (args = {}) => tool.execute(args).structuredContent]));
  document.documentElement.dataset.webmcpScope = scope;
  if (!document.modelContext?.registerTool) {
    document.documentElement.dataset.webmcp = "fallback";
    return { supported: false, scope, tools: tools.map((tool) => tool.name) };
  }
  const controller = new AbortController();
  Promise.all(tools.map((tool) => document.modelContext.registerTool(tool, { signal: controller.signal })))
    .then(() => { document.documentElement.dataset.webmcp = "ready"; })
    .catch((error) => { if (error?.name !== "AbortError") console.warn("PRSIM Studio WebMCP registration failed", error); });
  return { supported: true, scope, tools: tools.map((tool) => tool.name), controller };
}

export function registerPrsimAdminGateway(callbacks = {}) {
  return registerTools([{
    name: "open_prsim_studio",
    description: "Open an existing PRSIM administrative screen. This action only navigates and does not modify storefront data.",
    inputSchema: objectSchema({
      destination: stringEnum(studioDestinations),
      target_id: { type: "string", description: "Optional existing scenario or assembly key to select." },
    }, ["destination"]),
    execute: ({ destination, target_id }) => result(callbacks.onOpenStudio?.({ destination, target_id }) || { opened: false }),
  }], "admin_gateway:preview");
}

export function registerPrsimStudioTools(page, callbacks = {}) {
  const tools = [
    {
      name: "get_prsim_studio_state",
      description: "Read the active PRSIM Studio screen and its current filters and selections.",
      inputSchema: objectSchema(),
      execute: () => result(callbacks.getStudioState?.() || {}),
    },
    {
      name: "navigate_prsim_studio",
      description: "Navigate to an existing PRSIM Studio screen without changing data.",
      inputSchema: objectSchema({ destination: stringEnum(studioDestinations), target_id: { type: "string" } }, ["destination"]),
      execute: ({ destination, target_id }) => result(callbacks.onNavigate?.({ destination, target_id }) || { navigated: false }),
    },
    {
      name: "update_prsim_brand",
      description: "Apply the same Brand fields available in the existing Brand editor.",
      inputSchema: objectSchema({ name: { type: "string" }, ink: { type: "string" }, paper: { type: "string" }, review: { type: "string" }, trust: { type: "string" }, title_font: stringEnum(["georgia", "times", "helvetica", "system"]) }),
      execute: (patch) => result(callbacks.onUpdateBrand?.(patch) || { updated: false }),
    },
    {
      name: "filter_prsim_assets",
      description: "Apply the filters already available in the Assets screen.",
      inputSchema: objectSchema({ family: stringEnum(["images", "reviews"]), type: stringEnum(["all", "product", "context", "editorial", "material", "icon", "sketch"]), color: stringEnum(["all", "black", "cream", "liberty-blue", "liberty-burgundy", "unspecified"]), review_source: { type: "string" } }),
      execute: (filters) => result(callbacks.onFilterAssets?.(filters) || { filtered: false }),
    },
    {
      name: "select_prsim_assembly",
      description: "Select an existing assembly in the Assemblies inspector.",
      inputSchema: objectSchema({ assembly_key: { type: "string" } }, ["assembly_key"]),
      execute: ({ assembly_key }) => result(callbacks.onSelectAssembly?.({ assembly_key }) || { selected: false }),
    },
    {
      name: "duplicate_prsim_assembly",
      description: "Run the existing new-assembly-from-selection action.",
      inputSchema: objectSchema({ source_key: { type: "string" }, label: { type: "string" } }),
      execute: ({ source_key, label }) => result(callbacks.onDuplicateAssembly?.({ source_key, label }) || { created: false }),
    },
    {
      name: "select_prsim_scenario",
      description: "Select an existing scenario and make it active in Preview, exactly like the Scenarios list.",
      inputSchema: objectSchema({ scenario_key: { type: "string" } }, ["scenario_key"]),
      execute: ({ scenario_key }) => result(callbacks.onSelectScenario?.({ scenario_key }) || { selected: false }),
    },
    {
      name: "browse_prsim_scenarios",
      description: "Move through the existing scenario list or select a random scenario.",
      inputSchema: objectSchema({ direction: stringEnum(["previous", "next", "random"]) }, ["direction"]),
      execute: ({ direction }) => result(callbacks.onBrowseScenarios?.({ direction }) || { selected: false }),
    },
    {
      name: "reset_prsim_scenario",
      description: "Run the existing Scenarios reset action and return Preview to the classic storefront.",
      inputSchema: objectSchema({ preserve_product_choices: { type: "boolean", default: false } }),
      execute: ({ preserve_product_choices = false } = {}) => result(callbacks.onResetScenario?.({ preserve_product_choices }) || { reset: false }),
    },
  ];
  const allowed = new Set(adminToolsByPage[page] || adminToolsByPage.foundation);
  return registerTools(tools.filter((tool) => allowed.has(tool.name)), `admin_studio:${page}`);
}
