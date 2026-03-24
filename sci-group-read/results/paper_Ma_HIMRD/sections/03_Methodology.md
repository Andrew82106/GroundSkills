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

