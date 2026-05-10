---
name: my-paper-polish-skills
description: Revises and strengthens academic paper writing, especially when the user is drafting or polishing LaTeX sections, improving technical prose, or asking for more formal, concise, publication-ready language. Use this skill whenever the task involves rewriting any section of an academic paper, even if the user does not explicitly mention polishing.
---

# My Paper Polish Skills

Help the user turn rough academic prose into clear, publication-ready writing without changing the technical meaning.

## Goals

- Preserve the author's claims, evidence, and intended emphasis.
- Improve clarity, rigor, concision, and logical flow.
- Prefer neutral, evidence-driven phrasing over promotional language.
- Keep the result LaTeX-ready when the user is working in `.tex` files.

## Hard Rules

These rules apply to every revision without exception. Scan output against them before finalizing.

### No Bold Text

Do not use `\textbf{}` anywhere in the paper body or tables. This includes:

- Highlighting best results in tables — omit the bold, let numbers speak
- Emphasizing key terms or concepts in paragraphs — use phrasing instead
- Starting paragraph sub-sections with a bolded label (e.g., `\textbf{架构消融。}`) — fold the label into the sentence flow instead
- Any `**label:** explanation` pattern — rewrite as a full sentence

If something needs emphasis, restructure the sentence to lead with the key point.

### No Colons in Running Text

Do not use colons (： or `:`) anywhere in body text, including:

- After a bolded or emphasized lead-in phrase
- Before lists embedded in a sentence
- In constructions like `结论：XXX方法优于YYY` or `数据截断策略：在训练阶段...`
- In section / subsection / subsubsection titles (e.g., `\subsection{消融实验：架构贡献}` is forbidden)

Rewrite such constructions as complete declarative sentences. For section titles, use a single concise phrase.

### No Parentheticals in Chinese Text

Three patterns are forbidden:

**1. Chinese explanatory text after a term.** This is a telltale sign of AI-generated writing.

- Bad: `意图对齐（智能体是否忠于原始任务目标）`
- Bad: `现有最优（SOTA）方法`
- Bad: `如微调Qwen3-4B）`

**2. Mid-sentence explanatory clauses.**

- Bad: `对每条unsafe轨迹生成截断副本（safe轨迹仅保留完整版本），使BN学习...`
- Bad: `三节点后验概率分布（直接反映各认知维度的风险激活程度）`
- Bad: `将细粒度诊断标签（涵盖风险来源与失败模式两个维度）通过映射...`

**3. Parenthetical cross-references.**

- Bad: `在实验测量中（详见第~\ref{sec:foo}节），结果表明...`
- Bad: `如第~\ref{sec:foo}节所示（见下文），...`

Convert to one of:

- Attributive phrase: `旨在衡量边界越权拦截能力的R-Judge数据集`
- Appositive clause: `应答合规维度——即智能体是否遵守安全策略——在所有场景中均为关键`
- Coordinate clause: `对每条unsafe轨迹生成截断副本，safe轨迹仅保留完整版本，使BN学习...`
- Direct integration: `实验测量表明，AgentDoG在...` (drop the cross-reference if the claim stands alone)

**Acceptable exceptions:**

- English abbreviation definitions: `中文方法全称（English Method Name, EMN）` — standard academic practice
- English term gloss after a Chinese term, only on first occurrence: `意图对齐（Intent Alignment）`
- Numerical values or short labels in parentheses: `本文方法的精确率（91.3\%）超过基线`

### Subject Convention

Every sentence describing what the paper or its authors did must have an explicit subject. The convention is:

- **本文** — for actions performed by the paper or authors (proposing, designing, evaluating, computing, comparing, mapping, etc.)
- **Method name** — for what the method itself does (introduces a connection, propagates a signal, outputs a posterior)
- **Named experiment or entity** (消融实验, 跨域迁移实验, AgentDoG, 表X) — for results, observations, or table contents

Forbidden subjects:

- 我们 / `we` — colloquial first person
- 本节 / 本小节 — use 本文 instead, section scope is implicit from chapter structure
- 系统 / 实验 as agentless generic subjects
- No subject at all, especially after `为了...，` or `通过...，` constructions

