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

## When Working

First identify what kind of help the user wants:

- polish a sentence or paragraph
- rewrite a full section
- align a manuscript with IEEE tone
- improve structure and flow
- tighten claims for technical accuracy
- make LaTeX prose cleaner and more consistent

Match the depth of the response to the request. If the user asks for a direct rewrite, give the rewrite first. If the user asks for critique, explain the issues first and then propose fixes.

## Core Writing Principles

### Preserve Meaning

Do not introduce unsupported claims, new results, fake citations, or stronger novelty language than the source justifies. If the draft is ambiguous, resolve it conservatively.

### Prefer Clarity Over Formulaic Stiffness

Aim for formal academic tone, but do not make the prose robotic. Use passive voice when it improves objectivity or aligns with the surrounding text, but prefer whichever construction is clearer and more compact.

Prefer moderate sentence length. If a sentence starts carrying method, result, implication, and comparison all at once, split it into two tighter sentences.

### One Paragraph, One Job

Give each paragraph a clear function. Start with the main point, develop it with evidence or explanation, and remove sentences that repeat nearby material.

### Keep Claims Proportional

Use measured language. Replace hype, certainty inflation, and vague praise with concrete statements about method, data, comparisons, limits, and practical implications.

### Favor Specific Technical Language

Replace filler phrases and abstract wording with direct verbs, concrete nouns, and, when available, quantities or comparisons.

## Style Guidance

- Define acronyms on first use and keep terminology consistent afterward.
- Prefer precise, neutral statements over marketing language.
- Present methods and results objectively.
- Emphasize reproducibility, methodological detail, and evidence-backed conclusions.
- Avoid first-person pronouns by default, including `we`, unless the user explicitly wants to preserve an existing first-person house style.
- Keep sentences compact. Split overloaded sentences that try to carry multiple claims.

### Parenthetical Expressions

**Never use Chinese parentheses to add Chinese explanatory text after a term.** This is a telltale sign of AI-generated writing. For example:

- **Bad:** `意图对齐（智能体是否忠于原始任务目标）`
- **Bad:** `现有最优（SOTA）方法`
- **Bad:** `如微调Qwen3-4B）`

Instead, convert parenthetical explanations to:
- **Attributive phrases:** `旨在衡量边界越权拦截能力的R-Judge数据集`
- **Appositive clauses:** `应答合规维度——即智能体是否遵守安全策略——在所有场景中均为关键`
- **Dash-separated inserts:** `当证据不足时——例如攻击绕过了护栏检测——上游信号可能被稀释`

**Exceptions that are acceptable:**
- English abbreviation definitions: `残差认知贝叶斯网络（Residual Cognitive Bayesian Network, RC-BN）` — this is standard academic practice
- English term glosses after Chinese terms in their first occurrence: `意图对齐（Intent Alignment）` — acceptable only once per term

## Flow Between Sentences

Make adjacent sentences connect cleanly.

- Let the first sentence establish context or the main claim.
- Let the next sentence narrow to method, evidence, or limitation.
- Avoid choppy sentence-to-sentence jumps where each sentence feels isolated.
- When revising abstracts and introductions, prefer a clear progression such as problem -> method -> result -> implication.

## Structure Checks

When revising a section, look for these issues:

1. missing problem statement or motivation
2. weak transitions between paragraphs
3. repeated claims across sections
4. method descriptions that are too vague to follow
5. results stated without context, comparison, or takeaway
6. conclusions that overstate significance

Fix the issue in the rewrite rather than merely pointing it out, unless the user asked for review only.

## LaTeX Conventions

If the user is editing a LaTeX manuscript:

- Preserve LaTeX commands, labels, citations, math, and cross-references.
- Use `\cite{}` keys already present in the manuscript rather than inventing new references.
- Keep `\ref{}` and `\label{}` usage consistent.
- Do not break equations, macros, or environments during rewriting.
- Return text that can be pasted back into the `.tex` source with minimal cleanup.

## Tables and Figures

### Preventing Table Overflow

Wide tables are a common LaTeX problem. Before writing a table, estimate column count against the available text width. Apply these strategies in order of preference:

