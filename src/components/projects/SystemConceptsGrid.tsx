"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  Layers,
  Minimize2,
  ListChecks,
  FileText,
  GitCommit,
  Bot,
  Zap,
  Network,
  Terminal,
  GitBranch,
  Puzzle,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";

export interface ConceptItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  accentColor: string;
  description: string;
  details: {
    overview: string;
    mechanism: string;
    metrics: { label: string; value: string }[];
    steps: string[];
    exampleCode?: string;
  };
}

const CONCEPTS: ConceptItem[] = [
  {
    id: "spec",
    number: "01",
    title: "Core Spec / Rules",
    subtitle: "Read every session",
    tag: "CONFIG",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    accentColor: "#60A5FA",
    description:
      "Strict instructions and constraint schemas enforced automatically across all execution steps.",
    details: {
      overview:
        "Every session begins by loading a master specification file that defines system boundaries, allowed operations, and security constraints. No action proceeds without passing schema validation — guaranteeing fully deterministic, auditable behavior.",
      mechanism:
        "The spec file is parsed at initialization, converted into a runtime rule-set, and injected into every tool call's validation layer. Any input or output that violates the schema is rejected before execution.",
      metrics: [
        { label: "Schema Validation", value: "100%" },
        { label: "Rule Enforcement", value: "Every Call" },
        { label: "Unchecked Inputs", value: "Zero" },
      ],
      steps: [
        "RULE_SPEC.md loaded on agent initialization",
        "Schema constraints compiled into runtime validators",
        "Each tool call pre-validated against active ruleset",
        "Violations rejected with structured error reports",
      ],
      exampleCode: `// System Rule Enforcement
validateSessionRules(sessionConfig);
enforceSecurityBoundary(userScope);`,
    },
  },
  {
    id: "context",
    number: "02",
    title: "Context Window",
    subtitle: "Everything at once",
    tag: "MEMORY",
    tagColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    accentColor: "#A78BFA",
    description:
      "Dynamic memory pipeline maintaining full situational awareness across multi-turn workflows.",
    details: {
      overview:
        "A 200,000-token active context window keeps the full conversation history, file contents, tool outputs, and system state simultaneously accessible. This eliminates back-and-forth disambiguation and enables coherent, long-horizon reasoning.",
      mechanism:
        "Sliding attention windows dynamically prioritize recent interactions and semantically relevant past turns. Vector-indexed memory buckets allow sub-20ms retrieval of any context segment.",
      metrics: [
        { label: "Context Window", value: "200k Tokens" },
        { label: "Retrieval Speed", value: "<20ms" },
        { label: "Attention Precision", value: "High" },
      ],
      steps: [
        "Full conversation + tool output stored in active context",
        "Sliding attention window prioritizes relevant segments",
        "Vector index enables instant semantic lookup",
        "Context size monitored to trigger compaction if needed",
      ],
      exampleCode: `const activeMemory = await vectorStore.query({
  vector: currentQueryVector,
  topK: 10
});`,
    },
  },
  {
    id: "compaction",
    number: "03",
    title: "Data Compaction",
    subtitle: "Old turns → dense summary",
    tag: "OPTIMIZE",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    accentColor: "#34D399",
    description:
      "Lossless state compression algorithm reducing 100k history tokens into 10k dense summaries.",
    details: {
      overview:
        "When sessions grow long, raw history is compressed using semantic summarization. 100,000 tokens of conversation history are distilled into a 10,000-token dense state summary — preserving all critical facts, decisions, and context without exceeding memory limits.",
      mechanism:
        "Earlier turns are segmented into semantic chunks, each summarized by a specialized compaction model. The resulting compressed vectors replace the raw token stream while retaining full factual fidelity.",
      metrics: [
        { label: "Compression Ratio", value: "10:1" },
        { label: "Token Savings", value: "90%" },
        { label: "Semantic Loss", value: "Zero" },
      ],
      steps: [
        "Context monitor detects approaching token limit",
        "Earlier turns segmented into semantic units",
        "Each unit compressed into dense summary vectors",
        "Compressed state replaces raw history transparently",
      ],
      exampleCode: `const compressedContext = await compactHistory({
  rawTurns: historyBuffer,
  targetTokens: 10000
});`,
    },
  },
  {
    id: "plan",
    number: "04",
    title: "Plan Mode",
    subtitle: "Propose before act",
    tag: "STRATEGY",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    accentColor: "#FBBF24",
    description:
      "Pre-execution plan generator that outlines step-by-step changes before applying any modifications.",
    details: {
      overview:
        "Before any architectural change, database migration, or multi-file refactor, Plan Mode generates a structured implementation document. Users review every proposed step, approve it, and only then does execution begin.",
      mechanism:
        "Generates an immutable execution plan, audits predicted side-effects, and awaits explicit human validation. No writes or mutations occur during the planning phase.",
      metrics: [
        { label: "Dry-Run Verified", value: "100%" },
        { label: "Accidental Writes", value: "Zero" },
        { label: "Approval Model", value: "Human-in-Loop" },
      ],
      steps: [
        "User intent analyzed for complexity threshold",
        "Implementation plan generated with scoped file changes",
        "Side-effect audit and risk assessment attached",
        "User approves → execution begins; rejects → plan revised",
      ],
      exampleCode: `const plan = await generatePlan(userIntent);
if (await userApproves(plan)) {
  executePlan(plan);
}`,
    },
  },
  {
    id: "artifacts",
    number: "05",
    title: "Artifacts Engine",
    subtitle: "Publish structured output",
    tag: "OUTPUT",
    tagColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    accentColor: "#38BDF8",
    description:
      "Self-contained renderable document & code generator producing structured, persistent outputs.",
    details: {
      overview:
        "Every plan, walkthrough, report, and code diff is rendered as a live, interactive artifact. Artifacts persist across sessions, support versioned updates, and can embed images, diagrams, tables, and carousels.",
      mechanism:
        "Streams structured markdown, GFM, and code blocks into an isolated sandbox renderer. Artifact metadata (type, summary, feedback flag) drives UI presentation automatically.",
      metrics: [
        { label: "Live Preview", value: "Instant" },
        { label: "Sandbox", value: "Isolated" },
        { label: "Formats", value: "MD · GFM · Code" },
      ],
      steps: [
        "Artifact type classified (plan / walkthrough / task / other)",
        "Content streamed into isolated sandbox renderer",
        "Metadata drives UI chrome and feedback prompts",
        "Artifacts versioned and updatable across session",
      ],
      exampleCode: `<ArtifactViewer
  type="implementation_plan"
  content={artifactContent}
/>`,
    },
  },
  {
    id: "hooks",
    number: "06",
    title: "Event Hooks",
    subtitle: "Auto-run on triggers",
    tag: "AUTOMATION",
    tagColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    accentColor: "#FB7185",
    description:
      "Automated event pipeline executing validation triggers: format → lint → automated test suite.",
    details: {
      overview:
        "Event hooks fire automatically on specific system events — post-edit, post-build, pre-commit — running formatters, linters, and test suites without any manual intervention. Quality is enforced, not requested.",
      mechanism:
        "Subscribers register handler functions against named event channels. Events are dispatched on filesystem changes or API call completions, triggering the full quality pipeline.",
      metrics: [
        { label: "Formatting", value: "Automated" },
        { label: "Syntax Errors", value: "Zero Shipped" },
        { label: "CI Integration", value: "Native" },
      ],
      steps: [
        "Event channels defined per lifecycle stage",
        "Handlers subscribed: format → lint → test",
        "File change or API call dispatches event",
        "Quality pipeline runs asynchronously in background",
      ],
      exampleCode: `onEvent("post-build", async () => {
  await runFormatter();
  await runLinter();
  await runTests();
});`,
    },
  },
  {
    id: "subagents",
    number: "07",
    title: "Subagents & Workers",
    subtitle: "Parallel isolated agents",
    tag: "CONCURRENCY",
    tagColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    accentColor: "#2DD4BF",
    description:
      "Isolated background subagents operating concurrently with delegated tasks and dedicated toolsets.",
    details: {
      overview:
        "Heavy tasks — database research, multi-file analysis, documentation generation — are delegated to isolated subagents running in parallel. The primary agent continues other work and receives results when subagents report back.",
      mechanism:
        "Spawns independent worker threads with isolated scopes and dedicated tool access. Subagents communicate via a message-passing inbox system, never sharing mutable state with peers.",
      metrics: [
        { label: "Execution", value: "Parallel" },
        { label: "Contexts", value: "Fully Isolated" },
        { label: "Architecture", value: "Non-Blocking" },
      ],
      steps: [
        "Task analyzed for parallelization eligibility",
        "Subagent spawned with scoped tools and isolated context",
        "Primary agent continues other work concurrently",
        "Result delivered to inbox on subagent completion",
      ],
      exampleCode: `const researchWorker = await spawnSubagent({
  role: "Database Researcher",
  prompt: "Analyze query indexing bottlenecks"
});`,
    },
  },
  {
    id: "skills",
    number: "08",
    title: "Skills Engine",
    subtitle: "Domain modules on demand",
    tag: "MODULES",
    tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    accentColor: "#22D3EE",
    description:
      "Dynamic skill library loading specialized tools, domain knowledge, and scripts on demand.",
    details: {
      overview:
        "Skills are self-contained capability modules — from AlphaFold protein analysis to ChEMBL drug queries — loaded lazily only when relevant. The core agent stays lean; domain power is summoned on need.",
      mechanism:
        "Skill descriptors (SKILL.md) are parsed at runtime. Helper scripts, API schemas, and domain-specific tools are loaded into the active session scope only when the skill is triggered.",
      metrics: [
        { label: "Loading", value: "On-Demand" },
        { label: "Bundle Bloat", value: "Zero" },
        { label: "Plugin API", value: "Extensible" },
      ],
      steps: [
        "User intent triggers skill relevance check",
        "Matching SKILL.md descriptor parsed and validated",
        "Helper scripts and API schemas loaded into scope",
        "Skill executes with full domain-specific capabilities",
      ],
      exampleCode: `const chemblSkill = await loadSkill("chembl-database");
const result = await chemblSkill.query(compoundId);`,
    },
  },
  {
    id: "mcp",
    number: "09",
    title: "MCP Data Bridges",
    subtitle: "Host → Server → Live Data",
    tag: "INTEGRATION",
    tagColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    accentColor: "#818CF8",
    description:
      "Model Context Protocol bridges connecting host applications to external APIs, databases, and web services.",
    details: {
      overview:
        "MCP is the standardized protocol for connecting the AI host to any external data source — Gemini API docs, Firebase, Google Maps, cloud databases — with zero custom integration code per source.",
      mechanism:
        "Establishes authenticated RPC channels over HTTP/JSON-RPC. Each MCP server exposes a tool schema; the agent calls tools directly as if they were native, while the bridge handles auth, rate limiting, and data serialization.",
      metrics: [
        { label: "Protocol", value: "Secure RPC" },
        { label: "Streaming", value: "Real-Time" },
        { label: "Network", value: "Multi-Server" },
      ],
      steps: [
        "MCP server registered with tool schema and auth config",
        "Agent discovers available tools from server manifest",
        "Tool calls routed over authenticated JSON-RPC channel",
        "Response deserialized and injected into agent context",
      ],
      exampleCode: `const mcpClient = new MCPClient("gemini-api-docs");
const docs = await mcpClient.searchDocs("RateLimitError");`,
    },
  },
  {
    id: "commands",
    number: "10",
    title: "CLI Commands",
    subtitle: "One slash, full workflow",
    tag: "INTERFACE",
    tagColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    accentColor: "#FB923C",
    description:
      "Interactive terminal command interface powering rapid shortcut execution and workflow triggering.",
    details: {
      overview:
        "Slash commands (/goal, /schedule, /browser, /grill-me) give power users instant shortcuts to complex workflows. A single command triggers multi-step automation that would otherwise require dozens of manual instructions.",
      mechanism:
        "The CLI parser maps slash command strings to high-level automation triggers, resolving parameters and dispatching the appropriate workflow graph with no intermediate user input required.",
      metrics: [
        { label: "Trigger Latency", value: "Instant" },
        { label: "Emulation", value: "Terminal" },
        { label: "Commands", value: "Slash-Based" },
      ],
      steps: [
        "User types /command in chat input",
        "Parser tokenizes and resolves command + parameters",
        "Workflow graph constructed and dispatched",
        "Agent executes full workflow autonomously",
      ],
      exampleCode: `executeCommand(
  "/schedule --cron '*/5 * * * *' --prompt 'Check deployment'"
);`,
    },
  },
  {
    id: "worktrees",
    number: "11",
    title: "Parallel Worktrees",
    subtitle: "Parallel branches, zero collisions",
    tag: "GIT",
    tagColor: "bg-green-500/15 text-green-400 border-green-500/30",
    accentColor: "#4ADE80",
    description:
      "Isolated git worktrees allowing simultaneous execution of feature, bugfix, and docs tasks without collision.",
    details: {
      overview:
        "Multiple development streams run in parallel without branch collisions. Feature development, hotfixes, and documentation updates each get an isolated worktree — all sharing the same repository without interference.",
      mechanism:
        "Git worktrees provide lightweight filesystem-level branch isolation. Each worktree has an independent working directory and HEAD, allowing fully concurrent editing without checkout conflicts.",
      metrics: [
        { label: "Branch Collisions", value: "Zero" },
        { label: "Worktree Creation", value: "Instant" },
        { label: "Execution", value: "Parallel" },
      ],
      steps: [
        "Task triaged: feature / fix / docs / experiment",
        "Dedicated worktree created from base branch",
        "Subagent executes task in isolated directory",
        "Results merged cleanly with no conflict risk",
      ],
      exampleCode: `git worktree add -b feat/ml-pipeline ./worktree-ml`,
    },
  },
  {
    id: "plugins",
    number: "12",
    title: "Plugin Architecture",
    subtitle: "One install, many capabilities",
    tag: "EXTENSIBILITY",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    accentColor: "#F472B6",
    description:
      "Modular plugin manager enabling one-install expansion of domain skills, subagents, and tools.",
    details: {
      overview:
        "Plugins bundle related skills, subagents, and configuration into a single deployable unit. Installing a plugin — like the Science plugin — instantly makes dozens of specialized tools and agents available without any manual wiring.",
      mechanism:
        "Plugin descriptors (plugin.json) register skill paths, agent definitions, and MCP server configs. The plugin loader resolves all dependencies, registers capabilities, and manages lifecycle hooks on startup.",
      metrics: [
        { label: "Installation", value: "1-Click" },
        { label: "Architecture", value: "Decoupled" },
        { label: "Lifecycle", value: "Managed" },
      ],
      steps: [
        "plugin.json descriptor defines skills, agents, and tools",
        "Plugin loader resolves and validates all dependencies",
        "Capabilities registered into active session scope",
        "Plugin lifecycle hooks manage start / stop / update",
      ],
      exampleCode: `pluginManager.registerPlugin({
  name: "science-toolkit",
  skills: [alphafoldSkill, pubchemSkill]
});`,
    },
  },
];

