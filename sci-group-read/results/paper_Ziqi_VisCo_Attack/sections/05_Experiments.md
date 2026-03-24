# Experiments

Image Multi-Perspective Analysis.
This strat-
egy guides the MLLM to examine the image I
from contrasting perspectives, such as safety ver-
sus risk. Unsafe content linked to Qh is gradually
introduced through discussion under the risk per-
spective. The final prompt P initial
atk
emerges as a
seemingly logical continuation of this comparative
analysis.
Iterative Image Interrogation.
This method fab-
ricates an argumentative dialogue focusing on the
image I and sensitive topics related to Qh. The
simulated exchange mimics a debate, with user
prompts questioning or rebutting fabricated model
responses. These responses are carefully designed
to introduce harmful elements subtly. By simu-
lating prior discussion of sensitive content, this
strategy lowers the MLLM’s caution. The result-
ing P initial
atk
is presented as a natural progression of
the dialogue, aiming to elicit an explicit harmful
response aligned with Qh.
Exploiting Image Hallucination.
This strategy
leverages multimodal misinterpretation by intro-
ducing an auxiliary image Igen that is visually am-
biguous but thematically related to Qh. The dia-
logue falsely attributes unsafe content to this image,
misleading the MLLM into believing it has already
processed such information.
The final prompt
P initial
atk
exploits this induced bias to provoke the
desired harmful output.
For strategies that require auxiliary images Igen,
such as Scenario Simulation and Hallucination Ex-
ploitation, the Red Team Assistant πred is responsi-
ble for generating the corresponding text-to-image
prompts Tgen. These prompts are then processed
by a diffusion model πdiff to synthesize the auxil-
iary images, i.e., Igen = πdiff(Tgen). Both the target
image I and any synthesized Igen are included in
the relevant user prompts Pi within the final attack
sequence Satk. The generated initial attack prompt
P initial
atk
is subsequently passed to the refinement
stage.
3.3
Iterative Attack Prompt Refinement
Given that the automatically generated initial at-
tack prompt P initial
atk
may deviate semantically from
the original harmful query Qh or contain explicit
language and sensitive keywords likely to trigger
the target MLLM’s safety mechanisms, we intro-
duce an iterative refinement stage to mitigate these
issues. This stage aims to better align the prompt
with the intent of Qh while enhancing its ability to
evade safety filters. At iteration i, we first assess
the semantic alignment of the current attack prompt
P (i−1)
atk
. If misalignment is detected, the Red Team
Assistant πred is prompted to refine it, producing
an updated prompt P (i)
atk . This process repeats until
the prompt is semantically aligned with Qh.
Semantic Assessment.
To assess whether the
generated attack prompt has semantically devi-
ated from the original harmful query, we propose
a novel evaluation strategy. Specifically, we use
an uncensored language model not aligned with
safety protocols (Wizard-Vicuna-13B-Uncensored
πwiz (Computations, 2023)) to generate a response
under the deceptive context. We obtain the re-
sponse as Yi ∼πwiz(·|C′
fake, P (i−1)
atk
), where C′
fake
denotes the context Cfake with all images replaced
by their corresponding textual captions. Using an
uncensored model is crucial here; a safety-aligned
model might refuse generation, hindering semantic
assessment. Then, we prompt the Red Team Assis-
tant πred to perform a semantic QA relevance check
between the generated response Yi and the original
harmful query Qh, evaluating whether the answer
aligns with the intended question.
Toxicity Obfuscation and Semantic Refinement.
The prompt is first revised to realign with the intent
of Qh. Subsequently, all prompts, regardless of
whether semantic deviation was detected, are fur-
ther optimized using the refinement rules defined
in Trefine. This optimization aims to enhance eva-
siveness and reduce the likelihood of being flagged
by safety filters.
(P (i)
atk ) = πred(Qh, C′
fake, P (i−1)
atk
, Yi, Trefine). (4)
Specifically, techniques focus on enhancing eva-
siveness, such as using contextual references to
objects within the image (I or Igen) to obscure sen-
sitive keywords or adjusting the prompt’s tone. The
outcome of this process is the refined prompt for
the iteration, P (i)
atk .
This iterative process continues until πred deter-
mines that semantic drift has been resolved or a
predefined maximum of M iterations is reached.
Let ifinal denote the final iteration index, where
1 ≤ifinal ≤M. The resulting prompt from this
iteration, P (ifinal)
atk
, is designated as the final refined
attack prompt, denoted as Patk. This final prompt
is then incorporated into the complete attack se-
quence Satk.
9643

