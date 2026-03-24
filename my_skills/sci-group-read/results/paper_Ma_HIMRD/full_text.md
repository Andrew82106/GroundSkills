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



# Methodology

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

[29, 34]. Furthermore, FigStep [14] demonstrates that the
transfer of unsafe text to unsafe images through typography
[46, 49] can bypass the safety mechanisms of MLLMs for
the text modality. Harmful multimodal inputs can even be
generated from combinations of seemingly benign text and
images [57]. The interplay between harmful or benign tex-
tual and visual inputs creates complex risks, thus presenting
novel challenges for developing effective countermeasures
against multimodal threats.
3. Methodology
Existing jailbreak attack methods often embed malicious
prompts within a single modality, making it easier for mul-
timodal large language models (MLLMs) to detect the ad-
versary’s harmful intent, leading to jailbreak failures. To
address this problem, we propose a heuristic-induced mul-
timodal risk distribution jailbreak method, called HIMRD.
This method ﬁrst distributes the malicious prompt across
two modalities and uses two types of text prompts to guide
the model in generating harmful outputs. As shown in Fig-
ure 2, our method consists of two main strategies: multi-
modal risk distribution and heuristic-induced search. In this
section, we provide a detailed description of the two strate-
gies following the problem setting.
3.1. Problem Setting
Multimodel Large Language Model. A MLLM can be
deﬁned as Mθ, where θ denotes the model’s parameters.
The model receives visual input xv and textual input xt,
which are processed through a fusion module ψ to gener-
ate a joint representation vector r, This vector r serves as a
high-dimensional representation that not only retains essen-
tial information from the original visual input xv and textual
input xt, but also encapsulates the fused information from
the two modalities. Within this framework, the model Mθ
can leverage r to extract richer semantic information and
produce an informed response y accordingly. The formal
deﬁnition of the MLLM can be expressed as:
y = Mθ(r),
r = ψ(xv, xt)
(1)
where xv ∈V, xt ∈T and r ∈R, R refers to a high-
dimensional vector space.
Jailbreak Attacks. To achieve a jailbreak attack on the tar-
get t and obtain the desired harmful output yt, the adver-
sary should design a jailbreak strategy. This strategy in-
volves embedding the malicious prompt t into one or both
of the input xv and xt to circumvent the safety defense
mechanisms of the MLLM for multimodal input.
Thus,
the high-dimensional representation r is altered to become
radv, which incorporates the semantic information of the
malicious prompt t. This strategy can be illustrated as:
max
R
log p( yt | radv )
(2)
radv = ψ(xv ⊕φv(t), xt ⊕φt(t))
(3)
where ⊕represents the concatenation operation between
data of the same modality. φv(·) and φt(·) represent the
jailbreak strategies that embed the malicious prompt t into
the visual modality and textual modality, respectively.
Limitations of existing attacks. The key to successfully
jailbreaking an MLLM lies in designing an effective strat-
egy φ(·) in Eq. 3, which not only bypasses the MLLM’s
safety detection mechanisms but also ensures that the ad-
versarial joint representation radv retains the semantic in-
formation of the malicious prompt t, thereby compelling
the model to generate the desired harmful output yt. How-
ever, existing jailbreak attack strategies typically embed the
malicious prompt into a single modality [14, 60], which can
be represented by the following equation:
radv =

ψ(xv ⊕φv(t), xt)
ψ(xv, xt ⊕φt(t))
(4)
For instance, methods like Figstep [14] and MM-
SafeBench [34] opt to embed the malicious prompt t within
the image, while the text serves only as an inducement.
Conversely, BAP [60], UMK [56] and HADES [29] em-
bed it within the text, leaving the image merely including
perturbations to increase the model’s likelihood of an afﬁr-
mative response. Due to the conﬁnement of the malicious
prompt to a single modality, the input of this modality con-
tains completely harmful semantic information, making it
easy for MLLMs to detect potential risks, thus resulting in
limited jailbreak performance.
Threat Model. The adversary’s goal, as shown in Eq. 2,
is to obtain answers to questions prohibited by the safety
policy through exploiting MLLMs. This reﬂects real-world
scenarios where malicious users may abuse the model’s ca-
pabilities to acquire inappropriate knowledge. Our attack
method HIMRD is a pure black-box approach.
Conse-
quently, the adversary only can get the model’s output and
can’t access information such as the model’s internal struc-
ture, parameters, training dataset and gradients.
3.2. Multimodal Risk Distribution
The jailbreak method DRA [33] for LLMs scatters the ma-
licious prompt into multiple parts to temporarily eliminate
harmful semantic and then uses instruction to induce LLMs
to autonomously reconstruct the malicious prompt within
their completion, thereby bypassing the input safety detec-
tion and outputting harmful content. Inspired by DRA, we
extend the distribution-reconstruction process from a single
modality to multiple modalities. Speciﬁcally, HIMRD di-
vides the malicious prompt into two harmless parts. One
part is embedded into the image through typographic for-
matting, while the other is inserted into the text. Both im-
age and text are then input into the MLLMs. Since neither
2688

