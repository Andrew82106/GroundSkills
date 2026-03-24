# Abstract

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