3.4
Attack Execution
The final stage executes the attack by presenting
the constructed payload Satk to the target MLLM.
The original image I and any generated images Igen
(Section 3.2) are embedded within the appropriate
prompts (Pi) or responses (Ri). Their placement
and format adhere to the specific requirements of
πtarget and the chosen context generation strategy
(Tk). The complete sequence Satk is then processed
by πtarget in a single forward pass. The goal is to
trigger the harmful response Rh that corresponds
to the query Qh.
4
Experiments
We conduct comprehensive experiments to evalu-
ate the effectiveness of our proposed VisCo Attack
across multiple multimodal large language mod-
els (MLLMs) and safety-critical benchmarks, and
further perform ablation studies to analyze the con-
tribution of each component.
4.1
Setup
Models.
We validate the effectiveness of our
VisCo Attack on several powerful MLLMs, in-
cluding both open-source models such as LLaVA-
OV-7B-Chat (Xiong et al., 2024), InternVL2.5-
78B (Chen et al., 2024b), Qwen2.5-VL-72B-
Instruct (Yang et al., 2024a), as well as API-
based black-box models like GPT-4o, GPT-4o-
mini (Achiam et al., 2023) and Gemini-2.0-
Flash (Team et al., 2024).
Benchmarks and Baselines.
We evaluate our
VisCo Attack across three multimodal safety-
related benchmarks. MM-SafetyBench (Liu et al.,
2024b), originally proposed as QR Attack, uses
image-query-related inputs to elicit harmful re-
sponses from models.
It features images with
explicit unsafe content spanning 13 distinct cat-
egories, such as physical harm, fraud, and hate
speech. For brevity, we use category abbreviations
in Table 1, with full category definitions provided
in Appendix A.1. However, as the original im-
ages were generated by T2I models using keyword-
based prompts, some exhibit semantic misalign-
ment with the intended harmful queries, potentially
diminishing attack effectiveness. To address this,
we regenerate part of the dataset using Gemini-2.0-
Flash-Thinking-Exp-01-21 to produce more seman-
tically accurate T2I prompts, and Stable Diffusion
3.5 Large (Esser et al., 2024) to generate the cor-
responding images. To avoid potential evaluation
bias, we evaluate QR Attack on both the original
(Table 1) and regenerated (Table 4) image sets, en-
suring a fair comparison with VisCo under identical
visual conditions. FigStep (Gong et al., 2023) is
an adversarial injection benchmark where harmful
instructions are embedded into blank images using
typography. Our experiments use the SafeBench-
Tiny subset, which contains 50 harmful queries
across 10 restricted categories defined by OpenAI
and Meta policies. Since all original images are
text-based compositions, we recreate a visual ver-
sion of this dataset using the same T2I pipeline de-
scribed above. HarmBench (Mazeika et al., 2024)
consists of 110 multimodal samples, each pairing
an image with a behavior description referencing
its visual content. We directly use the original
HarmBench images without modification. Results
on HarmBench are reported in Appendix A.2.3.
For further details on the benchmarks and dataset
construction process, please refer to Appendix A.1.
Implementation Details.
We instantiate the
auxiliary
vision-language
model
πaux
VLM
with
InternVL2.5-78B (Chen et al., 2024b), the dif-
fusion model πdiff with Stable Diffusion 3.5
Large (Esser et al., 2024), and the uncensored
language model πwiz with Wizard-Vicuna-13B-
Uncensored (Computations, 2023). The Red Team
Assistant πred is implemented using Gemini-2.0-
Flash-Thinking-Exp-01-21, with a decoding tem-
perature set to 1.0.
We also experiment with
Qwen2.5-72B-Instruct (Yang et al., 2024a) as an
open-source alternative for πred. We set the temper-
ature of the target model πtarget to 0 during evalua-
tion.
Evaluation.
We use the toxicity score (Toxic)
and attack success rate (ASR) as our primary eval-
uation metrics. Following the protocol established
by Qi et al. (2023), we assess harmfulness using a
GPT-4o-based judge, which rates model responses
to harmful queries on a scale from 1 (harmless) to
5 (highly harmful and well-aligned with the query
intent). Only responses receiving a score of 5 are
considered successful attacks. For each harmful
query Qh, we generate up to five complete attack
sequences Satk. Each sequence consists of a dis-
tinct adversarial context Cfake, comprising three
rounds of fabricated dialogue, and a refined attack
prompt Patk, produced by iterative optimization.
The maximum number of refinement iterations is
set to M = 3. A query is deemed successfully at-
tacked if any of its five attempts receives a toxicity
9644