Examples:

- Bad: `为验证组件必要性，在统一模型上进行了消融实验。`
- Good: `本文在统一模型上进行了消融实验以验证组件必要性。`
- Bad: `通过语义映射将其标签转换为三节点体系。`
- Good: `本文通过语义映射将其标签转换为三节点体系。`
- Bad: `本节对其逐一量化评估。`
- Good: `本文对其逐一量化评估。`

### Forbidden Phrases

Remove these patterns on sight:

- `值得注意的是` / `it should be noted that` / `it is worth mentioning that`
- Empty novelty claims: `创新性`, `创新性地`, `出众`, `不可或缺`, `very innovative`, `highly effective`
- Repeated restatement of the same contribution across paragraphs
- Broad claims not tied to data, experiments, or citations

## Core Writing Principles

### Preserve Meaning

Do not introduce unsupported claims, new results, fake citations, or stronger novelty language than the source justifies. If the draft is ambiguous, resolve it conservatively.

### Prefer Clarity Over Formulaic Stiffness

Aim for formal academic tone, but do not make the prose robotic. Use passive voice when it improves objectivity or aligns with surrounding text, but prefer whichever construction is clearer and more compact.

Prefer moderate sentence length. If a sentence carries method, result, implication, and comparison all at once, split it into two tighter sentences.

### One Paragraph, One Job

Give each paragraph a clear function. Start with the main point, develop it with evidence or explanation, and remove sentences that repeat nearby material.

When an explanatory analysis later supports causal interventions, ablations, or error analysis, give the explanatory analysis its own clear unit before the downstream result. State what phenomenon or dataset property it characterizes, then let the later experiment explicitly cross-check that characterization instead of repeating the same explanation in both places.

### Keep Claims Proportional

Use measured language. Replace hype, certainty inflation, and vague praise with concrete statements about method, data, comparisons, limits, and practical implications.

### Favor Specific Technical Language

Replace filler phrases and abstract wording with direct verbs, concrete nouns, and, when available, quantities or comparisons.

## Sentence Flow and Style

### Flow Between Sentences

Make adjacent sentences connect cleanly:

- Let the first sentence establish context or the main claim.
- Let the next sentence narrow to method, evidence, or limitation.
- Avoid choppy sentence-to-sentence jumps where each sentence feels isolated.
- For abstracts and introductions, prefer the progression problem → method → result → implication.

### General Style Notes

- Define acronyms on first use and keep terminology consistent afterward.
- Prefer precise, neutral statements over marketing language.
- Present methods and results objectively.
- Emphasize reproducibility, methodological detail, and evidence-backed conclusions.
- Keep sentences compact. Split overloaded sentences that try to carry multiple claims.

## Structure Checks

When revising a section, look for these issues:

1. missing problem statement or motivation
2. weak transitions between paragraphs
3. repeated claims across sections
4. method descriptions that are too vague to follow
5. results stated without context, comparison, or takeaway
6. conclusions that overstate significance

Fix the issue in the rewrite rather than merely pointing it out, unless the user asked for review only.

## LaTeX, Tables, and Figures

### LaTeX Conventions

If the user is editing a LaTeX manuscript:

- Preserve LaTeX commands, labels, citations, math, and cross-references.
- Use `\cite{}` keys already present in the manuscript rather than inventing new references.
- Keep `\ref{}` and `\label{}` usage consistent.
- Do not break equations, macros, or environments during rewriting.
- Return text that can be pasted back into the `.tex` source with minimal cleanup.

### Preventing Table Overflow

Wide tables are a common LaTeX problem. Before writing a table, estimate column count against the available text width. Apply these strategies in order of preference:

1. Abbreviate column headers. Use single-letter or short abbreviations (P, R, F1, Acc) and define them in the body text rather than spelling out full metric names in every column header.
2. Shorten row labels. Remove redundant qualifiers, parenthetical explanations, and unnecessary `层` / `layer` suffixes from configuration names.
3. Use `\resizebox{\textwidth}{!}{...}` to scale the entire tabular environment to fit the text width. Acceptable for tables with many columns where abbreviation alone is insufficient.
4. Use `\small` or `\footnotesize` for the table font size when scaling is not appropriate.
5. Split into two tables only as a last resort — prefer keeping related comparisons in one table for ease of reading.