const getIcon = (id: string, size = "w-5 h-5") => {
  const props = { className: size };
  switch (id) {
    case "spec": return <FileCode {...props} />;
    case "context": return <Layers {...props} />;
    case "compaction": return <Minimize2 {...props} />;
    case "plan": return <ListChecks {...props} />;
    case "artifacts": return <FileText {...props} />;
    case "hooks": return <GitCommit {...props} />;
    case "subagents": return <Bot {...props} />;
    case "skills": return <Zap {...props} />;
    case "mcp": return <Network {...props} />;
    case "commands": return <Terminal {...props} />;
    case "worktrees": return <GitBranch {...props} />;
    case "plugins": return <Puzzle {...props} />;
    default: return <Circle {...props} />;
  }
};

export function SystemConceptsGrid({ concepts = CONCEPTS }: { concepts?: ConceptItem[] }) {
  const [activeId, setActiveId] = useState<string>(concepts[0].id);

  const active = concepts.find((c) => c.id === activeId)!;

  return (
    <div className="w-full font-sans">
      {/* Intro line */}
      <p className="text-sm text-gray-400 font-light leading-relaxed mb-8 max-w-2xl">
        12 core operational methods powering this system — each independently
        interactive. Select any topic to explore its full technical anatomy.
      </p>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">

        {/* ─── LEFT: Topic List ─────────────────────────────── */}
        <div className="lg:w-[280px] shrink-0">
          <div className="space-y-1">
            {concepts.map((concept) => {
              const isActive = concept.id === activeId;
              return (
                <button
                  key={concept.id}
                  onClick={() => setActiveId(concept.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group border ${
                    isActive
                      ? "bg-white/[0.07] border-white/[0.14] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/[0.07]"
                  }`}
                >
                  {/* Number */}
                  <span
                    className="text-[11px] font-mono font-bold shrink-0 w-6 text-center transition-colors"
                    style={{ color: isActive ? active.accentColor : "#6B7280" }}
                  >
                    {concept.number}
                  </span>

                  {/* Icon */}
                  <span
                    className="shrink-0 transition-colors"
                    style={{ color: isActive ? concept.accentColor : "#4B5563" }}
                  >
                    {getIcon(concept.id, "w-4 h-4")}
                  </span>

                  {/* Title */}
                  <span
                    className={`text-sm font-medium leading-tight transition-colors flex-1 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                    }`}
                  >
                    {concept.title}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <ChevronRight
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: active.accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── RIGHT: Detail Panel ──────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.1] bg-[#0d0d0e] overflow-hidden"
            >
              {/* Panel Header */}
              <div
                className="px-6 py-5 border-b border-white/[0.07] flex items-start gap-4"
                style={{
                  background: `linear-gradient(135deg, ${active.accentColor}08 0%, transparent 60%)`,
                }}
              >
                <div
                  className="p-3 rounded-xl border shrink-0 mt-0.5"
                  style={{
                    background: `${active.accentColor}12`,
                    borderColor: `${active.accentColor}30`,
                  }}
                >
                  <span style={{ color: active.accentColor }}>
                    {getIcon(active.id, "w-5 h-5")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-gray-500">
                      {active.number} /
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {active.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${active.tagColor}`}
                    >
                      {active.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-light">{active.subtitle}</p>
                </div>
              </div>

              {/* Panel Body */}
              <div className="px-6 py-6 space-y-6">

                {/* Overview */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                    Overview
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {active.details.overview}
                  </p>
                </div>

                {/* How It Works */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                    How It Works
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {active.details.mechanism}
                  </p>
                </div>

                {/* Step-by-Step Flow */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                    Execution Flow
                  </h4>
                  <div className="space-y-2 mt-1">
                    {active.details.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-[10px] font-mono font-bold border"
                          style={{
                            background: `${active.accentColor}15`,
                            borderColor: `${active.accentColor}40`,
                            color: active.accentColor,
                          }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-300 font-light leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                    Specifications
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {active.details.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-xl px-4 py-3 border text-center"
                        style={{
                          background: `${active.accentColor}08`,
                          borderColor: `${active.accentColor}25`,
                        }}
                      >
                        <div
                          className="text-sm font-bold font-mono mb-0.5"
                          style={{ color: active.accentColor }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[10px] text-gray-500 font-light">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Example */}
                {active.details.exampleCode && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      Implementation Reference
                    </h4>
                    <div
                      className="rounded-xl p-4 border font-mono text-[12px] leading-relaxed overflow-x-auto"
                      style={{
                        background: "#070708",
                        borderColor: `${active.accentColor}20`,
                        color: active.accentColor,
                      }}
                    >
                      <pre>{active.details.exampleCode}</pre>
                    </div>
                  </div>
                )}

                {/* Navigation hint */}
                <div className="pt-2 flex items-center justify-between border-t border-white/[0.05]">
                  <span className="text-[11px] text-gray-600 font-mono">
                    {active.number} of {String(concepts.length).padStart(2, "0")}
                  </span>

                  {/* Next topic button */}
                  {(() => {
                    const idx = concepts.findIndex((c) => c.id === activeId);
                    const next = concepts[idx + 1];
                    return next ? (
                      <button
                        onClick={() => setActiveId(next.id)}
                        className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 hover:text-white transition-colors cursor-pointer group"
                      >
                        <span>Next: {next.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