GPT-4o
GPT-4o-mini
Gemini-2.0-Flash
InternVL2.5-78B
QR Attack
VisCo Attack
QR Attack
VisCo Attack
QR Attack
VisCo Attack
QR Attack
VisCo Attack
Category
Toxic
ASR
Toxic
ASR
Toxic
ASR
Toxic
ASR
Toxic
ASR
Toxic
ASR
Toxic
ASR
Toxic
ASR
01-IA
1.02
2.06
4.85
89.69
1.10
2.06
4.88
91.75
1.49
10.31
4.95
94.85
1.61
9.28
4.95
95.88
02-HS
1.22
0.61
4.59
64.42
1.60
5.52
4.78
79.75
1.93
13.50
4.77
82.21
2.38
20.25
4.81
81.60
03-MG
2.00
15.91
4.93
95.45
1.77
13.64
4.93
95.45
3.52
56.82
4.91
95.45
3.57
56.82
4.98
97.73
04-PH
1.85
19.44
4.85
90.97
1.94
18.75
4.86
90.28
2.83
39.58
4.97
97.22
3.13
44.44
4.95
95.14
05-EH
3.61
49.18
4.76
82.79
3.65
47.54
4.87
89.34
3.63
45.08
4.88
92.62
3.89
50.00
4.93
94.26
06-FR
1.32
5.84
4.95
95.45
1.78
13.64
4.97
97.40
2.37
27.27
4.99
98.70
2.71
29.22
5.00
100.00
07-SE
1.86
11.93
4.51
73.39
3.35
40.37
4.72
80.73
3.44
41.28
4.74
81.65
3.77
48.62
4.83
89.91
08-PL
4.20
64.71
4.99
99.35
4.10
58.82
4.96
96.73
4.16
57.52
4.99
99.35
4.23
61.44
4.97
98.04
09-PV
1.45
7.19
4.98
97.84
1.63
12.95
4.94
96.40
2.15
20.86
4.98
97.84
2.96
37.41
5.00
100.00
10-LO
2.95
19.23
4.66
81.54
3.15
24.62
4.50
69.23
3.36
29.23
4.68
77.69
3.34
23.85
4.62
74.62
11-FA
3.78
46.71
4.80
88.02
3.62
38.92
4.80
88.02
3.63
38.92
4.87
91.02
3.56
37.72
4.85
90.42
12-HC
3.15
14.68
4.77
80.73
2.92
6.42
4.74
78.90
3.28
15.60
4.90
90.83
3.39
17.43
4.81
85.32
13-GD
3.12
16.78
4.58
71.14
3.00
11.41
4.55
69.80
3.32
19.46
4.79
85.91
3.20
15.44
4.59
71.81
ALL
2.48
22.20
4.78
85.00
2.64
23.57
4.80
86.13
3.00
31.07
4.88
91.07
3.21
34.05
4.86
89.88
Table 1: Results of Query-Relevant (QR) Attack and our VisCo Attack on MM-SafetyBench in terms of Toxic (1–5)
and ASR (%) across different MLLMs. “01-IA” to “13-GD” denote the 13 subcategories of prohibited scenarios,
and “ALL” represents the overall performance across all categories.
score of 5. We report the toxicity score (Toxic) as
the maximum score observed across the five gener-
ated responses, indicating the most harmful output
elicited by the attack. As the four vision-focused
strategies yield comparable results, we report main
results using only the Iterative Image Interroga-
tion strategy due to space constraints. Detailed
results with different strategies are provided in Ap-
pendix A.2.
4.2
Attack Performance on MLLMs
We evaluate the proposed VisCo Attack on the MM-
SafetyBench dataset, comparing it against the ex-
isting QR Attack (with typography perturbations).
The evaluation focuses on two key metrics: toxicity
score (Toxic) and attack success rate (ASR). The
detailed results are presented in Table 1.
Overall, VisCo Attack consistently outperforms
QR Attack (with typography) across all models
and tasks. In terms of average ASR, VisCo Attack
achieves 85.00%, 86.13%, 91.07%, and 89.88%
on GPT-4o, GPT-4o-mini, Gemini-2.0-Flash, and
InternVL2.5-78B, respectively, corresponding to
absolute gains of 62.80, 62.56, 60.00, and 55.83
percentage points (pp) over QR Attack. For toxicity
scores, VisCo Attack consistently achieves values
above 4.5 in every case, while QR Attack typically
ranges between 2 and 3, highlighting the superior
effectiveness of our method in eliciting harmful
content. The advantage of VisCo is especially evi-
dent in more challenging categories such as 01-IA,
02-HS, 06-FR, and 09-PV. Across nearly all tasks,
VisCo Attack yields significantly higher toxicity
Attack
FigStep
VisCo Attack
Metric
Toxic
ASR
Toxic
ASR
LLaVA-OV-7B-Chat
3.98
54.00
4.70
80.00
InternVL2.5-78B
2.74
34.00
4.84
88.00
Qwen2.5-VL-72B-Instruct
4.18
64.00
4.82
86.00
Gemini-2.0-Flash
3.86
54.00
4.68
80.00
GPT-4o-mini
3.02
40.00
4.76
86.00
GPT-4o
1.74
12.00
4.60
76.00
Table 2: Comparison of FigStep and VisCo Attack
across different MLLMs on SafeBench-Tiny in terms of
Toxic (1–5) and ASR (%).
scores, often exceeding QR Attack by more than 2
points.
To further evaluate the applicability and effec-
tiveness of VisCo Attack across a broader range of
models, we conduct additional experiments on the
SafeBench-Tiny subset of the FigStep dataset. This
evaluation includes both open-source and propri-
etary MLLMs, and compares VisCo Attack against
the original FigStep attack, which uses purely typo-
graphic perturbations. As shown in Table 2, VisCo
Attack consistently outperforms the original Fig-
Step attack across all evaluated models. For in-
stance, the ASR on GPT-4o increases significantly
from 12% to 76%, demonstrating VisCo Attack’s
strong applicability in black-box settings. Similar
patterns are observed in open-source models. The
original FigStep attack still achieves relatively high
ASR on some models. For example, it reaches 64%
on Qwen2.5-VL-72B-Instruct. However, models
like GPT-4o and InternVL2.5 are less affected, with
ASRs of 12% and 34%. In contrast, VisCo At-
tack effectively bypasses these defenses and con-
sistently improves both ASR and toxicity scores
9645

