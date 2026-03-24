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