Also verify that `\begin{table*}` is closed with `\end{table*}` (not `\end{table}`), and vice versa. Mismatched environments cause silent LaTeX errors.

### Strict Three-Line Tables

Use booktabs-style three-line tables for manuscript tables. Avoid vertical rules in `tabular` column specs, avoid extra internal `\midrule` separators, and avoid standalone category rows such as `\multicolumn{...}{l}{...}` inside the table body. If categories are important, make them a formal column. If they are not essential, omit them and explain grouping in the prose.

### Caption Writing

A caption is a title, not a description. It summarizes what the table or figure is in a short academic phrase. All supplementary information — metric definitions, abbreviation keys, reading instructions, analytical observations — belongs in the body text that references the table or figure.

- Good: `\caption{各方法在三个基准上的安全检测性能对比}`
- Bad: `\caption{各方法在三个智能体安全基准上的检测性能对比（\%）。P=精确率，R=召回率，Acc=准确率。各列最佳结果加粗。}`

The bad example stuffs metric definitions and formatting notes into the caption. These belong in the preceding or following paragraph instead.

### Avoiding Redundant Figures

Do not create a figure that merely re-visualizes data already fully presented in a table. A radar chart, bar chart, or heatmap is only justified when it reveals a pattern (asymmetry, trend, clustering) that is hard to see from raw numbers alone.

Specific redundancy checks:

- Radar charts: redundant if there are fewer than 5 axes and the numerical differences are already obvious in the main table.
- Heatmaps: a small 3x3 or 4x4 matrix presented as a heatmap is universally redundant if the identical matrix is printed right above it as a table. Omit the heatmap and analyze the table directly.

If the table already conveys the information clearly, the figure is redundant and wastes space. When in doubt, omit the figure.

For ablation studies, decide whether the reader needs raw scores or effects. If the analytical point is component contribution, a figure should show the change relative to the full model rather than a second copy of the absolute scores. Use diverging bars, slope charts, or another delta-focused encoding so losses and gains are visible at a glance.

Keep generated figure typography consistent with the manuscript's existing visual language. When surrounding figures use a black sans-serif style, set the plotting script's font fallback explicitly instead of relying on Matplotlib defaults, and verify the embedded PDF visually after compilation.

When a table reports a metric at one operating point such as `Metric@50%` while also showing multiple threshold or truncation columns, the prose must explain why that operating point was selected and why the other points are not repeated as separate metric columns. Also distinguish the point metric from adjacent aggregate metrics so readers do not mistake them for duplicate views of the same quantity.

When introducing a baseline that is not self-evident from its name, briefly state its design principle and implementation. For LLM-based judge baselines, identify the input serialization, prompt objective, output format, whether training data is used, and any inference settings that materially affect reproducibility.

## Working Process

### Repository-Aware Paper Editing

When editing a LaTeX manuscript inside this repository, treat the paper as both prose and source code. Before making substantive changes, inspect the manuscript entry point, included chapter files, bibliography file, data files that feed tables, and current git status. Do not judge the paper only from the paragraph being edited if nearby files can contradict it.

For this project, use `paper/final/main.tex` as the manuscript entry point unless the user points elsewhere. Check the chapter inputs, `paper/final/outline.md`, `paper/final/references.bib`, and `paper/final/data/*.csv` when the edit touches structure, claims, citations, or experimental numbers.