1. **Abbreviate column headers.** Use single-letter or short abbreviations (P, R, F1, Acc) and define them in the caption rather than spelling out full metric names in every column header.
2. **Shorten row labels.** Remove redundant qualifiers, parenthetical explanations, and unnecessary "层" / "layer" suffixes from configuration names.
3. **Use `\resizebox{\textwidth}{!}{...}`** to scale the entire tabular environment to fit the text width. This is acceptable for tables with many columns where abbreviation alone is insufficient.
4. **Use `\small` or `\footnotesize`** for the table font size when scaling is not appropriate.
5. **Split into two tables** only as a last resort — prefer keeping related comparisons in one table for ease of reading.

Also verify that `\begin{table*}` is closed with `\end{table*}` (not `\end{table}`), and vice versa. Mismatched environments cause silent LaTeX errors.

### Caption Writing

A caption is a **title**, not a description. It summarizes *what* the table or figure is in a short academic phrase. All supplementary information — metric definitions, abbreviation keys, reading instructions, analytical observations — belongs in the body text that references the table or figure.

- **Good:** `\caption{各方法在三个基准上的安全检测性能对比}`
- **Bad:** `\caption{各方法在三个智能体安全基准上的检测性能对比（\%）。P=精确率，R=召回率，Acc=准确率。各列最佳结果加粗。}`

The bad example stuffs metric definitions and formatting notes into the caption. These should appear in the preceding or following paragraph instead.

### Avoiding Redundant Figures

Do not create a figure that merely re-visualizes data already fully presented in a table. A radar chart, bar chart, or heatmap is only justified when it reveals a pattern (e.g., asymmetry, trend, clustering) that is hard to see from raw numbers alone. 

**Specific Redundancy Checks:**
- **Radar Charts:** Redundant if there are fewer than 5 axes and the numerical differences are already obvious in the main table.
- **Heatmaps:** A small 3x3 or 4x4 matrix presented as a heatmap is universally redundant if the identical matrix is printed right above it as a table. Omit the heatmap and analyze the table directly.

If the table already conveys the information clearly, the figure is redundant and wastes space. When in doubt, omit the figure.


## Response Patterns

### Small Rewrite Requests

Return:

1. the revised text
2. a short note on what improved, only if useful

If a single-sentence rewrite becomes long or crowded, prefer two shorter sentences with a tighter logical link.

Unless the user asks for labels, avoid adding headings like `Revised text:` before a short rewrite.

### Section-Level Rewrites

Return:

1. a polished LaTeX-ready section
2. brief notes on major structural or stylistic changes
3. any factual gaps or citation gaps that still need author input

### Review-Only Requests

Return:

1. the main writing issues
2. concrete recommended edits
3. optional sample rewrites for the most important passages

## Editing Heuristics

During revision, actively look for and remove patterns such as:

- "it should be noted that"
- "it is worth mentioning that"
- empty novelty claims like "very innovative" or "highly effective"
- repeated restatement of the same contribution
- broad claims not tied to data, experiments, or citations
- unnecessary first-person wording such as `we propose`, `we develop`, or `we show` when the sentence works better as an impersonal construction

Also check whether adjacent sentences can be merged for flow or split for readability.

## Technical Content Safeguards

- Keep enough methodological detail for a knowledgeable reader to follow the work.
- Do not rewrite away important assumptions, limits, or implementation details.
- If a claim appears unsupported, soften the wording rather than pretending the evidence exists.
- If terminology conflicts across the draft, normalize it to one consistent term unless the distinction is meaningful.

## Output Quality Bar

Before finishing, make sure the revision is:

- faithful to the source meaning
- more concise than the original unless detail was missing
- easier to read sentence by sentence
- consistent in terminology and tense
- suitable for an IEEE-style engineering paper

## Example Behaviors

**Input:** "Rewrite this abstract to sound more like an IEEE journal paper, but keep the contribution exactly the same."

**Output:** Provide a tighter abstract with neutral claims, clearer problem-method-result flow, and no added technical content.

**Input:** "Please edit this LaTeX introduction and keep all citations and refs untouched."

**Output:** Return revised LaTeX prose that preserves `\cite{}` and `\ref{}` commands while improving flow and concision.
