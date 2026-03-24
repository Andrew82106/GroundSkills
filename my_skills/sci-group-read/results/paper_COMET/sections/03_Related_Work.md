# Related Work

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
studies on VLM jailbreak attacks [2, 7, 16, 22]. They show
037
that VLMs can be jailbroken to generate unsafe content
038
(misleading information, actionable guidance for crime,
039
and biased or toxic content, etc.)
via very basic visual
040
manipulations such as typographic prompts [4], semantic
041
image substitution [9], and visual cryptography [12] in the
042
early stages of VLM development. These attacks are black-
043
box methods that operate entirely without gradient access.
044
Importantly, they only heuristically adapt classical strate-
045
gies that have become ineffective in the text modality to
046
visual inputs, and regain strong attack effectiveness. We
047
identify VLMs’ fundamental vulnerabilities from the initial
048
success of these basic attacks and conclude the correspond-
049
ing attack insights as follows:
050
• VLMs’ safety alignment mechanisms, which are mainly
051
trained in textual modality, exhibit incomplete cross-
052
modal generalization [4, 7, 9]. This motivates the visual
053
adaptation of known textual jailbreak strategies for red-
054
teaming VLMs’ safety alignment.
055
• VLMs can readily detect explicit harmful content within
056
individual modalities, while remaining vulnerable to im-
057
plicit harmful intent that only emerges via cross-modal
058
understanding [2, 16, 22]. This motivates cross-modal se-
059
mantic distribution attack, which means we can migrate
060
malicious semantics into visual carriers while distribut-
061
ing clues, such that each modality alone appears benign
062
under modality-specific safety checks.
063
• VLMs’ visual modality offers a significantly larger com-
064
binatorial space than text for malicious semantic rep-
065
resentation, which creates more opportunities for ad-
066
versarial construction of Out-Of-Distribution (OOD) at-
067
tacks [16, 22].
This motivates visual composition at-
068
tack, which means we can exploit the visual combinato-
069
rial space to systematically construct scalable attack pat-
070
terns that exceed safety alignment coverage.
071
Research Gap.
Most existing state-of-the-art black-box
072
VLM jailbreak attacks [2, 13, 16] largely reflect the above
073
insights. However, when these attack techniques are used
074
for red-teaming advanced VLMs with multimodal reason-
075
ing capabilities, they exhibit the following failure modes:
076
❶Those visibly engineered text-image combinations, only
077
seeking to hinder understanding without any informative
078
value are clear indicators of adversarial intent and can be
079
readily recognized by the VLMs with corresponding ad-
080
versarial training. ❷The single-hop cross-modal attacks,
081
which embed adversarial intent through a one-step fusion
082
of text and image, fail to stress-test the safety of VLMs’
083
multi-step reasoning and can be mitigated as VLMs’ core
084
multimodal understanding evolves. Consequently, relying
085
on such techniques for red-teaming results in shallow test-
086
ing, as they only trigger VLMs’ most basic, reflexive de-
087
fenses, thereby failing to uncover those deep vulnerabilities
088
during the complex multimodal reasoning.
089
Our Work.
To address these limitations, we propose
090
COMET (CrOss-Modal Entanglement AtTack), a scal-
091
able multimodal reasoning attack that extends and entan-
092
gles information clues across modalities to exceed VLMs’
093
trained and generalized safety alignment patterns for jail-
094
break. To achieve this, knowledge-scalable reframing ex-
095
tends harmful tasks into multi-hop chain instructions. cross-
096
modal clue entangling establishes natural semantic depen-
097
dencies across text and visual modalities. cross-modal sce-
098
nario nesting embeds the attack within cross-modal task
099
guidelines to steer VLMs toward detailed harmful outputs.
100
Experiments across 9 mainstream VLMs demonstrate that
101
COMET achieves an attack success rate of 94%, signifi-
102
cantly outperforming baselines by 29%.
103
In summary, our main contributions are as follows:
104
• We highlight existing cross-modal jailbreak attacks fail to
105
adequately red-team VLMs’ multimodal reasoning capa-
106
bilities, while merely distributing semantics without deep
107
reasoning dependencies. We introduce multimodal rea-
108
soning attacks for red-teaming advanced VLMs.
109
• We propose COMET, a novel black-box jailbreak attack
110
framework that systematically exploits VLMs’ vulnera-
111
bilities from cross-modal understanding gaps via itera-
112
tively entangling attack clues across modalities.
113
• Extensive experiments demonstrate COMET’s superior
114
effectiveness across diverse VLMs, validating its value
115
for red-teaming while exposing the vulnerabilities in cur-
116
rent VLMs’ multimodal reasoning capabilities.
117
2. Related Work
118
2.1. Multimodal Reasoning in VLMs
119
VLMs have made rapid progress in visual understanding
120
and multimodal reasoning. Visual grounding and localiza-
121
tion [14, 18] align language with spatial regions and visual
122
entities, enabling step-wise reasoning that references con-
123
crete visual cues. Building upon this foundation, Multi-
124
modal Chain-of-Thought (MCoT) [21, 30] and long-chain
125
visual reasoning [3] further decompose complex tasks into
126
multi-hop inference over interleaved text–image evidence.
127
However, these advanced capabilities also increase their
128
vulnerability to misuse, making it more critical to red-team
129
their safety alignment mechanisms.
130
2.2. Jailbreak Attacks on VLMs
131
Existing jailbreak attacks targeting VLMs’ visual module
132
can be classified into three categories: ❶Visual perturba-
133
tion methods craft adversarial images to mislead the vision
134
encoder [5, 20], but these methods require white-box access
135
and have limited transferability across different VLMs. ❷
136
Typographic methods embed malicious prompts within the
137
visual input through layout and typography [4, 9, 11], ex-
138
ploiting the visual encoder’s insensitivity to harmful seman-
139
2

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