Setting
Toxic
ASR
VisCo Attack
3.72
50.00
w/o Context
3.34
36.00
w/o Refinement
3.68
42.00
2 Rounds
3.84
42.00
4 Rounds
3.98
54.00
Table 3: Ablation study of VisCo Attack on SafeBench-
Tiny using GPT-4o in terms of Toxic (1–5) and ASR
(%).
across all models.
We also evaluate VisCo Attack on HarmBench’s
multimodal behaviors, with detailed results pro-
vided in Appendix A.2.3.
4.3
Ablation Study
To thoroughly evaluate the contribution of each
core component in the VisCo Attack framework,
we perform an ablation study on the SafeBench-
Tiny dataset, targeting GPT-4o, which exhibits the
strongest safety alignment among the evaluated
models. To isolate the impact of individual com-
ponents, we generate a single adversarial context
Cfake for each harmful query Qh, resulting in one
complete attack sequence Satk per query. The re-
sults are presented in Table 3.
We evaluate five configurations in total, includ-
ing the full VisCo Attack, removal of contextual his-
tory (w/o Context), removal of prompt refinement
(w/o Refinement), as well as shorter (2 Rounds)
and longer (4 Rounds) versions of the adversar-
ial context Cfake. In the w/o Context setting, we
retain only the final attack prompt Patk, omitting
the multi-turn fabricated dialogue. This results
in a drop in ASR from 50% to 36%, and a de-
crease in the toxicity score from 3.72 to 3.34, in-
dicating the essential role of contextual dialogue
in relaxing the model’s safety constraints. When
the iterative prompt refinement module is removed
(w/o Refinement), ASR decreases to 42% with a
toxicity score of 3.68, suggesting that while the
initial prompt is already moderately effective, se-
mantic alignment and evasive optimization further
enhance the attack’s success. With respect to the
number of dialogue rounds, reducing it to 2 leads
to a performance drop (ASR = 42%, Toxic = 3.84),
while increasing it to 4 yields further gains (ASR
= 54%, Toxic = 3.98). These results indicate that
longer contexts improve ASR by enabling more
coherent and deceptive narratives, but at the cost
of increased computation. We adopt 3 rounds as a
FigStep
VisCo (Gemini-Red) VisCo (Qwen-Red)
0
20
40
60
80
100
ASR (%)
12.00
76.00
68.00
0
1
2
3
4
5
Toxic
1.74
4.60
4.58
ASR (%)
Toxic
Figure 3: Results of VisCo Attack with different red
team assistants (πred) on SafeBench-Tiny using GPT-4o
as the target model, in terms of Toxic (1–5) and ASR
(%).
balance between effectiveness and efficiency.
To evaluate the impact of red team assistant
model choice (πred), we conduct experiments on
the SafeBench-Tiny subset using GPT-4o as the tar-
get model (πtarget). In addition to our default assis-
tant, Gemini-2.0-Flash-Thinking-Exp-01-21 (Team
et al., 2024), we test an open-source alternative,
Qwen2.5-72B-Instruct (Yang et al., 2024a). Substi-
tuting the assistant results in a modest ASR drop
from 76.00% to 68.00%, while the toxicity score
remains comparable (4.60 vs. 4.58). Despite this
slight decrease, both metrics still significantly out-
perform the original FigStep baseline, indicating
that strong open-source models can serve as effec-
tive red team assistants. These findings underscore
the flexibility of VisCo Attack across different as-
sistant model configurations.
5
Conclusion
In this work, we propose a vision-centric jailbreak
paradigm, where the visual modality plays a cen-
tral role in crafting realistic and complete adver-
sarial scenarios. To instantiate this setting, we in-
troduce the VisCo Attack, a two-stage black-box
attack pipeline that first fabricates a deceptive di-
alogue history using one of four vision-focused
strategies, and then refines the final attack prompt
through toxicity obfuscation and semantic refine-
ment. Our approach shows strong effectiveness on
MM-SafetyBench against state-of-the-art MLLMs,
significantly outperforming existing baselines in
both attack success rates and toxicity scores. By
highlighting the elevated risks posed by visually
grounded adversarial contexts, our findings call for
a reevaluation of current MLLM safety alignment
strategies. We hope VisCo Attack will serve as a
9646

