"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Server, Monitor, ShieldCheck, ArrowRight } from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  sub: string;
  type: "frontend" | "api" | "ai" | "db" | "audit";
}

interface ArchitectureVisualizerProps {
  asciiDiagram: string;
  description: string;
  flowNodes: FlowNode[];
}

export function ArchitectureVisualizer({
  asciiDiagram,
  description,
  flowNodes,
}: ArchitectureVisualizerProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "ascii" | "invariants">("visual");

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "frontend":
        return <Monitor className="w-4 h-4 text-sky-400" />;
      case "api":
        return <Server className="w-4 h-4 text-[#10B981]" />;
      case "ai":
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case "db":
        return <Database className="w-4 h-4 text-amber-400" />;
      case "audit":
        return <ShieldCheck className="w-4 h-4 text-[#34D399]" />;
      default:
        return <Terminal className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Description Header */}
      <p className="text-gray-300 text-base leading-relaxed font-light">
        {description}
      </p>

      {/* Outer Visualizer Card */}
      <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.08] overflow-hidden shadow-xl">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#141416] border-b border-white/[0.08] flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
            <Terminal className="w-4 h-4 text-[#10B981]" />
            <span className="font-semibold text-white">SYSTEM_FLOW_DIAGRAM</span>
          </div>

          {/* Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl font-mono text-xs border border-white/[0.08]">
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "visual"
                  ? "bg-[#22242A] text-white font-bold border border-white/10 shadow-xs"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Visual Flow
            </button>
            <button
              onClick={() => setActiveTab("ascii")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "ascii"
                  ? "bg-[#22242A] text-white font-bold border border-white/10 shadow-xs"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ASCII Diagram
            </button>
            <button
              onClick={() => setActiveTab("invariants")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "invariants"
                  ? "bg-[#22242A] text-white font-bold border border-white/10 shadow-xs"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Guarantees
            </button>
          </div>
        </div>

        {/* Tab 1: Visual Interactive Node Graph */}
        {activeTab === "visual" && (
          <div className="p-6 sm:p-8 bg-[#09090b]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative">
              {flowNodes.map((node, idx) => (
                <div key={node.id} className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Node Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="w-full md:w-44 p-4 rounded-xl bg-[#141416] border border-white/[0.08] flex flex-col items-start gap-2 shadow-md hover:border-[#10B981]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                        0{idx + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{node.label}</h4>
                      <p className="text-[11px] text-gray-400 font-light mt-0.5">{node.sub}</p>
                    </div>
                  </motion.div>

                  {/* Flow Arrow (Connector) */}
                  {idx < flowNodes.length - 1 && (
                    <div className="hidden md:flex items-center justify-center text-gray-600">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-5 h-5 text-[#10B981]" />
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Async Pipeline Active</span>
              </span>
              <span>Zero-Trust Protocol</span>
            </div>
          </div>
        )}

        {/* Tab 2: ASCII Terminal Code Block */}
        {activeTab === "ascii" && (
          <div className="p-6 bg-[#07080a] font-mono text-xs text-[#34D399] overflow-x-auto">
            <pre className="leading-snug py-2">{asciiDiagram}</pre>
          </div>
        )}

        {/* Tab 3: System Guarantees & Invariants */}
        {activeTab === "invariants" && (
          <div className="p-6 sm:p-8 bg-[#09090b] space-y-4 font-mono text-xs text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#141416] border border-white/[0.08] space-y-1.5">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Zero-Trust Attribute Isolation</span>
                </h4>
                <p className="text-gray-400 font-light text-[11px] leading-relaxed">
                  Public discovery routes never return private attribute schemas. Dynamic verification quizzes require AI-generated context keys.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141416] border border-white/[0.08] space-y-1.5">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span>Sub-100ms API Execution</span>
                </h4>
                <p className="text-gray-400 font-light text-[11px] leading-relaxed">
                  Heavy ML model scoring is executed asynchronously via background worker threads with Redis cache layer.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