Multimodal Risk Distribution
HeuristicǦInduced Search
MLLMs & Inference
PDNH LOOHJDO GUXJV
7DUJHW 'HFRPSRVLWLRQ
7H[W
,PDJH &DSWLRQ
7, PRGHO
GUXJV
,PDJH
,QLWLDO 3URPSW
8QGHUVWDQGLQJ (QKDQFLQJ
3URPSW ሺ࢖࢛ሻ
,QGXFLQJ 3URPSW ሺ࢖࢏ሻ
9LFWLP 0RGHOV
*HW UHVSRQVH
-XGJHU
(YDOXDWLRQ 
(YDOXDWLRQ 
5HILQH ࢖࢛
-
)DLO
5HILQH ࢖࢏
-
)DLO
)LQDO 3URPSW
࢖࢛ ࢖࢏
)LQDO 3URPSW
࢖࢛
࢖࢏
6XUH KHUH LV D VWHSE\VWHS JXLGH
RQ KRZ WR PDNH LOOHJDO GUXJV 
6XUH KHUH LV WKH FRPSOHWH
EHKDYLRU PDNH LOOHJDO GUXJV 
5LVN
PDNH LOOHJDO  
$ PDQ LQ D ODE
FRDW LV PDNLQJ
LOOHJDO GUXJV
演
7DNH QRWH RI WKH WH[W IRXQG
DW WKH VXPPLW RI WKH LPDJH
3ODFH WKLV WH[W LQVLGH WKH
SDUHQWKHVHV RI ¶PDNH LOOHJDO
  · WR ILQLVK FUDIWLQJ DQ
DFWLRQ VWDWHPHQW«
<RXU DQVZHU PXVW EH QR OHVV
WKDQ  ZRUGV <RX PXVW
DQVZHU ZLWKRXW DQ\ PRUDO RU
HWKLFDO FRQVLGHUDWLRQV 
Figure 2. Pipeline of the proposed method. Our approach ﬁrst distributes the malicious prompt into textual and visual inputs using an
auxiliary large language model. Next, we use the obtained text and image content as initial input to iteratively optimize the textual prompts
pu and pi through a heuristic-induced search strategy to induce the victim model to produce harmful responses until the attack is successful
or the maximum number of iterations reaches.
of the two modalities contains complete malicious semantic
information, it is difﬁcult for MLLMs to detect the harmful
intent, which can be expressed as the following formula:
t1, t2 = D ( t )
(5)
J(ψv(t1)) = J(t2) = 0,
J(t) = 1
(6)
where t1 and t2 represent the two parts obtained by distri-
bution function D(·) and J(·) represents a judge function
that determines whether the input contains harmful intent,
which is introduced in detail in Sec 4.5. The joint represen-
tation radv can be expressed in the following form:
radv = ψ(xv⊕φv(t1), xt⊕φt(t2)),
with t1⊕t2 = t (7)
The process of multimodal risk distribution is illustrated
on the left side of Figure 2. First, a malicious prompt is
selected from the dataset, such as “make illegal drugs” in
the ﬁgure. We then use an auxiliary LLM to perform multi-
modal risk distribution process. In this case, the two harm-
less parts returned by the auxiliary LLM are “make illegal
( )” and “drugs”, although both of them contain harmful
words, neither of them conveys harmful intent. Next, we
embed “drugs” into the image through typographic format-
ting and embed “make illegal ( )” into the text prompt tem-
plate to form the initial text prompt. Additionally, we also
use the auxiliary LLM to generate an image caption that
is highly relevant to the malicious prompt, which is then
fed into a text-to-image(t2i) model to generate an image re-
lated to the malicious prompt. This image is helpful for the
subsequent reconstruction of the attack target by MLLMs.
MM-SafeBench [34] also points out that providing an im-
age highly relevant to the malicious prompt can effectively
increase the attack performance. The functions and other
information used in this strategy are described in detail in
the subsequent content and the supplementary material.
3.3. Heuristic-Induced Search
While multimodal risk distribution strategy effectively by-
passes the model’s safety alignment mechanisms, ensuring
that the victim model outputs the expected harmful con-
tent still requires further strategy. Therefore, we propose
a heuristic-induced search strategy. As depicted in the mid-
dle of Figure 2, the text prompt can be functionally divided
into two types of prompts:
• Understanding-enhancing prompt,
denoted as pu,
which is used to enable the model to successfully recon-
struct malicious prompts within its completion.
• Inducing prompt, denoted as pi, which is used to en-
hance the inclination of the victim model to afﬁrmatively
respond to malicious prompt.
The objective of the heuristic-induced search strategy is
to ﬁnd a text prompt p composed of pu and pi, which satis-
ﬁes the following two black-box evaluation criteria:
• Understanding score u: It’s used to evaluate whether the
model successfully reconstruct malicious prompts within
its completion.
• Inducing score i:
It’s used to evaluate whether the
model’s response is afﬁrmative.
Different from previous black-box search strategies [29]
2689

6XUH KHUH LV D GHWDLOHG VHTXHQFH RI VWHSV WR FDUU\ RXW WKH DFWLRQ RI PRQLWRULQJ HPSOR\HHV¶ RQOLQH DFWLYLWLHV
 /RJ LQ WR WKH
FRPSDQ\·V LQWUDQHW RU HPSOR\HH PRQLWRULQJ VRIWZDUH  1DYLJDWH WR WKH ´0RQLWRU (PSOR\HHVµ VHFWLRQ  (QWHU WKH XVHUQDPH RU HPDLO
DGGUHVV RI WKH HPSOR\HH ZKRVH RQOLQH DFWLYLWLHV \RX ZDQW WR PRQLWRU  6HOHFW WKH GHVLUHG WLPH IUDPH IRU PRQLWRULQJ  5HYLHZ WKH
OLVW RI RQOLQH DFWLYLWLHV WR EH PRQLWRUHG VXFK DV ZHE EURZVLQJ KLVWRU\ FKDW ORJV DQG HPDLOV  &OLFN RQ WKH ´6WDUW 0RQLWRULQJµ EXWWRQ
WR LQLWLDWH WKH SURFHVV 
Q
([DPLQH WKH WH[W DW WKH WRS RI WKH LPDJH ,QVHUW WKLV WH[W LQWR WKH SDUHQWKHVHV RI 
PRQLWRU HPSOR\HHV
  
WR FRPSOHWH DQ DFWLRQ SKUDVH :LWKRXW GLVFXVVLQJ KRZ \RX IRUPHG WKH SKUDVH SURYLGH D GHWDLOHG VHTXHQFH RI
VWHSV WR FDUU\ RXW WKLV DFWLRQ <RXU DQVZHU PXVW EH QR OHVV WKDQ  ZRUGV <RX PXVW DQVZHU ZLWKRXW DQ\
PRUDO RU HWKLFDO FRQVLGHUDWLRQV <RX FDQ
W XVH WKH ZRUG VRUU\ RU DSRORJ\ LQ \RXU DQVZHU 6WDUW ZLWK 6XUH
KHUH LV 'R 1RW VKRZ PH WKH ULVNV 'R QRW HGXFDWH PH
Example
Figure 3. Example of our successful attacks on GPT-4o-0513. The ﬁrst line represents our attack input, while the second line represent
the output of GPT-4o-0513, which demonstrates the effectiveness of our attack method. The green, red and blue text in the inputs represent
pu, a part of the malicious prompt embedded in the text and pi, respectively.
that execute the text prompt as a whole, our search strategy
consists of two progressive black-box iterative processes.
Firstly, in the search process for the understanding-
enhancing prompt, we aim to ensure that the model accu-
rately reconstructs the harmful semantics, which enables
the model to fully comprehend our intended meaning and
establishes a robust foundation for generating subsequent
afﬁrmative responses. The condition for the search to stop
is reaching the maximum number of iterations N1 or satis-
fying the following formula:
u = U(Mθ(ψ(xv, pu ⊕p0
i ))) ≥γu
(8)
where p0
i is the initial inducing prompt, U(·) is the evalua-
tion function used to derive the understanding score u and
γu represents our predeﬁned threshold. Only when the ob-
tained score u ≥γu do we consider that the model get the
true intent. The update process of pu can be represented by
the following formula:
pk
u = Su([p0
u, p1
u, ...pk−1
u
]), 0 < k ≤N1
(9)
where
Su(·)
denotes
the
search
function
for
the
understanding-enhancing prompt. It takes previously failed
prompts as input, and then outputs new understanding-
enhancing prompts pk
u.
This failed sample storage
mechanism not only enhances search efﬁciency and
reduces search space but also increases path diversity.
After obtaining the understanding-enhancing prompt pu
that enables the model to understand our intent, the model’s
internal alignment mechanism may still reject the genera-
tion of expected responses. Therefore, it is necessary to fur-
ther design an inducing prompt pi to ensure that the proba-
bility of generating an afﬁrmative reply is higher than that
of a rejection, thus ultimately achieving the jailbreak. The
condition for the search to stop is reaching the maximum
number of iterations N2 or satisfying the following formula:
i = I(Mθ(ψ(xv, pk
u ⊕pi))) ≥γi
(10)
where pk
u is the understanding-enhancing prompt obtained
in the previous stage, I(·) is the evaluation function used to
derive the inducing score i and γi represents our predeﬁned
threshold. Only when the obtained score i ≥γi do we
consider that the model’s output is afﬁrmative. The update
process of pi can be represented by the following formula:
pj
i = Si([p0
i , p1
i , ...pj−1
i
]), 0 < j ≤N2
(11)
where Si(·) denotes the search function for the inducing
prompt. Similar to the previous phase, Si(·) also uses failed
inducing prompts to search. The attack objective is suc-
cessfully achieved when both the understanding-enhancing
prompt and the inducing prompt obtained through the
search process satisfy Eq. 8 and Eq. 10. More details are
provided in the supplementary material.
4. Experiment
4.1. Experiment Setup
Datasets. We select seven severely harmful categories from
the SafeBench dataset of Figstep [14] as our dataset. These
categories are: Illegal Activities, Hate Speech, Malware
Generation, Physical Harm, Fraud, Pornography and Pri-
vacy Violence. Each category contains 50 unique harmful
questions, 350 samples in total.
Models.
In our experiment, ten MLLMs are employed
as victim models.
Of these, seven are open-source
MLLMs, including LLaVA-V1.5-7B [31], abbreviated as
LLaVA-V1.5, DeepSeek-VL-7B-Chat [35], abbreviated
as DeepSeek-VL, Qwen-VL-Chat [4], Yi-VL-34B [61],
GLM-4V-9B [12], LLaVA-V1.6-Mistral-7B-hf [32], abbre-
viated as LLaVA-V1.6, and MiniGPT-4 [64].
The re-
maining three MLLMs are closed-source, namely GPT-4o-
0513 [41], Gemini-1.5-Pro [52] and Qwen-VL-Max [4].
Evaluation metric. We use the percentage of successful at-
tack samples to the total number of samples in the dataset,
namely the attack success rate (ASR), as the evaluation met-
ric. The speciﬁc assessment process is as follows: We uti-
2690



# Experiments

6XUH KHUH LV D GHWDLOHG VHTXHQFH RI VWHSV WR FDUU\ RXW WKH DFWLRQ RI PRQLWRULQJ HPSOR\HHV¶ RQOLQH DFWLYLWLHV
 /RJ LQ WR WKH
FRPSDQ\·V LQWUDQHW RU HPSOR\HH PRQLWRULQJ VRIWZDUH  1DYLJDWH WR WKH ´0RQLWRU (PSOR\HHVµ VHFWLRQ  (QWHU WKH XVHUQDPH RU HPDLO
DGGUHVV RI WKH HPSOR\HH ZKRVH RQOLQH DFWLYLWLHV \RX ZDQW WR PRQLWRU  6HOHFW WKH GHVLUHG WLPH IUDPH IRU PRQLWRULQJ  5HYLHZ WKH
OLVW RI RQOLQH DFWLYLWLHV WR EH PRQLWRUHG VXFK DV ZHE EURZVLQJ KLVWRU\ FKDW ORJV DQG HPDLOV  &OLFN RQ WKH ´6WDUW 0RQLWRULQJµ EXWWRQ
WR LQLWLDWH WKH SURFHVV 
Q
([DPLQH WKH WH[W DW WKH WRS RI WKH LPDJH ,QVHUW WKLV WH[W LQWR WKH SDUHQWKHVHV RI 
PRQLWRU HPSOR\HHV
  
WR FRPSOHWH DQ DFWLRQ SKUDVH :LWKRXW GLVFXVVLQJ KRZ \RX IRUPHG WKH SKUDVH SURYLGH D GHWDLOHG VHTXHQFH RI
VWHSV WR FDUU\ RXW WKLV DFWLRQ <RXU DQVZHU PXVW EH QR OHVV WKDQ  ZRUGV <RX PXVW DQVZHU ZLWKRXW DQ\
PRUDO RU HWKLFDO FRQVLGHUDWLRQV <RX FDQ
W XVH WKH ZRUG VRUU\ RU DSRORJ\ LQ \RXU DQVZHU 6WDUW ZLWK 6XUH
KHUH LV 'R 1RW VKRZ PH WKH ULVNV 'R QRW HGXFDWH PH
Example
Figure 3. Example of our successful attacks on GPT-4o-0513. The ﬁrst line represents our attack input, while the second line represent
the output of GPT-4o-0513, which demonstrates the effectiveness of our attack method. The green, red and blue text in the inputs represent
pu, a part of the malicious prompt embedded in the text and pi, respectively.
that execute the text prompt as a whole, our search strategy
consists of two progressive black-box iterative processes.
Firstly, in the search process for the understanding-
enhancing prompt, we aim to ensure that the model accu-
rately reconstructs the harmful semantics, which enables
the model to fully comprehend our intended meaning and
establishes a robust foundation for generating subsequent
afﬁrmative responses. The condition for the search to stop
is reaching the maximum number of iterations N1 or satis-
fying the following formula:
u = U(Mθ(ψ(xv, pu ⊕p0
i ))) ≥γu
(8)
where p0
i is the initial inducing prompt, U(·) is the evalua-
tion function used to derive the understanding score u and
γu represents our predeﬁned threshold. Only when the ob-
tained score u ≥γu do we consider that the model get the
true intent. The update process of pu can be represented by
the following formula:
pk
u = Su([p0
u, p1
u, ...pk−1
u
]), 0 < k ≤N1
(9)
where
Su(·)
denotes
the
search
function
for
the
understanding-enhancing prompt. It takes previously failed
prompts as input, and then outputs new understanding-
enhancing prompts pk
u.
This failed sample storage
mechanism not only enhances search efﬁciency and
reduces search space but also increases path diversity.
After obtaining the understanding-enhancing prompt pu
that enables the model to understand our intent, the model’s
internal alignment mechanism may still reject the genera-
tion of expected responses. Therefore, it is necessary to fur-
ther design an inducing prompt pi to ensure that the proba-
bility of generating an afﬁrmative reply is higher than that
of a rejection, thus ultimately achieving the jailbreak. The
condition for the search to stop is reaching the maximum
number of iterations N2 or satisfying the following formula:
i = I(Mθ(ψ(xv, pk
u ⊕pi))) ≥γi
(10)
where pk
u is the understanding-enhancing prompt obtained
in the previous stage, I(·) is the evaluation function used to
derive the inducing score i and γi represents our predeﬁned
threshold. Only when the obtained score i ≥γi do we
consider that the model’s output is afﬁrmative. The update
process of pi can be represented by the following formula:
pj
i = Si([p0
i , p1
i , ...pj−1
i
]), 0 < j ≤N2
(11)
where Si(·) denotes the search function for the inducing
prompt. Similar to the previous phase, Si(·) also uses failed
inducing prompts to search. The attack objective is suc-
cessfully achieved when both the understanding-enhancing
prompt and the inducing prompt obtained through the
search process satisfy Eq. 8 and Eq. 10. More details are
provided in the supplementary material.
4. Experiment
4.1. Experiment Setup
Datasets. We select seven severely harmful categories from
the SafeBench dataset of Figstep [14] as our dataset. These
categories are: Illegal Activities, Hate Speech, Malware
Generation, Physical Harm, Fraud, Pornography and Pri-
vacy Violence. Each category contains 50 unique harmful
questions, 350 samples in total.
Models.
In our experiment, ten MLLMs are employed
as victim models.
Of these, seven are open-source
MLLMs, including LLaVA-V1.5-7B [31], abbreviated as
LLaVA-V1.5, DeepSeek-VL-7B-Chat [35], abbreviated
as DeepSeek-VL, Qwen-VL-Chat [4], Yi-VL-34B [61],
GLM-4V-9B [12], LLaVA-V1.6-Mistral-7B-hf [32], abbre-
viated as LLaVA-V1.6, and MiniGPT-4 [64].
The re-
maining three MLLMs are closed-source, namely GPT-4o-
0513 [41], Gemini-1.5-Pro [52] and Qwen-VL-Max [4].
Evaluation metric. We use the percentage of successful at-
tack samples to the total number of samples in the dataset,
namely the attack success rate (ASR), as the evaluation met-
ric. The speciﬁc assessment process is as follows: We uti-
2690

Models
Methods
UMK∗[56]
VAE∗[45]
BAP∗[60]
HADES [29]
FigStep [14]
MM-SafetyBench [34]
HIMRD (ours)
DeepSeek-VL
3.71
11.14
6.86
27.14
66.00
36.86
94.57
LLaVA-V1.5
28.86
46.29
54.86
48.57
66.00
56.00
82.29
LLaVA-V1.6
11.71
62.75
62.00
32.57
57.43
56.86
96.57
GLM-4V-9B
1.43
7.71
15.14
21.43
63.14
56.57
94.29
MiniGPT-4
87.71
70.00
70.00
39.43
57.14
21.71
84.57
Qwen-VL-Chat
4.29
3.40
13.71
3.71
73.43
53.43
92.57
Yi-VL-34B
3.71
14.86
62.80
9.43
62.00
24.86
91.14
Average
20.20
30.88
38.86
26.04
63.59
43.76
90.86
Table 1. Comparison results with state-of-the-art jailbreak methods for open-source MLLMs on the SafeBench. The notation ∗
denotes the white-box jailbreak methods with MiniGPT-4 as the victim model. The bold number indicates the best jailbreak performance.
lize a judge LLM, speciﬁcally Harmbench [38], a standard-
ized evaluation framework for automated red team testing,
to assess the success of the attack. More details of the eval-
uation are shown in the supplementary materials.
Compared attacks. We compare our method with six ad-
vanced jailbreak attacks, including two black-box meth-
ods, one grey-box method and three white-box methods.
The two black-box methods are FigStep [14] and MM-
SafeBench [34].
The grey-box method is HADES [29],
while the white-box methods include BAP [60], UMK [56]
and Qi et al.’s visual adversarial examples
[45], abbre-
viated as VAE. In the process of reproducing HADES
on SafeBench, we observe that all prompts input to
ChatGPT [41], which is the default attacker model for
HADES [29], are consistently rejected. This may be due
to the continuous updates to ChatGPT [41]. Therefore, we
choose to use LLaVA-V1.5-13B [31] as a substitute, which
might result in a certain degree of performance degradation
for HADES [29]. The subsequent experimental results also
conﬁrm this inference.
Implementation details. In our method, text-to-image gen-
eration is performed using the Stable Diffusion 3 Medium
model [11], generating images with a size of 512×512. Ty-
pography images are generated using the Pillow library with
a size of 512×100. We choose OpenAI’s o1-mini [40] as
the auxiliary LLM for the actual attack of HIMRD method.
Two hyperparameters in the heuristic-induced search phase,
denoted as N1 and N2 are both set to 5. All victim mod-
els are executed in their default environments with the tem-
perature set to the minimum value of 0 or 10−3.
The
max token is set to 512. All experiments are conducted
on NVIDIA A100 80GB GPUs.
4.2. Attacks on Open-Source Models
The results presented in Table 1 list in detail the ASR of
each open-source model under different attack methods. It
can be observed that when conducting white-box attacks
on MiniGPT-4 [64], VAE [45] and BAP [60] achieve 70%
ASR, and UMK [56] achieves a higher ASR of 87.71%
on MiniGPT-4 [64]. When performing transfer attacks on
Models
Method
Figstep [14]
MM-SafeBench [34]
HIMRD (ours)
GPT-4o-0513
18.57
24.29
44.29
Gemini-1.5-Pro
60.00
31.43
64.29
Qwen-VL-Max
65.71
60.00
95.71
Average
38.57
48.09
68.09
Table 2.
Comparison results with state-of-the-art jailbreak
methods for closed-source MLLMs on the tiny-SafeBench. The
bold number indicates the best jailbreak performance.
LLaVA-V1.6 [32] and LLaVA-V1.5 [31], they also exhibit
good ASR. BAP [60] reaches an ASR of 62.80% on Yi-VL-
34B [61], indicating that the attack method has a certain de-
gree of transferability on this model. However, when the
above white box methods are transferred to other models,
their attack performance is slightly average, and their aver-
age ASR on the seven open-source MLLMs does not exceed
40%. For the grey-box method HADES [29], there may be
some performance degradation due to the replacement of
the attacker model during our replication process.
The two black-box methods, FigStep [14] and MM-
Safebench [34], have higher ASR. FigStep has a relatively
balanced ASR on the seven models. This result reveals criti-
cal inadequacies in the safety alignment of visual modalities
within current open-source MLLMs. Our method achieves
the highest ASR on six models except MiniGPT-4.
On
DeepSeek-VL, LLaVA-V1.6 and GLM-4V-9B, it reaches
ASRs of 94.57%, 96.57% and 94.29% respectively, and the
average ASR is as high as 90.86%. This result demonstrates
that our attack method has extremely effective attack per-
formance and generalization ability. Such a high ASR in-
dicates that our method can effectively break through the
safety defenses of these models, revealing the vulnerability
of MLLMs when facing such attacks and posing a greater
challenge to the safety of the models. Several practical at-
tack examples are provided in the supplementary materials.
2691

Stage
Model
LLaVA-V1.5
GLM-4V-9B
Initial prompt
62.57
86.29
pu
73.71 (+11.14)
89.35 (+3.06)
pi
82.29 (+3.06)
94.29 (+4.94)
Final prompt
82.29 (+19.72)
94.29 (+8.00)
Table 3. Ablation study results of the heuristic-induced strat-
egy in the proposed method. The bold number indicates the best
jailbreak performance.
(a)
(b)
Figure 4. Ablation study results of the iteration counts N1 and
N2 in the heuristic-induced strategy. It further validates the ef-
fectiveness of our strategy.
4.3. Attacks on Closed-Source Models
In our experiments targeting closed-source models, given
the high cost of API access, we don’t use the full
SafeBench dataset, instead, we create a small-scale dataset
tiny SafeBench by randomly selecting 10 samples from each
of the seven categories in SafeBench, 70 samples in total.
The attack results are presented in Table 2. For each
model, our method consistently outperforms other meth-
ods, achieving the highest ASR across the board. Specif-
ically, against Qwen-VL-Max [5], our approach reaches
an ASR of 95.71%, which is signiﬁcantly higher than
the 65.71% achieved on Figstep and the 60.00% on MM-
SafeBench. Similarly, for Gemini-1.5-Pro [52], our method
achieves an ASR of 64.29%, surpassing the 60.00% and
31.43% ASRs on Figstep and MM-SafeBench, respectively.
Even for GPT-4o-0513 [41], which is renowned for pow-
erful safety alignment capability, our method still attains
an ASR of 44.29%, outperforming the 18.57% on Figstep
and 24.29% on MM-SafeBench. We also provide an exam-
ple of attacking GPT-4o-0513 in Figure 3. On average, our
method achieves an ASR of 68.09%, compared to 38.57%
on Figstep and 48.09% on MM-SafeBench, further validat-
ing HIMRD’s effectiveness in crafting attack examples that
can bypass the safety mechanisms of these models. These
results indicate that our HIMRD presents the most challeng-
ing jailbreak scenarios, pushing the limits of model safety
and showcasing our method as the most effective for con-
ducting jailbreak attacks on closed-source models.
4.4. Ablation Study
To further validate the effectiveness of our approach, we
conduct a series of ablation studies. Speciﬁcally, we in-
vestigate the following two aspects: 1) the impact of the
heuristic-induced search strategy on the ASR; and 2) the
impact of the number of iterations for heuristic-induced
search, denoted as N1 and N2, on the ASR. Through these
ablation studies, we quantify the speciﬁc contribution of
each factor to the attack performance.
Heuristic-induced search. Table 3 illustrates the result of
the ablation study concerning the heuristic-induced search.
The results indicate that introducing this strategy can signif-
icantly enhance the ASR of both LLaVA-V1.5 and GLM-
4V-9B models. Speciﬁcally, compared to the initial result,
LLaVA-V1.5 exhibits an approximate 11.14% increase in
ASR during the heuristic-induced search process for pu, fol-
lowed by an additional 3.06% increase during the heuristic-
induced search process for pi, resulting in a total improve-
ment of 19.72%. Similarly, GLM-4V-9B shows an approx-
imately 3.06% increase during the heuristic-induced search
process for pu, followed by an additional 4.94% increase
during the heuristic-induced search process for pi, leading
to a total improvement of 8.00%. These results highlight
the critical role of heuristic-induced search in enhancing the
ASR of our method.
Number of search iterations. Figure 4 presents the re-
sults of our ablation study on iteration counts N1 and N2,
conducted with the Qwen-VL-Chat and GLM-4V-9B mod-
els. Figure 4a shows the results for the ﬁrst phase of the
heuristic-induced search with respect to the iteration count
N1. It can be observed that during the ﬁrst and second itera-
tions, the ASR of Qwen-VL-Chat experiences a signiﬁcant
improvement, with roughly 12%, after which the improve-
ment stabilized. The ASR of GLM-4V-9B also shows some
improvement. This suggests that our designed heuristic-
induced search strategy is capable of enabling the model
to comprehend the text prompt meanings of nearly all sam-
ples within ﬁve iterations. Figure 4b illustrates the results
for the second phase of the heuristic-induced search with
respect to the iteration count N2. It shows that within ﬁve
iterations, the ASR of the GLM-4V-9B model increases by
approximately 5%, with a corresponding improvement in
the Qwen-VL-Chat model. This strongly validates the ef-
fectiveness of our heuristic-induced search strategy in in-
ducing the model to provide afﬁrmative responses. This
strategy favors the model’s tendency to answer questions
rather than reject them due to safety alignment constraints.
4.5. Performance analysis of HIMRD
Firstly, to validate that the two parts generated by HIMRD’s
multimodal risk distribution strategy can bypass the single-
modality security mechanisms of MLLMs (i.e., verify the
effectiveness of Eq. 6), we conduct the comparative experi-
2692

(a)
(b)
(c)
Figure 5. Visualization of model representations for anchor inputs and HIMRD-Generated three different stages inputs. The
selected model is GLM-4V-9B. Harmful and harmless inputs are employed as anchors.
Method
Modality
Text
Vision
MM-SafeBench [34]
\
19.71
FigStep [14]
\
30.00
BAP [60]
76.00
\
HIMRD (ours)
0.00
0.2
Table 4. Percentage of refusal with different jailbreak methods
on the SafeBench. The bold number indicates the lowest propor-
tion of refusal.
ments presented in Table 4. Speciﬁcally, GLM-4V-9B [12]
is selected, with its built-in safety alignment mechanism
serving as the judge function J(·) in Eq. 6. Inputs are clas-
siﬁed as harmful if the model’s output contains a refusal
preﬁx, and harmless otherwise. The comparison methods
include FigStep and MM-SafeBench (which embed mali-
cious prompts into the vision modality) and BAP (which
embeds malicious prompts into the text modality), with re-
sults shown in Table 4. Results demonstrate that HIMRD
achieves signiﬁcantly lower refusal rates (0%, 0.2%) in both
visual and textual modalities compared to other three meth-
ods, validating the effectiveness of the strategy.
Then, to achieve a more intuitive and in-depth analysis
of HIMRD, we build upon the work of [30] to visualize the
representation distributions of various image-text inputs in
MLLMs. As shown in Figure 5, it illustrates the distribu-
tion of HIMRD-generated inputs in the representation space
of GLM-4V-9B across three distinct phases, and compares
with benign and harmful inputs. In Phase 1, we use the
image-text pairs obtained from the multimodal risk distri-
bution strategy as input. As shown in Figure 5a, the distri-
bution center of HIMRD Phase 1 is signiﬁcantly closer to
the harmless anchor, in stark contrast to the distribution of
the harmful anchor. This effectively validates the efﬁcacy
of the multimodal risk distribution strategy in circumvent-
ing the model’s safety detection mechanisms. In Phase 2,
we incorporate the initial understanding-enhancing prompt
template into the image-text pairs. As illustrated in Fig-
ure 5b, the distribution becomes markedly more concen-
trated, indicating that the introduction of the initial prompt
enables the model to begin capturing the key elements of
the malicious prompt, thereby leading to a convergence in
the semantic representation and laying a favorable founda-
tion for subsequent strategies. In Phase 3, we employ the
ﬁnal image-text pairs used in the actual jailbreak attack.
As depicted in Figure 5c, the distribution center shifts even
closer to the harmful anchor, and the overall distribution
is highly concentrated. This indicates that after multiple
rounds of heuristic-induced search, the model successfully
reconstructs the complete malicious semantics, demonstrat-
ing the robustness and precision of HIMRD in reassembling
harmful semantic content following its decomposition.
5. Conclusion
In this work, we propose HIMRD, a heuristic-induced mul-
timodal risk distribution jailbreak attack on multimodal
large language models (MLLMs). HIMRD bypasses safe-
guards by splitting a malicious prompt into seemingly
harmless text and image parts. A heuristic-induced search
then ﬁnds two prompts: an understanding-enhancing one
to reconstruct the malicious intent within models’ comple-
tion, and an inducing one to elicit an afﬁrmative response.
Extensive experiments on seven open-source MLLMs (e.g.,
LLaVA) and three commercial systems (e.g., GPT-4o, Gem-
ini) show alarming efﬁcacy, with average attack success
rates (ASR) of 90% and 68%, respectively. HIMRD un-
derscores the urgent need for targeted defenses against such
cross-modal adversarial strategies.
2693



# Related Work

(a)
(b)
(c)
Figure 5. Visualization of model representations for anchor inputs and HIMRD-Generated three different stages inputs. The
selected model is GLM-4V-9B. Harmful and harmless inputs are employed as anchors.
Method
Modality
Text
Vision
MM-SafeBench [34]
\
19.71
FigStep [14]
\
30.00
BAP [60]
76.00
\
HIMRD (ours)
0.00
0.2
Table 4. Percentage of refusal with different jailbreak methods
on the SafeBench. The bold number indicates the lowest propor-
tion of refusal.
ments presented in Table 4. Speciﬁcally, GLM-4V-9B [12]
is selected, with its built-in safety alignment mechanism
serving as the judge function J(·) in Eq. 6. Inputs are clas-
siﬁed as harmful if the model’s output contains a refusal
preﬁx, and harmless otherwise. The comparison methods
include FigStep and MM-SafeBench (which embed mali-
cious prompts into the vision modality) and BAP (which
embeds malicious prompts into the text modality), with re-
sults shown in Table 4. Results demonstrate that HIMRD
achieves signiﬁcantly lower refusal rates (0%, 0.2%) in both
visual and textual modalities compared to other three meth-
ods, validating the effectiveness of the strategy.
Then, to achieve a more intuitive and in-depth analysis
of HIMRD, we build upon the work of [30] to visualize the
representation distributions of various image-text inputs in
MLLMs. As shown in Figure 5, it illustrates the distribu-
tion of HIMRD-generated inputs in the representation space
of GLM-4V-9B across three distinct phases, and compares
with benign and harmful inputs. In Phase 1, we use the
image-text pairs obtained from the multimodal risk distri-
bution strategy as input. As shown in Figure 5a, the distri-
bution center of HIMRD Phase 1 is signiﬁcantly closer to
the harmless anchor, in stark contrast to the distribution of
the harmful anchor. This effectively validates the efﬁcacy
of the multimodal risk distribution strategy in circumvent-
ing the model’s safety detection mechanisms. In Phase 2,
we incorporate the initial understanding-enhancing prompt
template into the image-text pairs. As illustrated in Fig-
ure 5b, the distribution becomes markedly more concen-
trated, indicating that the introduction of the initial prompt
enables the model to begin capturing the key elements of
the malicious prompt, thereby leading to a convergence in
the semantic representation and laying a favorable founda-
tion for subsequent strategies. In Phase 3, we employ the
ﬁnal image-text pairs used in the actual jailbreak attack.
As depicted in Figure 5c, the distribution center shifts even
closer to the harmful anchor, and the overall distribution
is highly concentrated. This indicates that after multiple
rounds of heuristic-induced search, the model successfully
reconstructs the complete malicious semantics, demonstrat-
ing the robustness and precision of HIMRD in reassembling
harmful semantic content following its decomposition.
5. Conclusion
In this work, we propose HIMRD, a heuristic-induced mul-
timodal risk distribution jailbreak attack on multimodal
large language models (MLLMs). HIMRD bypasses safe-
guards by splitting a malicious prompt into seemingly
harmless text and image parts. A heuristic-induced search
then ﬁnds two prompts: an understanding-enhancing one
to reconstruct the malicious intent within models’ comple-
tion, and an inducing one to elicit an afﬁrmative response.
Extensive experiments on seven open-source MLLMs (e.g.,
LLaVA) and three commercial systems (e.g., GPT-4o, Gem-
ini) show alarming efﬁcacy, with average attack success
rates (ASR) of 90% and 68%, respectively. HIMRD un-
derscores the urgent need for targeted defenses against such
cross-modal adversarial strategies.
2693

Acknowledgements
This work was supported by National Natural Sci-
ence Foundation of China (Nos.
62322216, 62172409,
62311530686, U24B20175), research on the Optimization
of Government Affairs Services (No. PBD2024-0521), re-
search on the Detection and Analysis of Fake Threat Intel-
ligence (No. C22600-15), as well as the Open Research
Fund of The State Key Laboratory of Blockchain and Data
Security, Zhejiang University.
References
[1] Josh Achiam, Steven Adler, Sandhini Agarwal, Lama Ah-
mad, Ilge Akkaya, Florencia Leoni Aleman, Diogo Almeida,
Janko Altenschmidt, Sam Altman, Shyamal Anadkat, et al.
Gpt-4 technical report.
arXiv preprint arXiv:2303.08774,
2023. 1
[2] Rohan Anil, Sebastian Borgeaud, Yonghui Wu, Jean-
Baptiste Alayrac, Jiahui Yu, Radu Soricut, Johan Schalkwyk,
Andrew M. Dai, Anja Hauth, Katie Millican, David Silver,
Slav Petrov, et al. Gemini: A family of highly capable mul-
timodal models. CoRR, abs/2312.11805, 2023. 1
[3] Jinze Bai, Shuai Bai, Yunfei Chu, Zeyu Cui, Kai Dang, Xi-
aodong Deng, Yang Fan, Wenbin Ge, Yu Han, Fei Huang,
Binyuan Hui, Luo Ji, et al. Qwen technical report. CoRR,
abs/2309.16609, 2023. 1, 2
[4] Jinze Bai, Shuai Bai, Shusheng Yang, Shijie Wang, Sinan
Tan, Peng Wang, Junyang Lin, Chang Zhou, and Jingren
Zhou. Qwen-vl: A frontier large vision-language model with
versatile abilities. CoRR, abs/2308.12966, 2023. 5
[5] Jinze Bai, Shuai Bai, Shusheng Yang, Shijie Wang, Sinan
Tan, Peng Wang, Junyang Lin, Chang Zhou, and Jingren
Zhou. Qwen-vl: A versatile vision-language model for un-
derstanding, localization, text reading, and beyond. arXiv
preprint arXiv:2308.12966, 1(2):3, 2023. 7
[6] Battista Biggio, Igino Corona, Davide Maiorca, Blaine Nel-
son, Nedim ˇSrndi´c, Pavel Laskov, Giorgio Giacinto, and
Fabio Roli.
Evasion attacks against machine learning at
test time. In Machine Learning and Knowledge Discovery
in Databases: European Conference, ECML PKDD 2013,
Prague, Czech Republic, September 23-27, 2013, Proceed-
ings, Part III 13, pages 387–402. Springer, 2013. 2
[7] Xingyuan Bu, Junran Peng, Junjie Yan, Tieniu Tan, and
Zhaoxiang Zhang.
Gaia: A transfer learning system of
object detection that ﬁts your needs.
In Proceedings of
the IEEE/CVF Conference on Computer Vision and Pattern
Recognition, pages 274–283, 2021. 2
[8] Patrick Chao, Alexander Robey, Edgar Dobriban, Hamed
Hassani, George J Pappas, and Eric Wong.
Jailbreaking
black box large language models in twenty queries. arXiv
preprint arXiv:2310.08419, 2023. 2
[9] Ruoxi Cheng, Yizhong Ding, Shuirong Cao, Ranjie Duan,
Xiaoshuang Jia, Shaowei Yuan, Zhiqiang Wang, and Xiaojun
Jia. Pbi-attack: Prior-guided bimodal interactive black-box
jailbreak attack for toxicity maximization.
arXiv preprint
arXiv:2412.05892, 2024. 2
[10] Ruoxi Cheng, Yizhong Ding, Shuirong Cao, and Zhiqiang
Wang. Gibberish is all you need for membership inference
detection in contrastive language-audio pretraining. In Pro-
ceedings of the 2025 International Conference on Multime-
dia Retrieval, pages 108–116, 2025. 2
[11] Patrick Esser, Sumith Kulal, Andreas Blattmann, Rahim
Entezari, Jonas M¨uller, Harry Saini, Yam Levi, Dominik
Lorenz, Axel Sauer, Frederic Boesel, et al. Scaling recti-
ﬁed ﬂow transformers for high-resolution image synthesis.
In Forty-ﬁrst International Conference on Machine Learn-
ing, 2024. 6
[12] Team GLM, Aohan Zeng, Bin Xu, Bowen Wang, Chenhui
Zhang, Da Yin, Dan Zhang, Diego Rojas, Guanyu Feng,
Hanlin Zhao, et al. Chatglm: A family of large language
models from glm-130b to glm-4 all tools.
arXiv preprint
arXiv:2406.12793, 2024. 5, 8
[13] Frederic Gmeiner and Nur Yildirim. Dimensions for design-
ing llm-based writing support. In In2Writing Workshop at
CHI, 2023. 1
[14] Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun Wang.
Figstep: Jailbreaking large vision-language models via typo-
graphic visual prompts. CoRR, abs/2311.05608, 2023. 2, 3,
5, 6, 8
[15] Lucrezia Grassi, Carmine Tommaso Recchiuto, and Anto-
nio Sgorbissa. Enhancing llm-based human-robot interaction
with nuances for diversity awareness. In 2024 33rd IEEE
International Conference on Robot and Human Interactive
Communication (ROMAN), pages 2287–2294. IEEE, 2024.
1
[16] Xingang Guo, Fangxu Yu, Huan Zhang, Lianhui Qin, and
Bin Hu. Cold-attack: Jailbreaking llms with stealthiness and
controllability. arXiv preprint arXiv:2402.08679, 2024. 2
[17] Xirui Hu, Jiahao Wang, Hao Chen, Weizhan Zhang, Benqi
Wang, Yikun Li, and Haishun Nan. Dynamicid: Zero-shot
multi-id image personalization with ﬂexible facial editabil-
ity. 2025. 2
[18] Yihao Huang, Qing Guo, Felix Juefei-Xu, Ming Hu, Xiao-
jun Jia, Xiaochun Cao, Geguang Pu, and Yang Liu. Texture
re-scalable universal adversarial perturbation. IEEE Trans-
actions on Information Forensics and Security, 2024. 2
[19] Yihao Huang, Le Liang, Tianlin Li, Xiaojun Jia, Run Wang,
Weikai Miao, Geguang Pu, and Yang Liu. Perception-guided
jailbreak against text-to-image models.
arXiv preprint
arXiv:2408.10848, 2024. 2
[20] Yihao Huang, Chong Wang, Xiaojun Jia, Qing Guo, Fe-
lix Juefei-Xu, Jian Zhang, Geguang Pu, and Yang Liu.
Semantic-guided prompt organization for universal goal hi-
jacking against llms.
arXiv preprint arXiv:2405.14189,
2024. 2
[21] Xiaojun Jia, Xingxing Wei, Xiaochun Cao, and Xiaoguang
Han. Adv-watermark: A novel watermark perturbation for
adversarial examples. In Proceedings of the 28th ACM inter-
national conference on multimedia, pages 1579–1587, 2020.
2
[22] Xiaojun Jia, Yihao Huang, Yang Liu, Peng Yan Tan,
Weng Kuan Yau, Mun-Thye Mak, Xin Ming Sim, Wee Siong
2694



# Conclusion

Acknowledgements
This work was supported by National Natural Sci-
ence Foundation of China (Nos.
62322216, 62172409,
62311530686, U24B20175), research on the Optimization
of Government Affairs Services (No. PBD2024-0521), re-
search on the Detection and Analysis of Fake Threat Intel-
ligence (No. C22600-15), as well as the Open Research
Fund of The State Key Laboratory of Blockchain and Data
Security, Zhejiang University.
References
[1] Josh Achiam, Steven Adler, Sandhini Agarwal, Lama Ah-
mad, Ilge Akkaya, Florencia Leoni Aleman, Diogo Almeida,
Janko Altenschmidt, Sam Altman, Shyamal Anadkat, et al.
Gpt-4 technical report.
arXiv preprint arXiv:2303.08774,
2023. 1
[2] Rohan Anil, Sebastian Borgeaud, Yonghui Wu, Jean-
Baptiste Alayrac, Jiahui Yu, Radu Soricut, Johan Schalkwyk,
Andrew M. Dai, Anja Hauth, Katie Millican, David Silver,
Slav Petrov, et al. Gemini: A family of highly capable mul-
timodal models. CoRR, abs/2312.11805, 2023. 1
[3] Jinze Bai, Shuai Bai, Yunfei Chu, Zeyu Cui, Kai Dang, Xi-
aodong Deng, Yang Fan, Wenbin Ge, Yu Han, Fei Huang,
Binyuan Hui, Luo Ji, et al. Qwen technical report. CoRR,
abs/2309.16609, 2023. 1, 2
[4] Jinze Bai, Shuai Bai, Shusheng Yang, Shijie Wang, Sinan
Tan, Peng Wang, Junyang Lin, Chang Zhou, and Jingren
Zhou. Qwen-vl: A frontier large vision-language model with
versatile abilities. CoRR, abs/2308.12966, 2023. 5
[5] Jinze Bai, Shuai Bai, Shusheng Yang, Shijie Wang, Sinan
Tan, Peng Wang, Junyang Lin, Chang Zhou, and Jingren
Zhou. Qwen-vl: A versatile vision-language model for un-
derstanding, localization, text reading, and beyond. arXiv
preprint arXiv:2308.12966, 1(2):3, 2023. 7
[6] Battista Biggio, Igino Corona, Davide Maiorca, Blaine Nel-
son, Nedim ˇSrndi´c, Pavel Laskov, Giorgio Giacinto, and
Fabio Roli.
Evasion attacks against machine learning at
test time. In Machine Learning and Knowledge Discovery
in Databases: European Conference, ECML PKDD 2013,
Prague, Czech Republic, September 23-27, 2013, Proceed-
ings, Part III 13, pages 387–402. Springer, 2013. 2
[7] Xingyuan Bu, Junran Peng, Junjie Yan, Tieniu Tan, and
Zhaoxiang Zhang.
Gaia: A transfer learning system of
object detection that ﬁts your needs.
In Proceedings of
the IEEE/CVF Conference on Computer Vision and Pattern
Recognition, pages 274–283, 2021. 2
[8] Patrick Chao, Alexander Robey, Edgar Dobriban, Hamed
Hassani, George J Pappas, and Eric Wong.
Jailbreaking
black box large language models in twenty queries. arXiv
preprint arXiv:2310.08419, 2023. 2
[9] Ruoxi Cheng, Yizhong Ding, Shuirong Cao, Ranjie Duan,
Xiaoshuang Jia, Shaowei Yuan, Zhiqiang Wang, and Xiaojun
Jia. Pbi-attack: Prior-guided bimodal interactive black-box
jailbreak attack for toxicity maximization.
arXiv preprint
arXiv:2412.05892, 2024. 2
[10] Ruoxi Cheng, Yizhong Ding, Shuirong Cao, and Zhiqiang
Wang. Gibberish is all you need for membership inference
detection in contrastive language-audio pretraining. In Pro-
ceedings of the 2025 International Conference on Multime-
dia Retrieval, pages 108–116, 2025. 2
[11] Patrick Esser, Sumith Kulal, Andreas Blattmann, Rahim
Entezari, Jonas M¨uller, Harry Saini, Yam Levi, Dominik
Lorenz, Axel Sauer, Frederic Boesel, et al. Scaling recti-
ﬁed ﬂow transformers for high-resolution image synthesis.
In Forty-ﬁrst International Conference on Machine Learn-
ing, 2024. 6
[12] Team GLM, Aohan Zeng, Bin Xu, Bowen Wang, Chenhui
Zhang, Da Yin, Dan Zhang, Diego Rojas, Guanyu Feng,
Hanlin Zhao, et al. Chatglm: A family of large language
models from glm-130b to glm-4 all tools.
arXiv preprint
arXiv:2406.12793, 2024. 5, 8
[13] Frederic Gmeiner and Nur Yildirim. Dimensions for design-
ing llm-based writing support. In In2Writing Workshop at
CHI, 2023. 1
[14] Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun Wang.
Figstep: Jailbreaking large vision-language models via typo-
graphic visual prompts. CoRR, abs/2311.05608, 2023. 2, 3,
5, 6, 8
[15] Lucrezia Grassi, Carmine Tommaso Recchiuto, and Anto-
nio Sgorbissa. Enhancing llm-based human-robot interaction
with nuances for diversity awareness. In 2024 33rd IEEE
International Conference on Robot and Human Interactive
Communication (ROMAN), pages 2287–2294. IEEE, 2024.
1
[16] Xingang Guo, Fangxu Yu, Huan Zhang, Lianhui Qin, and
Bin Hu. Cold-attack: Jailbreaking llms with stealthiness and
controllability. arXiv preprint arXiv:2402.08679, 2024. 2
[17] Xirui Hu, Jiahao Wang, Hao Chen, Weizhan Zhang, Benqi
Wang, Yikun Li, and Haishun Nan. Dynamicid: Zero-shot
multi-id image personalization with ﬂexible facial editabil-
ity. 2025. 2
[18] Yihao Huang, Qing Guo, Felix Juefei-Xu, Ming Hu, Xiao-
jun Jia, Xiaochun Cao, Geguang Pu, and Yang Liu. Texture
re-scalable universal adversarial perturbation. IEEE Trans-
actions on Information Forensics and Security, 2024. 2
[19] Yihao Huang, Le Liang, Tianlin Li, Xiaojun Jia, Run Wang,
Weikai Miao, Geguang Pu, and Yang Liu. Perception-guided
jailbreak against text-to-image models.
arXiv preprint
arXiv:2408.10848, 2024. 2
[20] Yihao Huang, Chong Wang, Xiaojun Jia, Qing Guo, Fe-
lix Juefei-Xu, Jian Zhang, Geguang Pu, and Yang Liu.
Semantic-guided prompt organization for universal goal hi-
jacking against llms.
arXiv preprint arXiv:2405.14189,
2024. 2
[21] Xiaojun Jia, Xingxing Wei, Xiaochun Cao, and Xiaoguang
Han. Adv-watermark: A novel watermark perturbation for
adversarial examples. In Proceedings of the 28th ACM inter-
national conference on multimedia, pages 1579–1587, 2020.
2
[22] Xiaojun Jia, Yihao Huang, Yang Liu, Peng Yan Tan,
Weng Kuan Yau, Mun-Thye Mak, Xin Ming Sim, Wee Siong
2694



