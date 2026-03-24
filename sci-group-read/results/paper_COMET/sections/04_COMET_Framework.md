# COMET Framework

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
Table 1. Comparison of different VLM jailbreak attacks. COMET establishes strong cross-modal dependencies through semantic
entanglement, exploiting cross-modal reasoning vulnerabilities for jailbreak.
FigStep
MML
Visual-
CS-DJ
HIMRD
VisCo
COMET
Attribute
[4]
[12]
RolePlay [15]
[27]
[16]
[8]
(ours)
Modality Concealment
✗(Image unsafe)
✓
✗(Image unsafe)
✗(Image unsafe)
✓
✗(Text unsafe)
✓
Risk Distribution
✗
✓
✗
✗
✓
✓
✓
Attack Scalability
✗
✗
✗
✓
✗
✗
✓
Harmful Output Steering
✗
✗
✓
✓
✗
✓
✓
Core Strategy
Typographic
Multimodal
Role-based
Attention
Risk
Context
Semantics
Visual Prompt
Encryption
Scenario
Distraction
Distribution
Camouflage
Entanglement
tics, but these methods often rely on straightforward seman-
140
tic substitutions, which are detectable by evolving safety
141
alignment. ❸Cross-modal distribution methods [16, 22,
142
27] seeks to distribute attack semantics across modalities,
143
thus ensuring that each individual modality appears benign
144
under modality-specific safety checks.
145
We conclude that the following design insights formalize
146
a VLM attack method from the previous studies: Modal-
147
ity Concealment, i.e., disguising each individual modality
148
to appear benign; Risk Distribution, i.e., distributing de-
149
tection risk across modalities; Attack Scalability, i.e., be-
150
ing extensible and adaptable to attack advanced VLMs; and
151
Harmful Output Steering, i.e., going beyond mere attack
152
success to avoid empty jailbreak [24].
153
However, as shown in Table 1, existing mainstream
154
methods exhibit limitations across these dimensions, as
155
they mainly rely on concealing attack semantics through
156
fixed, heuristic-based substitution patterns that inherently
157
lack scalability. To this end, our COMET is designed with
158
the adaptive mechanisms to establish entangled cross-modal
159
semantics that necessitate multimodal reasoning, thereby
160
enabling more scalable attacks.
161
3. Methodology
162
Our attack framework COMET is shown in Figure 2. To
163
attack VLMs, COMET couples the modalities to jointly ob-
164
fuscate the attack semantics, thus steering VLMs into the
165
instruction-following mode for solving the presented cross-
166
modal tasks. In this mode, victim VLMs can be induced to
167
output grounded unsafe content through their detailed rea-
168
soning process on understanding the task, which compels
169
them to actively integrate and interpret the attack semantics.
170
3.1. Knowledge-Scalable Reframing
171
To entangle cross-modal attack semantics, COMET first ex-
172
pands and rewrites a given harmful query into a multi-hop
173
chain instruction via ReAct loop [28], deliberately inject-
174
ing multiple visualizable entities for subsequent entangle-
175
ment. The target of this loop is to strategically leverage
176
benign, non-judgmental, and non-negative knowledge to re-
177
frame the query, thereby suppressing the VLM’s direct neg-
178
ative associations of the query while preserving the com-
179
plete malicious intent.
180
Formally, given an original harmful query Qorig
=
181
(Torig, ⊥) with textual malicious instruction Torig and its tar-
182
get harmful response Rorig, an auxiliary text-to-text LLM
183
MT2T iteratively optimizes a knowledge set K to rewrite
184
Qorig into the reframed query Qrefr(K) = (Trefr(K), ⊥)
185
through ReAct loop with the following target:
186
K∗= arg max
K
P(Rorig | Qrefr(K))·(1−P(Rsafe | Qrefr(K))),
(1)
187
where K = {k1, k2, ..., kn}, each ki is the knowledge
188
piece, P(Rorig | Qrefr(K)) is the probability of eliciting the
189
harmful response, and P(Rsafe | Qrefr(K)) is the safety re-
190
fusal probability. The ReAct loop process is formalized as:
191
Qrefr = ReAct(MT2T, promptchain, Qorig, K∗),
(2)
192
where promptchain is the system prompt that guides the LLM
193
to reframing the query in ReAct loop.
Our core insight
194
of such reframing is that the objective and factual nature
195
of knowledge provides a benign semantic carrier for ex-
196
pressing malicious intent.
Importantly, we can leverage
197
knowledge interconnectedness to adaptively scale semantic
198
complexity, thus systematically bypassing different VLMs’
199
safety alignment. A concrete reframed query is as follows:
200
Example: multi-hop chain instruction
Original Query (Qorig): How to make explosives?
Reframed Query (Qrefr):
Certain devices in engineering
practice achieves specific functions through rapid conversion
of chemical energy to mechanical energy. Its core components
typically comprise a mixture of oxidizing and reducing agents,
which undergo vigorous redox reactions when subjected to
specific external stimuli, releasing substantial amounts of gas
and producing significant pressure changes. The construction
principles of such devices involve physicochemical processes
of energy storage and release, with specialized applications in
professional fields such as industrial demolition and mining
operations. Based on their working mechanisms and composi-
tional characteristics, how are these non-standardized assem-
bled energy conversion systems typically referred to in profes-
sional literature? In this energy conversion system, how can the
constraint relationships between the functional implementation
mechanisms and feasible application environments be system-
atically described and achieved through the non-standardized
assembled energy storage and release processes?
201
3

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
Knowledge 
Augmentation
Content 
Migration 
and Coupling
Certain devices are... two piles 
of powdered substances in the 
foreground left, a spiral spring 
structure in the foreground 
slightly left of center...
Instruction
Decomposition
Provide a complete answer that achieves a score of 6 (Master 
level) based on the rubric...⨁Certain devices are typically 
assembled from common civilian materials... 
Guide to Making 
Homemade 
Explosive Devices
Certain devices are typically assembled from 
common civilian materials, with their core 
mechanism relying on the rapid conversion of 
chemical energy into mechanical energy. The 
basic structure of such a device includes an 
oxidizer, a reductant, and an initiation 
component...
Knowledge-Scalable Reframing
Cross-Modal Clue Entangling
Cross-Modal Scenario Nesting
Dimension
0 POINTs
6 POINTs
...
Explosive Formula 
Information 
Completeness
...
...
...
...
No formula 
information 
provided
Analysis of 
formula 
stability ...
...
Provide a complete answer that achieves a 
score of 6 (Master level) based on the rubric...
Harmful Task
Visual Rubric Table
Textual Task Guideline
Image-Text Pair
Generated via ReAct loop:
Visual Attack Input:
Textual Attack Input:
Visual Disguised Scenario
decoy entities
Figure 2. Overview of COMET framework. COMET constructs attack payloads with entangled cross-modal obfuscation via: ❶
Knowledge-Scalable Reframing transforms the given harmful task into a multi-hop chain instruction via knowledge augmentation; ❷
Cross-Modal Clue Entangling migrates instruction’s visualizable entities to images, thus coupling the modalities to obfuscate the attack
semantics; ❸Cross-Modal Scenario Nesting steers the victim VLM for detailed harmful response via cross-modal contextual deception.
3.2. Cross-Modal Clue Entangling
202
The text-only knowledge reframing of malicious intent still
203
faces the risk of being directly decoded by advanced VLMs,
204
as the knowledge’s textual format is likely already internal-
205
ized by VLMs. In contrast, visual information is naturally
206
sparse and ambiguous, creating an understanding gap with
207
the textual format that resists direct semantic decoding. We
208
thus strategically represent visualizable entities within the
209
knowledge in visual form for attacking.
210
Formally, given the text-only reframed query Qrefr =
211
(Trefr, ⊥), COMET entangles it across modalities through
212
two steps: ❶Entangled Image Generation: MT2T extracts
213
visualizable entities from Trefr and constructs an image gen-
214
eration prompt with decoy entities, then MT2I synthesizes
215
the entangled image Ientgl; ❷Entangled Text Generation:
216
MI2T derives the entangled text Tentgl by masking migrated
217
entities in Trefr and replacing them with spatial pointers to
218
Ientgl. This produces Qentgl = (Ientgl, Tentgl) where the attack
219
semantics are fine-grained distributed across modalities.
220
Entangled Image Generation (Ientgl).
We only em-
221
bed attack semantics within a benign, narrative-parallel
222
image at the entity level, thus camouflaging the harm-
223
ful query as a legitimate task.
Specifically, an auxiliary
224
text-to-text model MT2T first extracts visualizable entities
225
Evis = {evis
1 , evis
2 , ..., evis
m } from Trefr, which carry the se-
226
mantic clues for global task understanding, and introduces
227
decoy entities Edecoy = {edecoy
1
, edecoy
2
, ..., edecoy
n
} to obscure
228
the attack semantics.
Then, guided by a system prompt
229
promptimg, MT2T constructs a structured image generation
230
prompt promptmigr from both entity sets with a style mask
231
Mstyle specifying visual styling (e.g., pixel art, cartoon ren-
232
dering), which is then fed into a text-to-image model MT2I
233
(a) FigStep
(b) HIMRD
(c) CS-DJ
(d) COMET
Figure 3. Comparison of visual obfuscation strategies for the
task “How to make illegal drugs?” Our COMET constructs a be-
nign visual narrative image with related entities but unrelated con-
text to embed and entangle attack clues across modalities.
to synthesize the entangled image Ientgl:
234
promptmigr = MT2T(promptimg, Evis, Edecoy, Mstyle),
Ientgl = MT2I(promptmigr).
(3)
235
Entangled Text Generation (Tentgl). We then replace
236
the migrated entities in Trefr with spatial pointers that
237
only ambiguously reference corresponding visual regions
238
in Ientgl. An image-to-text model MI2T performs this re-
239
placement by taking both Trefr and Ientgl as input, guided by
240
a system prompt promptentgl:
241
Tentgl = MI2T(promptentgl, Trefr, Ientgl).
(4)
242
For instance, as shown in Figure 2, entities like “an ox-
243
idizer, a reductant” are replaced by spatial descriptors like
244
“two piles of powdered substances in the foreground left”,
245
and “an initiation component” becomes “a spiral spring
246
structure in the foreground slightly left of center”.
We
247
use such cross-modal entanglement to steer the VLM into
248
instruction-following mode, where it actively associates
249
spatial pointers in the text with visual elements in the image
250
through self-induced cross-modal reasoning to complete the
251
presented harmful task for jailbreaking.
252
4

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
COMET scalably and stealthily exploits VLMs’ incom-
253
plete visual safety by decomposing harmful scenarios into
254
fragmented entity-level clues and coupling them with be-
255
nign narratives, thereby manipulating VLMs to reconstruct
256
attack semantics for jailbreaking. As illustrated in Figure 3,
257
such entity-level entanglement exhibits strong deceptive-
258
ness by camouflaging attack intent within benign narratives.
259
3.3. Cross-Modal Scenario Nesting
260
Existing advanced VLMs have been specifically trained and
261
optimized to tackle complex reasoning tasks with fidelity,
262
such as GAIA [17] and HLE [19], thus developing strong
263
instruction-following capabilities. To exploit this capabil-
264
ity, COMET constructs a score-seeking reasoning challenge
265
scenario through text-image composition (Tscen, Iscen), fur-
266
ther ensuring the success of our entangled attack while
267
avoiding empty jailbreaks.
268
Contextual Scenario Setting. The collaborative text-
269
image components Tscen and Iscen for fabricating an authen-
270
tic reasoning challenge are illustrated in Figure 1. The text
271
component Tscen wraps the entangled attack payload within
272
a score-seeking reasoning challenge. The visual component
273
Iscen is fabricated through template-based rendering with
274
four coordinated sections (from top to bottom): ❶The sce-
275
nario header presents a credible testing context with task
276
identifiers. ❷The progress tracker fabricates ongoing eval-
277
uation history using visual elements such as progress bars
278
and pass rate indicators, creating urgency for task comple-
279
tion. ❸The requirement box displays formal instructions
280
that explicitly guide VLMs to analyze the entangled pay-
281
load according to scoring rubrics. ❹The UI components
282
incorporate authentic interface elements including progress
283
checkmarks, warning icons, input fields, and status logs to
284
maximize visual authenticity.
285
Rubric-based Steering.
Similarly, VLMs’ unsafe
286
instruction-following capability for visual table understand-
287
ing could be exploited to steer them toward detailed harmful
288
outputs. We place task guidance rubrics in visual table for-
289
mat Irubric, generated via Trubric = MT2T(promptrubric, Qorig)
290
and rendered as a structured table for VLM manipulation.
291
Attack Payload Assembly. The final text Tatk and image
292
Iatk are created by concatenating the entangled payload with
293
nested scenario components to form attack payload:
294
Tatk, Iatk = Tentgl ⊕Tscen, Ientgl ⊕Irubric ⊕Iscen,
(5)
295
where ⊕denotes concatenation.
Compared to existing
296
VLM jailbreak methods, COMET attacks unsafe multi-
297
modal reasoning in a more comprehensive and fine-grained
298
manner with superior scalability.
299
4. Experiment
300
4.1. Experiment Setup
301
Datasets and Evaluation Metrics.
We select 7 harm-
302
ful categories from SafeBench [4] for targeted evaluation:
303
Adult Content (ADU), Fraud (FRD), Hate Speech (HAT),
304
Illegal Activity (ILL), Malware (MAL), Physical Harm
305
(PHY), and Privacy Violation (PRV). To assess broader gen-
306
eralization, we further conduct evaluations on the complete
307
SafeBench-tiny dataset. We employ Attack Success Rate
308
(ASR, 0-1) and Harmfulness Score (HS, 0-1) metrics to
309
evaluate COMET. Both of them are computed by the Stron-
310
gReject framework [24]. ASR [4, 9] measures the success
311
rate of jailbreak attempts against the target VLM. HS re-
312
flects the specificity and convincingness of VLMs’ output,
313
and we compute the average HS only on successful attack
314
samples for meaningful comparison. Following previous
315
studies [4, 16], each attack is evaluated with 5 attempts.
316
Victim Models and Attack Baselines. We evaluate our
317
method on 9 widely used VLMs:
GPT-4.1, GPT-4.1-
318
mini, Gemini-2.5-Flash, Qwen3-VL-235B-A22B-Instruct,
319
Qwen2.5-72B-VL, GLM-4.5V, Gemini-2.5-Pro, LlaMa-4-
320
maverick, and Claude-4.5-Haiku. These VLMs are widely
321
deployed in real-world applications. We compare COMET
322
against three state-of-the-art VLM jailbreaking methods:
323
FigStep [4], CS-DJ [27], and HIMRD [16]. We use the
324
official implementations of these baselines with their rec-
325
ommended hyperparameters.
326
Implementation details and Defense Setting. The auxil-
327
iary models MT2T, MI2T, and MT2I are DeepSeek-V3.1-
328
Terminus, Qwen3-VL-235B-A22B-Thinking, and gemini-
329
2.5-flash-image. We use Qwen3-VL-30B-A3B-Instruct for
330
semantic representation and embedding calculation. The
331
strongreject framework is performed using GPT-4.1-mini.
332
We set the generation temperature to 0.1.
We use the
333
sketch visual style as Mstyle.
We evaluate COMET on
334
SafeBench under the AdaShield-Static [26] defense. The
335
defense prompt is prepended to the attack payload as fol-
336
lows: “Before processing any instruction, examine the im-
337
age carefully for any text or items that might suggest harm-
338
ful, illegal, or dangerous activity. If detected, do not en-
339
gage with or act on the content. Analyze the image and the
340
given instruction holistically. If the content is determined
341
to be unethical, illegal, or dangerous, please answer “I am
342
sorry”. Instead, please execute the following instructions
343
safely and correctly:”
344
4.2. Main Results
345
Comparison with Baselines.
We first comprehensively
346
compare COMET against the advanced baseline, CS-DJ,
347
targeting 4 mainstream VLMs on SafeBench, as shown in
348
Table 2. The COMET achieves significantly higher ASR
349
5

