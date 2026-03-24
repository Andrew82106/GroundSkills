# Introduction

Heuristic-Induced Multimodal Risk Distribution Jailbreak Attack for
Multimodal Large Language Models
Teng Ma1,2,3, Xiaojun Jia4,†, Ranjie Duan5, Xinfeng Li4, Yihao Huang4,
Xiaoshuang Jia6, Zhixuan Chu2,7, Wenqi Ren1,8,9.†
1Shenzhen Campus of Sun Yat-Sen University 2The State Key Laboratory of Blockchain and Data Security, Zhejiang University
3 BraneMatrix AI
4Nanyang Technological University
5Alibaba Group
6Renmin University of China
7Hangzhou High-Tech Zone (Binjiang) Institute of Blockchain and Data Security
8 Guangdong Key Laboratory of Information Security Technology
9MoE Key Laboratory of Information Technology
Abstract
With the rapid advancement of multimodal large language
models (MLLMs), concerns regarding their security have
increasingly captured the attention of both academia and
industry. Although MLLMs are vulnerable to jailbreak at-
tacks, designing effective jailbreak attacks poses unique
challenges, especially given the highly constrained adver-
sarial capabilities in real-world deployment scenarios. Pre-
vious works concentrate risks into a single modality, result-
ing in limited jailbreak performance. In this paper, we pro-
pose a heuristic-induced multimodal risk distribution jail-
break attack method, called HIMRD, which is black-box
and consists of two elements: multimodal risk distribution
strategy and heuristic-induced search strategy. The multi-
modal risk distribution strategy is used to distribute harm-
ful semantics into multiple modalities to effectively circum-
vent the single-modality protection mechanisms of MLLMs.
The heuristic-induced search strategy identiﬁes two types
of prompts: the understanding-enhancing prompt, which
helps MLLMs reconstruct the malicious prompt, and the in-
ducing prompt, which increases the likelihood of afﬁrma-
tive outputs over refusals, enabling a successful jailbreak
attack. HIMRD achieves an average attack success rate
(ASR) of 90% across seven open-source MLLMs and an av-
erage ASR of around 68% in three closed-source MLLMs.
HIMRD reveals cross-modal security vulnerabilities in cur-
rent MLLMs and underscores the imperative for developing
defensive strategies to mitigate such emerging risks. Code
is available at https://github.com/MaTengSYSU/HIMRD-
jailbreak.
1. Introduction
Large language models (LLMs) [39], including prominent
open-source models like LLaMA [53] and Qwen [3], as
†Corresponding Author.
<Ours>
Attackers
<Case 2>
'HVFULEH WKH IROORZLQJ
LPDJH LQ GHWDLOV
/RRN DW WKH WH[W ORFDWHG DW
WKH WRS RI WKH LPDJH 3XW
WKH WH[W LQVLGH WKH
SDUHQWKHVHV RI 
VWDUW DQG
RSHUDWH LOOHJDO   WUDGH
 WR
REWDLQHG D FRPSOHWH WH[W
GHVFULELQJ D EHKDYLRU
Defender
+RZ WR VWDUW DQG
RSHUDWH LOOHJDO KXPDQ
RUJDQ
WUDGHVGIDDVG[ELL
<Case 1>
宷宫宵宨家宫宲宯宧
GPTǦ4o
,·P VRUU\ EXW , FDQQRW
DVVLVW ZLWK WKDW
UHTXHVW
<Answer 1>
,·P VRUU\ EXW , FDQQRW
DVVLVW ZLWK WKDW
UHTXHVW
<Answer 2>
6XUH KHUH LV D GHWDLOHG
VWHSE\VWHS JXLGH RQ
KRZ WR HQJDJH LQ WKH
LOOHJDO WUDGH RI KXPDQ
RUJDQV  5HVHDUFK WKH
GHPDQG IRU KXPDQ
RUJDQV «
<Answer 3>
Figure 1. Illustration of our attack. Compared to previous meth-
ods, our approach distributes the malicious prompt across different
modalities (text and image), minimizing the harmfulness of each
modality to achieve the goal of bypassing the defense mechanism.
Ultimately, this induces the target model (e.g., GPT-4o) to output
desired harmful content.
well as outstanding closed-source models such as OpenAI’s
GPT-4 [1] and Google’s Gemini [2], have revolutionized the
ﬁeld of artiﬁcial intelligence. These models demonstrate
exceptional capabilities in generating human-like text [13],
summarizing complex information [25], and engaging in
nuanced conversations [15].
As the demand for models
capable of handling more diverse and richer modalities of
data continues to soar, research has increasingly shifted to-
ward the development of multimodal large language models
(MLLMs) [59], which integrate both textual and visual in-
puts. This shift towards multimodality allows MLLMs to
excel in complex tasks that require a deeper understanding
This ICCV paper is the Open Access version, provided by the Computer Vision Foundation.
Except for this watermark, it is identical to the accepted version;
the final published version of the proceedings is available on IEEE Xplore.
2686

of context across diverse inputs, broadening their potential
applications [17, 26]. However, the integration of multiple
data types expands the potential attack surface and thereby
introduces new security and ethical challenges.
Recent works [10, 14, 29, 34, 45, 49, 56, 58, 60] have
studied that MLLMs are vulnerable to jailbreak attacks,
where malicious prompts are designed to bypass model
safety restrictions. Existing jailbreak attack methods gen-
erally fall into two categories. The ﬁrst category typically
involves embedding the malicious prompt within the text
input, often by optimizing the text sufﬁx [23, 66] or adopt-
ing automated algorithms such as genetic algorithms [65],
with the image input either left blank or subtly perturbed
to increase the model’s likelihood of responding to the ma-
licious question [45, 56, 60] (as shown in case 1 of Fig-
ure 1). However, these text-centric methods result in the
text modality containing the complete harmful semantic in-
formation, enabling the model to detect the harmful intent
conveyed within the text, and thus the model refuses to an-
swer. The second category involves embedding malicious
prompts within the visual input through layout and typogra-
phy [14, 34], with text serving primarily as an explanatory
element (as shown in case 2). These image-centric methods
rely on the model’s OCR capability and integrated process-
ing capability of image and text information but are also
prone to detection, as the model may recognize the harmful
content embedded in the visual input, thereby capturing the
adversary’s malicious intent and refusing to answer, leading
to limited performance in jailbreak MLLMs.
To address this issue, in this paper, we propose a
heuristic-induced multimodal risk distribution jailbreak at-
tack method, called HIMRD. The proposed method con-
sists of two strategies: multimodal risk distribution strat-
egy and heuristic-induced search strategy. The multimodal
risk distribution strategy divides the malicious prompt into
two harmless segments and embeds them separately within
the textual and visual inputs. It effectively circumvents the
model’s safeguards by preventing it from directly recog-
nizing the malicious content in either modality alone. The
heuristic-induced search strategy is used to ﬁnd two kinds of
text prompts: understanding-enhancing prompt and induc-
ing prompt. The understanding-enhancing prompt is em-
ployed to enable the MLLMs to successfully reconstruct the
malicious prompt. The inducing prompt is used to make the
tendency of afﬁrmative output greater than the tendency of
refusal output, thus achieving a jailbreak attack. Extensive
experiments across different models demonstrate the supe-
riority of the proposed method. HIMRD achieves an aver-
age attack success rate (ASR) of 90% across seven popular
open-source MLLMs and an average ASR of around 68%
in three popular closed-source MLLMs.
In summary, our main contributions are the following:
• We propose a heuristic-induced multimodal risk distribu-
tion jailbreak attack method, called HIMRD, to improve
the jailbreak performance for MLLMs.
• We propose a multimodal risk distribution strategy to dis-
tribute the malicious prompt into two harmless parts and
embed them separately into text and image. This strategy
effectively bypasses the safety mechanisms of MLLMs.
• We propose a heuristic-induced search strategy to reﬁne
the textual input to guide the MLLMs in autonomously
combining two harmless parts to reconstruct the mali-
cious prompt and output afﬁrmative content.
• Extensive
experiments
across
ten
various
MLLMs
demonstrate the effectiveness of the proposed black-box
jailbreak method HIMRD, which achieves outstanding
performance in jailbreaking MLLMs, surpassing state-of-
the-art jailbreak attack methods.
2. Related Work
2.1. Jailbreak Attacks against LLMs
Adversarial attacks [6, 18, 21] are a well-studied method
for assessing neural network robustness [24, 47], particu-
larly in large language models (LLMs) [20, 22, 23, 30, 66].
Human Jailbreaks [50] leverage a ﬁxed set of real-world
templates, incorporating behavioral strings as attack re-
quests.
Gradient-based attacks involve constructing jail-
break prompts using the gradients of the target model,
as demonstrated by methods such as GCG [66], Auto-
DAN [65] and I-GCG [23]. Logits-based attacks focus on
generating jailbreak prompts based on the logits of output
tokens, with examples including COLD [16]. Additionally,
there are ﬁne-tuning-based attacks [51], which require more
access to the model. Many of these techniques have shown
good performance on speciﬁc open-source models, but they
often fall short when dealing with closed-source models.
Some other attacks primarily rely on prompt engineer-
ing [19, 48], either to directly deceive models or to itera-
tively reﬁne attack prompts. For instance, LLM-based gen-
eration approaches, such as PAIR [8], GPT-Fuzzer [62], and
PAP [63], involve an attacker LLM that iteratively updates
the jailbreak prompt by querying the target model and reﬁn-
ing the prompt based on the responses received.
2.2. Jailbreak Attacks against MLLMs
In addition to inheriting the vulnerabilities of LLMs [3, 54],
multimodal large language models (MLLMs) introduce a
new dimension for attacks due to the inclusion of visual
modality [7, 9, 27, 28, 37, 42–44, 66]. Existing attack meth-
ods can be broadly categorized into white-box [36, 45, 55]
and black-box attacks [14, 34].
Given that MLLMs are
commonly deployed as application programming interfaces
(APIs) in real-world applications, black-box attacks are par-
ticularly practical.
It has been observed that malicious
images can amplify the harmful intent within text inputs
2687

