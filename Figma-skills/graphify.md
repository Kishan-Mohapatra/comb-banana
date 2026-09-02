# Graphify — Codebase Knowledge Graph

Source skill: `graphify` (Claude Code coding-agent skill). **Not a Figma Make design skill** — it turns a codebase/doc corpus into a queryable knowledge graph for the coding agent's own navigation, not a UI. Included here for completeness/reference only; do not upload to a Figma Make `guidelines/` folder.

## What It's For

Drop any folder of code, docs, papers, images, or video into graphify and get a queryable knowledge graph. Persistent across sessions, honest audit trail (EXTRACTED/INFERRED/AMBIGUOUS edge provenance), community detection surfaces cross-document connections. Three outputs: interactive HTML graph, GraphRAG-ready JSON, and a plain-language `GRAPH_REPORT.md`.

## Core Usage

```
/graphify                                    # full pipeline on current directory
/graphify <path>                             # full pipeline on specific path
/graphify https://github.com/<owner>/<repo>  # clone repo then run full pipeline
/graphify <path> --mode deep                 # thorough extraction, richer inferred edges
/graphify <path> --update                    # incremental — re-extract only changed files
/graphify query "<question>"                 # BFS traversal over existing graph — broad context
/graphify path "AuthModule" "Database"        # shortest path between two concepts
/graphify explain "SwinTransformer"           # plain-language explanation of a node
```

## Pipeline (What Happens Under the Hood)

1. **Detect** — scan the corpus, categorize files (code/docs/papers/images/video), warn on scale.
2. **Extract** — structural (AST, deterministic, free) in parallel with semantic (LLM-based, via dispatched subagents or Gemini if `GEMINI_API_KEY` is set) extraction.
3. **Build & cluster** — construct the graph, run community detection, score cohesion, surface "god nodes" (highly-connected concepts) and "surprising connections" (cross-community bridges).
4. **Label** — plain-language 2-5 word names for each detected community.
5. **Export** — HTML graph (always, unless `--no-viz`), optional Obsidian vault, wiki, Neo4j/FalkorDB, SVG/GraphML.
6. **Report** — `GRAPH_REPORT.md` with God Nodes, Surprising Connections, and Suggested Questions sections pasted directly into chat.

## Fast Path (Graph Already Built)

If `graphify-out/graph.json` already exists and the user asks a natural-language question about the codebase, skip the full pipeline and answer directly:

```
graphify query "<question>"
```

Quote `source_location` when citing a specific fact. Never invent an edge — if unsure, mark AMBIGUOUS.

## Honesty Rules

- Never invent an edge; use AMBIGUOUS when unsure.
- Never skip the corpus-size warning.
- Always show token cost in the report.
- Never hide cohesion scores behind symbols — show the raw number.
- Never run HTML viz on a graph with more than 5,000 nodes without warning the user.

## Why This Project Uses It

Per the project's original brief: graphify is meant to be run from the first code write so future sessions can navigate the impact area of a bug fix or feature by graph traversal instead of re-reading the whole repo — a token-saving move for a project meant to stay "compact and sleek" across many sessions.
