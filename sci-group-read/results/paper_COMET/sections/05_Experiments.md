# Experiments

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

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
Table 2. Attack Success Rate (ASR, ↑) results of COMET and advanced baseline (CS-DJ) on SafeBench, evaluated via StrongRe-
ject [24]. “Vanilla” (Van.) is the setting without any defense, “Defended” (Def.) is the setting with a prompt-based defense [26].
Category
Gemini-2.5-Flash
GPT-4.1-mini
GPT-4.1
Qwen3-VL-235B-A22B
CS-DJ
COMET
CS-DJ
COMET
CS-DJ
COMET
CS-DJ
COMET
Van.
Def.
Van.
Def.
Van.
Def.
Van.
Def.
Van.
Def.
Van.
Def.
Van.
Def.
Van.
Def.
ADU
0.36
0.36
1.00
0.96
0.00
0.00
0.86
0.84
0.06
0.04
0.96
0.90
0.02
0.00
0.98
0.90
FRD
0.72
0.76
1.00
0.98
0.32
0.02
1.00
0.96
0.72
0.68
0.98
0.92
0.02
0.00
0.98
0.92
HAT
0.76
0.72
1.00
1.00
0.24
0.00
0.92
0.84
0.36
0.32
0.88
0.86
0.04
0.00
0.94
0.88
ILL
0.84
0.80
1.00
0.96
0.28
0.02
0.92
0.88
0.64
0.60
1.00
1.00
0.00
0.00
1.00
0.96
MAL
0.72
0.68
1.00
1.00
0.20
0.04
0.98
0.90
0.06
0.04
0.98
0.96
0.02
0.00
1.00
0.94
PHY
0.60
0.60
1.00
0.96
0.56
0.02
0.98
0.92
0.72
0.60
0.92
0.88
0.00
0.00
0.98
0.86
PRV
0.96
0.92
1.00
1.00
0.24
0.00
0.92
0.88
0.24
0.20
1.00
0.98
0.00
0.00
0.98
0.98
All
0.71
0.69
1.00
0.98
0.26
0.01
0.94
0.89
0.40
0.35
0.96
0.93
0.01
0.00
0.98
0.92
0.0
0.2
0.4
0.6
0.8
1.0
Harmfulness Score
0
100
200
300
400
Frequency
Gemini-2.5-Flash
GPT-4.1-mini
GPT-4.1
Qwen3-VL-235B-A22B
(a) CS-DJ
0.0
0.2
0.4
0.6
0.8
1.0
Harmfulness Score
0
100
200
300
400
Frequency
Gemini-2.5-Flash
GPT-4.1-mini
GPT-4.1
Qwen3-VL-235B-A22B
(b) COMET
Figure 4. Comparison of Harmfulness Score Distribution on
SafeBench. The responses generated by COMET receive higher
HS (closer to 1.00), indicating the effectiveness of our method.
Table 3.
Comparison of different attack methods’ ASR on
SafeBench-Tiny across advanced VLMs. The best results are
in bold, and the second-best are underlined.
Victim Model
Method
CS-DJ
FigStep
HIMRD
COMET
CVPR-25 [27]
AAAI-25 [4]
ICCV-25 [16]
(ours)
GLM-4.5V
0.56
0.64
0.72
1.00
Gemini-2.5-Pro
0.22
0.52
0.48
0.92
Qwen2.5-72B-VL
0.18
0.88
0.64
1.00
LlaMa-4-maverick
0.10
0.62
0.90
0.96
Claude-4.5-Haiku
0.14
0.60
0.04
0.84
All
0.24
0.65
0.56
0.94
(Def. 0.93, Van. 0.97, on average) than CS-DJ (Def. 0.26,
350
Van. 0.35, on average) in both vanilla and defended settings
351
across all victim VLMs. CS-DJ represents a class of attack
352
methods [10, 23, 29] that seek to distract VLM’s attention
353
for jailbreak. However, CS-DJ becomes ineffective when
354
attacking advanced VLMs. In contrast, under the COMET
355
attack, advanced VLMs cannot directly decode the harm-
356
ful content, which enables COMET to bypass safety align-
357
ment mechanisms even against targeted defenses. The ef-
358
fectiveness of COMET further highlights a critical unsafety
359
of VLM’s long multimodal reasoning.
360
Harmfulness of Generated Responses.
We assess the
361
harmfulness of the generated responses using the indica-
362
Harmless Anchor
Harmful Anchor
CS-DJ (Van.)
CS-DJ (Def.)
(a) CS-DJ
Harmless Anchor
Harmful Anchor
COMET (Van.)
COMET (Def.)
(b) COMET
Figure 5. Sample semantic similarity distribution across differ-
ent jailbreak methods. We visualize the model representations
of attack payloads from different jailbreak methods: COMET,
COMET w/o Scen.N, HIMRD, and CS-DJ. Lower sample similar-
ity indicates greater diversity, enabling broader coverage of unsafe
patterns and enhancing red teaming effectiveness.
tor (harmfulness score, HS) from StrongReject as shown in
363
Figure 4 for more rigorous evaluation. The responses gener-
364
ated by COMET consistently receive higher scores (closer
365
to 1.00) compared to CS-DJ, indicating that COMET is not
366
an empty jailbreak method. The harmfulness of its out-
367
puts stems from our effective knowledge augmentation and
368
rubric guidance. Notably, we find that most existing stud-
369
ies criticize the empty jailbreak issue while lacking general
370
solutions and inversely leverage the evaluation guidance to
371
directly steer the victim VLM for effective jailbreak, form-
372
ing a plug-and-play approach.
373
Generalization to Advanced Models.
We further ex-
374
tend our evaluation to more advanced VLMs and com-
375
pare against more advanced attack methods (FigStep and
376
HIMRD). The results in Table 3 show that COMET con-
377
sistently achieves the highest ASR across VLMs, such as
378
GLM-4.5V, Gemini-2.5-Pro, and Qwen2.5-72B-VL. This
379
confirms that COMET is a broadly applicable attack
380
method, exposing a general unsafety pattern of VLMs.
381
Stealthiness Analysis.
To evaluate the concealment ef-
382
fectiveness of COMET, we analyze the harmfulness dis-
383
tribution of attack payloads.
As illustrated in Figure 7,
384
6

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
Table 4. Ablation study of our COMET. The experiment is con-
ducted on SafeBench-tiny using GPT-4.1. K.Refr, C.Enta, and
Scen.N denote Knowledge-scalable Reframing, Cross-modal Clue
Entanglement, and Cross-modal Scenario Nesting.
Components
Metrics
K.Refr
C.Enta
Scen.N
ASR (↑)
HS (↑)
✓
✓
✓
0.96
0.91
✓
0.66↓0.30
0.67↓0.24
✓
0.42↓0.54
0.52↓0.39
✓
0.24↓0.72
0.86↓0.05
COMET’s payloads cluster with harmless anchors and re-
385
main distant from harmful ones, demonstrating strong con-
386
cealment even when prompt defenses are active. This harm-
387
fulness distribution explains COMET’s high ASR against
388
defenses in the main experiment results (Table 2).
389
Main Results. COMET achieves over 94% ASR across
advanced VLMs, exposing a general unsafety pattern in
VLMs’ multimodal reasoning capabilities. We highlight
the value of cross-modal entanglement in preventing
VLMs’ direct decoding of attack semantics while exploit-
ing their self-steering/instruction-following behaviors.
390
4.3. Ablation Study
391
To validate the effectiveness of each component in COMET,
392
we conduct a comprehensive ablation study on SafeBench-
393
tiny using GPT-4.1 as the victim VLM. We system-
394
atically evaluate three core components:
Knowledge-
395
scalable Reframing (K.Refr), Cross-modal Clue Entan-
396
glement (C.Enta),
and Cross-modal Scenario Nesting
397
(Scen.N), as detailed in Table 4.
398
Our results demonstrate that each component contributes
399
significantly to attack effectiveness. The full COMET set-
400
ting achieves ASR=0.96 and HS=0.91, representing the op-
401
timal performance. Among individual components, K.Refr
402
(which employs unimodal knowledge-enhanced text inputs)
403
achieves ASR=0.66 and HS=0.67; C.Enta (which directly
404
performs cross-modal entanglement with knowledge exten-
405
sion) achieves ASR=0.42 and HS=0.52; and Scen.N (which
406
utilizes cross-modal scenario templates and rubrics for
407
steering) achieves ASR=0.24 and HS=0.86. These findings
408
reveal distinct functional roles: ❶K.Refr expands the com-
409
plexity of visual anchors and attack semantics for stealthi-
410
ness; ❷C.Enta provides the strongest attack capability by
411
enforcing cross-modal semantic alignment; ❸Scen.N en-
412
hances output harmfulness through scenario-guided steer-
413
ing;.
414
4.4. Further Analysis
415
Impact of Entanglement Hop Count. We utilize seman-
416
tic entanglement to prevent VLMs from directly decoding
417
attack intent. We analyze the effect of entanglement hop
418
0
2
4
6
8
10
Entanglement Hop Count
0.0
0.2
0.4
0.6
0.8
1.0
ASR & HS
COMET (ASR)
COMET (HS)
CS-DJ (hop=0, ASR)
FigStep (hop=0, ASR)
HIMRD (hop=1, ASR)
(a) ASR & HS
0
2
4
6
8
10
Entanglement Hop Count
20
40
60
80
100
PPL
COMET
CS-DJ (hop=0)
FigStep (hop=0)
HIMRD (hop=1)
(b) PPL
Figure 6. Impact of Entanglement Hop Count. (a) Attack Suc-
cess Rate (ASR) and Harmfulness Score (HS) as a function of hop
count h; (b) aggregated Prompt Perplexity (PPL) vs. h. Increas-
ing h elevates cross-modal dependency, yielding higher ASR with
a moderate rise in HS, while PPL remains comparatively low, in-
dicating improved concealment.
(a) Textual Semantic Distribution
(b) Visual Semantic Distribution
Figure 7. Input Space Analysis of Attack Concealment. We
visualize the model representations of COMET and CS-DJ attack
payloads (with and without prompt defenses) and anchor inputs,
to demonstrate our method’s stealthiness and robustness.
count on ASR, HS, and PPL, as shown in Figur e 6a. Key
419
findings include: ❶The optimal trade-off between ASR and
420
HS occurs at 4 to 6 hops. As hop count increases, COMET’s
421
ASR metric gradually rises (reaching nearly 100% at 6
422
hops), while HS metric gradually decreases. This decline
423
occurs because VLMs have to allocate more attention to de-
424
code original semantics for response generation. ❷More
425
hops lead to more natural expression and greater effective-
426
ness in steering output, as evidenced by lower perplexity
427
for model understanding. In contrast, HIMRD exhibits ab-
428
normally high perplexity, which can easily trigger VLMs’
429
safety alignment mechanisms.
430
Potential for Red Teaming. Effective red teaming requires
431
attack methods that go beyond fixed or well-engineered
432
prompts and demand high diversity to avoid overfitting lim-
433
ited unsafe patterns. We highlight COMET’s potential for
434
red-teaming VLMs’ multimodal reasoning capabilities, as it
435
automatically generates meaningful and varied attack pay-
436
loads for jailbreak. As shown in Fig. 7, COMET’s adver-
437
7

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
(a) Harmful Semantics Distribution with/without Rubric
(b) Attack Visual Payload
w/o Rubric
(c) VLMs’ Attention Pattern
w/o Rubric
(d) Attack Visual Payload
w/ Rubric
(e) VLMs’ Attention Pattern
w/ Rubric
Figure 8. Impact of Rubric-based Steering on Model Attention.
(a) It is counterintuitive that adding the visual rubric reduces the
overall attack stealthiness while leading to more harmful output.
(b-e) Finding: The rubric guides VLM´s attention from entity-level
harmfulness analysis to more explicit instruction-following mode
for problem-solving.
sarial samples achieve lower semantic similarity compared
438
to methods like CS-DJ (which uses fixed templates for jail-
439
break). This lower similarity indicates greater diversity, en-
440
abling broader coverage of unsafe patterns. The core of at-
441
tack entanglement payload (Tentgl, Ientgl), which operates
442
without fixed scenario nesting, further achieves lower se-
443
mantic similarity than HIMRD, highlighting COMET’s red-
444
teaming potential.
445
Impact of Rubric-based Steering Ablation study (§ 4.3)
446
demonstrates the visual rubric’s significance in steering
447
VLMs toward useful harmful outputs.
However, it also
448
exhibits synergistic effects on attack stealth as shown in
449
Figure 8(a), which is counterintuitive. We further observe
450
the VLMs’ attention patterns to analyze this phenomenon,
451
as shown in Figure 8(b-e). We find that the rubric trans-
452
forms the VLM’s attention from entity-level harmfulness
453
judgment in the image to focus on the task outline of dis-
454
guised score-seeking scenarios for problem-solving, which
455
indicates that the VLM more explicitly enters instruction-
456
following mode without compromising safety alignment
457
and usefulness, thus self-steering into the jailbreak.
458
Table 5. Comparison of COMET and HIMRD across visual
styles. We report their Attack Success Rate / Visual Payload Gen-
eration Success Rate for comparison. We use dall-e-3, which
is a commercial model with safeguards, to generate images and
GPT-4.1 as the victim VLM for evaluation on SafeBench-tiny.
Method
Visual Style
Realistic
Cartoon
Pixel Art
Sketch
HIMRD
0.00/0.08
0.02/0.04
0.04/0.08
0.02/0.06
COMET
0.94/1.00
0.98/1.00
0.96/1.00
0.98/1.00
Impact of Cross-modal Scenario Nesting. As shown in
459
Figure 8(c, e), the rubric fundamentally alters the VLM’s
460
attention. Without the rubric, the model’s attention is dif-
461
fusely spread across the image’s general features. However,
462
with the rubric (part of our Scenario Nesting), the VLM’s
463
attention shifts significantly to the disguised UI, including
464
the dashboard and evaluation criteria. This indicates the
465
model has transitioned from a simple safety-checking mode
466
to an instruction-following mode, focused on the problem-
467
solving task presented in the fabricated ‘Model Quality
468
Control’ scenario.
469
Impact of Visual Style.
The visual style is essential
470
for both attack effectiveness and camouflage. We evaluate
471
COMET’s performance across 4 distinct image generation
472
styles (Realistic, Cartoon, Pixel Art, and Sketch) for evalu-
473
ation. As shown in Table 5, COMET achieves 100% visual
474
payload generation success rate across all styles, signifi-
475
cantly outperforming HIMRD. This demonstrates that our
476
method not only effectively disperses harmful information
477
through visual channels but also leverages state-of-the-art
478
T2I models to enhance attack effectiveness, regardless of
479
visual presentation style.
480
5. Conclusion
481
In this paper, we investigated vulnerabilities of advanced
482
Vision-Language Models (VLMs) to jailbreak attacks by
483
exploiting their multimodal reasoning.
We argued that
484
existing methods relying on simple and fixed attack pay-
485
laods are insufficient for red-teaming advanced VLMs. To
486
address this, we introduced COMET, an attack frame-
487
work constructing deeply entangled cross-modal payloads
488
through knowledge reframing, cross-modal clue entangling,
489
and scenario nesting.
Our extensive experiments on 9
490
VLMs demonstrated that COMET achieves over 94% at-
491
tack success rate, significantly outperforming state-of-the-
492
art baselines by 29%, particularly against prompt-based de-
493
fenses. The results confirm that by creating complex, entan-
494
gled reasoning chains, COMET effectively bypasses safety
495
alignments and exposes deep vulnerabilities in VLMs’ mul-
496
timodal understanding. This study further underscores the
497
importance of developing more sophisticated red-teaming
498
strategies and robust defenses for advanced multimodal
499
models.
500
8