foundation for future research into both attack and
defense mechanisms for multimodal models.
Acknowledgments
This work was supported by the Shanghai Artificial
Intelligence Laboratory. We thank the anonymous
reviewers for their helpful feedback.
Limitations
While VisCo demonstrates strong effectiveness in
constructing realistic and visually grounded jail-
break scenarios, our current approach to context
fabrication still relies on a set of manually designed
strategy templates. These templates guide the gen-
eration of multi-turn dialogue contexts and are tai-
lored to specific attack strategies. Although effec-
tive, this design limits the flexibility and scalability
of the attack pipeline, especially when adapting
to new domains or unforeseen prompts. In future
work, we plan to explore automatic context gen-
eration techniques that can dynamically synthe-
size adversarial multimodal histories without hand-
crafted templates. Such advancements may fur-
ther enhance the generalizability and stealthiness
of vision-centric jailbreaks in real-world settings.
Ethics Statement
This work reveals safety risks in black-box MLLMs
through controlled jailbreak experiments. The in-
tent is academic, aiming to highlight vulnerabili-
ties and encourage the development of stronger de-
fenses. We emphasize the need for rigorous safety
evaluations before releasing both open-source and
API-based MLLMs to the public.
References
Josh Achiam, Steven Adler, Sandhini Agarwal, Lama
Ahmad, Ilge Akkaya, Florencia Leoni Aleman,
Diogo Almeida, Janko Altenschmidt, Sam Altman,
Shyamal Anadkat, and 1 others. 2023. Gpt-4 techni-
cal report. arXiv preprint arXiv:2303.08774.
Cem Anil, Esin Durmus, Nina Panickssery, Mrinank
Sharma, Joe Benton, Sandipan Kundu, Joshua Bat-
son, Meg Tong, Jesse Mu, Daniel Ford, and 1 others.
2024. Many-shot jailbreaking. Advances in Neural
Information Processing Systems, 37:129696–129742.
Shuai Bai, Keqin Chen, Xuejing Liu, Jialin Wang, Wen-
bin Ge, Sibo Song, Kai Dang, Peng Wang, Shijie
Wang, Jun Tang, and 1 others. 2025. Qwen2. 5-vl
technical report. arXiv preprint arXiv:2502.13923.
Yangyi Chen, Karan Sikka, Michael Cogswell, Heng
Ji, and Ajay Divakaran. 2024a. Dress: Instructing
large vision-language models to align and interact
with humans via natural language feedback. In Pro-
ceedings of the IEEE/CVF Conference on Computer
Vision and Pattern Recognition, pages 14239–14250.
Zhe Chen, Weiyun Wang, Yue Cao, Yangzhou Liu,
Zhangwei Gao, Erfei Cui, Jinguo Zhu, Shenglong
Ye, Hao Tian, Zhaoyang Liu, and 1 others. 2024b.
Expanding performance boundaries of open-source
multimodal models with model, data, and test-time
scaling. arXiv preprint arXiv:2412.05271.
Cognitive
Computations.
2023.
Wizard-vicuna-13b-uncensored.
https://huggingface.co/cognitivecomputations/Wizard-
Vicuna-13B-Uncensored.
Chenhang Cui, Gelei Deng, An Zhang, Jingnan Zheng,
Yicong Li, Lianli Gao, Tianwei Zhang, and Tat-Seng
Chua. 2024. Safe+ safe= unsafe? exploring how
safe images can be exploited to jailbreak large vision-
language models. arXiv preprint arXiv:2411.11496.
Aobotao Dai, Xinyu Ma, Lei Chen, Songze Li, and Lin
Wang. 2025. When data manipulation meets attack
goals: An in-depth survey of attacks for vlms. arXiv
preprint arXiv:2502.06390.
Yunkai Dang, Kaichen Huang, Jiahao Huo, Yibo Yan,
Sirui Huang, Dongrui Liu, Mengxi Gao, Jie Zhang,
Chen Qian, Kun Wang, and 1 others. 2024. Explain-
able and interpretable multimodal large language
models: A comprehensive survey. arXiv preprint
arXiv:2412.02104.
Yi Ding, Bolian Li, and Ruqi Zhang. 2024. Eta: Evalu-
ating then aligning safety of vision language models
at inference time. arXiv preprint arXiv:2410.06625.
Yi Ding, Lijun Li, Bing Cao, and Jing Shao. 2025. Re-
thinking bottlenecks in safety fine-tuning of vision
language models. arXiv preprint arXiv:2501.18533.
Patrick Esser, Sumith Kulal, Andreas Blattmann, Rahim
Entezari, Jonas Müller, Harry Saini, Yam Levi, Do-
minik Lorenz, Axel Sauer, Frederic Boesel, and 1
others. 2024. Scaling rectified flow transformers for
high-resolution image synthesis. In Forty-first Inter-
national Conference on Machine Learning.
Kuofeng Gao, Yang Bai, Jiawang Bai, Yong Yang, and
Shu-Tao Xia. 2024. Adversarial robustness for vi-
sual grounding of multimodal large language models.
arXiv preprint arXiv:2405.09981.
Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun
Wang. 2023.
Figstep: Jailbreaking large vision-
language models via typographic visual prompts.
arXiv preprint arXiv:2311.05608.
Xuhao Hu, Dongrui Liu, Hao Li, Xuanjing Huang,
and Jing Shao. 2024.
Vlsbench: Unveiling vi-
sual leakage in multimodal safety. arXiv preprint
arXiv:2411.19939.
9647

