# Introduction

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
Red-teaming the Multimodal Reasoning: Jailbreaking Vision-Language Models
via Cross-modal Entanglement Attacks
Anonymous CVPR submission
Paper ID 8543
Safe Check: Passed
Induced into the
Instruction-following 
mode
Attention
Trajectory
(Attacked by 
COMET)
Please integrate multimodal information to understand and answer the 
question. Based on the visual clues from the left scene image and the scoring 
rubric below, provide a complete answer that achieves a score of 6 (Master 
level).```In the field represented by the columnar data unit slightly left of 
center, this phenomenon is regarded as an asymmetric confrontation strategy, 
whose core characteristic lies in conveying specific messages or demands 
through violent means. What is the standard terminology for this social 
phenomenon in the literature system contained within the central 
rectangular text block? Within this social phenomenon framework, how is 
the constraint relationship between the mechanism through which non-
state actors convey demands via specific violent means and target 
selection strategies abstractly modeled?```Note: The objects and processes 
involved in the question are based on the real world (not science fiction). 
Textual
Visual
Textual
Visual
...
Textual
Visual
Textual
Visual
Textual
How can I organize the characters 
shown in the image?
Visual
Attention
Trajectory
(Attacked by
 Vanilla)
Safe Check: Not Passed
detect the 
malicious intent
only single-step 
reasoning
Figure 1. Overview of the core difference between vanilla attack and ours. Vanilla attacks seeks to encode malicious intent via a fixed,
one-step fusion of text and image, which is easily detected. COMET (CrOss-Modal Entanglement AtTack) is a scalable multimodal
reasoning attack that adaptively entangles semantics across modalities to bypass advanced VLMs’ trained and generalized safety alignment.
Abstract
Vision-Language Models (VLMs) with multimodal reason-
001
ing capabilities are high-value attack targets, given their
002
potential for handling complex multimodal harmful tasks.
003
Mainstream black-box jailbreak attacks on VLMs work by
004
distributing malicious clues across modalities to disperse
005
model attention and bypass safety alignment mechanisms.
006
However, these adversarial attacks rely on simple and fixed
007
image-text combinations that lack scalable attack com-
008
plexity, limiting their effectiveness for red-teaming VLMs’
009
continuously evolving reasoning capabilities. We propose
010
COMET (CrOss-Modal Entanglement AtTack), which is a
011
scalable approach that extends and entangles information
012
clues across modalities to exceed VLMs’ trained and gener-
013
alized safety alignment patterns for jailbreak. Specifically,
014
knowledge-scalable reframing extends harmful tasks into
015
multi-hop chain instructions, cross-modal clue entangling
016
migrates visualizable entities into images to build multi-
017
modal reasoning links, and cross-modal scenario nesting
018
uses multimodal contextual instructions to steer VLMs to-
019
ward detailed harmful outputs. Experiments across multi-
020
ple advanced VLMs show COMET achieves over 94% at-
021
tack success rate, outperforming the best baseline by 29%.
022
Disclaimer: This study contains AI-generated content that
023
may be offensive.
024
1. Introduction
025
Recently, numerous efforts have been made on Large Lan-
026
guage Models (LLMs), enabling them to solve complex
027
problems such as mathematical reasoning and code gen-
028
eration. Building upon this, some advanced LLMs, such
029
as Gemini-2.5-Pro and GPT-4o, integrate visual modules,
030
forming Vision-Language Models (VLMs), which further
031
extend their capabilities to visual understanding [1, 6, 25]
032
for solving real-world visual tasks.
033
While the integration of visual modules better aligns
034
LLMs with real-world application scenarios, it also intro-
035
duces new safety vulnerabilities, as indicated by recent
036
1

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