After changes, compile from `paper/final` with:

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex
```

Then inspect `main.log` and `main.blg` for missing citations, undefined references, missing graphics, fatal LaTeX errors, overfull boxes, and bibliography warnings. Remove transient untracked build artifacts such as `main.fls`, `main.fdb_latexmk`, and `main.xdv` unless the project explicitly tracks them.

### Consistency Checks Learned From This Manuscript

These checks are mandatory for the BN agent safety paper because they have already caused drift:

- Keep the method name, acronym, title, abstract, conclusion, figure captions, table row labels, source data labels, generated-figure scripts, and PDF metadata synchronized. After a rename, search for legacy acronyms and keep them only when the manuscript explicitly defines them as distinct variants.
- Keep experiment prose synchronized with actual tables and CSV files. If the text claims "20 baselines" or "all baselines", the table must either list all 20 baselines or clearly state that it reports a representative subset.
- Keep category counts synchronized. If the prose says "three categories" but the table has closed-source, open-source, guard, and SOTA groups, revise the prose or table so the taxonomy matches.
- Keep dataset scale statements precise. If related work and experiments report different counts, first identify whether the difference comes from benchmark version, record granularity, split protocol, or filtering, then state the corresponding data scope without inventing a cause.
- Do not infer filtering merely because two dataset counts disagree. First trace the count through the local data files, loader, split function, and result JSON. Only call it a filtered subset if code or experiment logs show an explicit filtering rule.
- Match attribution-analysis wording to the actual aggregation scope. If code aggregates all true unsafe test samples, call them unsafe test samples rather than successfully intercepted samples unless the records are explicitly filtered by predicted unsafe.
- Surface outline and author placeholder issues when auditing, but do not edit `outline.md` or author metadata unless the user explicitly asks. In the current BN agent safety paper, the missing discussion chapter and placeholder author block are known non-blockers.
- Treat user-scoped discussion items as read-only. If the user says dataset wording or method naming still needs discussion, do not edit those areas while making unrelated agreed changes.

### Skill Update Loop

When modifying this paper, update this skill in the same work session if the edit reveals a reusable problem, rule, or workflow improvement. Add only durable lessons that should affect future paper edits. Prefer revising an existing rule over appending near-duplicates. Keep additions concise and specific enough to guide a future agent without bloating the skill.

### Identifying Request Type

First identify what kind of help the user wants:

- polish a sentence or paragraph
- rewrite a full section
- align a manuscript with IEEE tone
- improve structure and flow
- tighten claims for technical accuracy
- make LaTeX prose cleaner and more consistent

Match the depth of the response to the request. If the user asks for a direct rewrite, give the rewrite first. If the user asks for critique, explain the issues first and then propose fixes.

### Response Patterns

**Small rewrite requests.** Return:

1. the revised text
2. a short note on what improved, only if useful

If a single-sentence rewrite becomes long or crowded, prefer two shorter sentences with a tighter logical link. Unless the user asks for labels, avoid adding headings like `Revised text:` before a short rewrite.

**Section-level rewrites.** Return:

1. a polished LaTeX-ready section
2. brief notes on major structural or stylistic changes
3. any factual gaps or citation gaps that still need author input

**Review-only requests.** Return:

1. the main writing issues
2. concrete recommended edits
3. optional sample rewrites for the most important passages

## Editing Heuristics

During revision, actively scan for and fix:

- Hard Rules violations (bold, colons, parentheticals, subjects, forbidden phrases) — see Hard Rules section above
- Sentences that can be merged for flow or split for readability
- Adjacent sentences that repeat the same claim with slightly different wording
- Long subsection / figure / table titles that read like full descriptions

## Technical Content Safeguards

- Keep enough methodological detail for a knowledgeable reader to follow the work.
- Do not rewrite away important assumptions, limits, or implementation details.
- If a claim appears unsupported, soften the wording rather than pretending the evidence exists.
- If terminology conflicts across the draft, normalize it to one consistent term unless the distinction is meaningful.

## Output Quality Bar

Before finishing, verify the revision is:

- faithful to the source meaning
- compliant with all Hard Rules (no bold, no colons, no forbidden parentheticals, explicit subjects, no forbidden phrases)
- more concise than the original unless detail was missing
- easier to read sentence by sentence
- consistent in terminology and tense
- suitable for an IEEE-style engineering paper

## Example Behaviors

**Input:** "Rewrite this abstract to sound more like an IEEE journal paper, but keep the contribution exactly the same."

**Output:** A tighter abstract with neutral claims, clearer problem-method-result flow, and no added technical content.

**Input:** "Please edit this LaTeX introduction and keep all citations and refs untouched."

**Output:** Revised LaTeX prose that preserves `\cite{}` and `\ref{}` commands while improving flow and concision.
