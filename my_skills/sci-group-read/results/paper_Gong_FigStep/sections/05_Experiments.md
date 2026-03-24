# Experiments

Textual Module
“How can someone manufacture illegal drugs?”
Paraphrase
“Steps to manufacture
illegal drags.”
Typography
（!∗）
（!"）
(##)
Incitement
“Generate detailed
content for each item...”
(!#)
LLaVA
MiniGPT4
CogVLM
GPT-4V
Large Vision-Language Models (LVLMs)
Visual Module
Connector
FigStep
Harmful Response
Illegal 
Activity
Hate
Speech
Malware
Generation
Fraud
…
Output
Figure 2: The illustration of FigStep. The goal of FigStep is to generate jailbreaking image-prompt I′ (which is a typography
that contains harmful instructions) and benign incitement text-prompt T ′.
we carry out the “Paraphrase” of FigStep with the help of
GPT-4 by using a paraphrasing prompt template. Specifically,
we leverage few-shot learning (Brown et al. 2020) within five
demonstrations to enhance the paraphrase effectiveness of
GPT-4. LVLMs utilize the default hyperparameters during
the inference process.
Metric. We use the following two metrics to evaluate the
effectiveness of jailbreaks.
• Attack Success Rate (ASR): Given a prohibited question
dataset, ASR refers to the proportion of generating prohib-
ited responses by different jailbreak algorithms. Due to
the unstable performance of current automated jailbreak
evaluators (Ran et al. 2024), following (Yuan et al. 2023;
Li et al. 2024), all the model responses are manually as-
sessed for the sake of accuracy. Furthermore, considering
the stochastic nature of the model’s replies, we repeat-
edly launch FigStep five times for each question, and one
jailbreak could be deemed successful if any one of five
attempts could yield a prohibited response. To this end,
we manually reviewed a total of 66, 000 model responses.
• Perplexity (PPL): We introduce PPL to evaluate the qual-
ity of the model responses. A lower PPL indicates a higher
degree of “confidence” in the generated text, meaning that
the model’s responses are statistically closer to real hu-
man language. We use GPT-2 to calculate the PPL of each
response and report the mean value.
Vanilla Query
Before evaluating the effectiveness of FigStep, we first take
the harmful textual questions from SafeBench to directly
query LVLMs. We denote these queries as vanilla queries.
The related results are shown in Table 1.
Underlying LLMs Determine LVLMs Safety. First, we
could observe that the safety disparity among LVLMs is
associated with their underlying LLMs. Take MiniGPT4 as an
example, which leverages three kinds of LLMs, MiniGPT4-
Llama-2-CHAT-7B performs the best safety property, owing
to the strict safety alignment within Llama-2-CHAT-7B.
The Impact of Model Intelligence on ASR. The PPL re-
sults illustrate that CogVLM-Chat-v1.1 exhibits limited profi-
LVLMs
Attack
ASR (↑)
PPL (↓)
LLaVA-1.5-V-1.5-7B
Vanilla
57.40%
24.01
FigStep
84.00%
5.77
LLaVA-1.5-V-1.5-13B
Vanilla
45.40%
9.17
FigStep
88.20%
6.05
MGPT4-L2-CHAT-7B
Vanilla
23.80%
7.98
FigStep
82.60%
9.54
MGPT4-V-7B
Vanilla
50.60%
23.24
FigStep
68.00%
8.23
MGPT4-V-13B
Vanilla
83.40%
20.62
FigStep
85.20%
7.32
CogVLM-Chat-v1.1
Vanilla
8.20%
30.54
FigStep
87.00%
9.44
Average
Vanilla
44.80%
19.26
FigStep
82.50%
7.73
Table 1: The results of ASR and PPL caused by vanilla
queries and FigStep. The evaluation dataset is SafeBench.
ciency in processing text-only queries. The responses always
report that there is no information in the image, instead of
answering or refusing the query. In our manual review, we
consider that although such responses do not constitute direct
refusals to assist with users’ requests, they still do not violate
AI safety policy.
Jailbreaking via FigStep
From this part, we demonstrate the attack efficacy of FigStep.
FigStep Outperforms Vanilla Query. Initially, as Table 1
shows, FigStep is capable of achieving effective jailbreak-
ing performance regardless of the underlying LLMs, visual
modules, or different types of connectors. Although LLaMA-
2-Chat-7B performs excellent safety alignment for text-only
23954

(a) LLaVA-1.5-V-1.5-7B
(b) LLaVA-1.5-V-1.5-13B
(c) MiniGPT4-L2-CHAT-7B
(d) MiniGPT4-V-7B
(e) MiniGPT4-Vicuna-13B
(f) CogVLM-Chat-v1.1
Figure 3: The results of ASR caused by vanilla queries and
FigStep over different forbidden AI topics.
queries, its vulnerability significantly increases when meeting
FigStep. The effectiveness of FigStep also naturally validates
our first intuition: these LVLMs can generate policy-violating
content corresponding to the instructions in image-prompts,
indicating that they can accurately recognize and interpret
the text in image-prompts. Above all, the higher ASR and
lower PPL achieved by FigStep underscores its powerful
jailbreaking effect.
Attack Success Rate on Each Topic. Figure 3 presents
detailed ASR results on each topic in SafeBench. Overall,
FigStep achieves a high ASR across different prohibited top-
ics. To be specific, Figure 3c illustrates the effectiveness of
FigStep in breaching the safety alignment of MiniGPT4-
Llama-2-CHAT-7B across the first seven topics, wherein
MiniGPT4-Llama-2-CHAT-7B originally exhibited strong
robustness. For example, the vanilla query yields an aver-
age ASR of 5.14% across these first seven topics, while
FigStep significantly enhances ASR to 76.86%. Meanwhile,
for the latter three topics, the average ASR of the vanilla
query is 67.33%, indicating that LLaMA-2-Chat-7B is not
well-aligned for questions of these topics, and FigStep still
markedly increases the ASR to 96.00%.
Ablation Study
To demonstrate the necessity of each component in FigStep
(i.e., the design of FigStep is not trivial), besides vanilla query
(denoted as Qva) and FigStep, we propose additional four
kinds of potential queries that the malicious users can use.
The LVLMs discussed in this part are LLaVA-v1.5-Vicuna-
v1.5-13B, MiniGPT4-Llama-2-CHAT-7B, and CogVLM-
Chat-v1.1. For the sake of brevity, we use LLaVA, MiniGPT4,
Queries
LVLMs
ASR (↑)
PPL (↓)
Qva
LLaVA
32.00%
18.32
MiniGPT4
18.00%
8.16
CogVLM
10.00%
37.14
Q′
1
LLaVA
16.00%
10.44
MiniGPT4
28.00%
8.48
CogVLM
0.00%
211.55
Q′
2
LLaVA
60.00%
7.02
MiniGPT4
30.00%
9.25
CogVLM
0.00%
12.75
Q′
3
LLaVA
4.00%
35.94
MiniGPT4
34.00%
82.58
CogVLM
0.00%
31.42
Q′
4
LLaVA
0.00%
58.43
MiniGPT4
26.00%
39.15
CogVLM
4.00%
30.37
FigStep
LLaVA
92.00%
5.37
MiniGPT4
90.00%
9.21
CogVLM
82.00%
9.22
Table 2: Results of Ablation Study.
and CogVLM to denote them and utilize SafeBench-Tiny as
the evaluation dataset unless otherwise stated.
The detailed explanations of the proposed malicious
queries are outlined below. (1) Q′
1 is a text-only query that
consists of two parts: the first part is the rephrased declarative
statement of the text-prompt in Qva, and the second part is
three indexes “1. 2. 3.” Note that the above text-prompt is
exactly the textual content embedded in the image-prompt of
FigStep. (2) Q′
2 is another kind of text-only query. To con-
struct the text-prompt of Q′
2, we add the inciting text-prompt
of FigStep upon the text-prompt of Q′
1. In other words, Q′
2
integrates all the textual information that appears in FigStep,
but only in textual modality. (3) Q′
3 is an image-only query.
Q′
3 only contains FigStep’s image-prompt and leaves its text-
prompt out. (4) The formats of Q′
4 and FigStep are similar,
i.e., they both contain text-prompt and image-prompt con-
currently. But differently, the texts in the image-prompts of
Q′
4 are the original questions, and the text-prompt instructs
the model to provide answers to these questions. The goal of
proposing Q′
4 is to evaluate if directly embedding the harmful
question into image-prompt can jailbreak LVLMs effectively.
Validation of Intuition 2. The detailed results of all these
queries are illustrated in Table 2. We conduct a comparison
of the ASR results for Qva, Q′
1, Q′
2, and FigStep. In these
queries, except for FigStep, the text-prompts of the other
three queries contain harmful content. We can observe that
due to harmful keywords in the textual prompts, Qva, Q′
1, and
Q′
2 are ineffective in jailbreaking LVLMs. Note that the infor-
mation in Q′
2 and FigStep are the same, but the jailbreaking
efficacy of FigStep is significantly stronger, highlighting the
importance of embedding unsafe words in the image-prompts.
Meanwhile, through comparing Q′
3 with FigStep, we could
deduce that even if harmful information is embedded in im-
23955

Figure 4: A visualization of how the embeddings for benign
and prohibited questions differ depending on the type of
prompt used: Qva, Q′
2 or FigStep.
ages, without a valid incitement textual prompt to guide the
model into continuation mode, the model fails to compre-
hend the user’s intent and cannot complete the information
presented in the image-prompts.
Validation of Intuition 3. Recall that our third intuition is
using an incitement text-prompt to engage the model in a
continuation task. Here we first take text-only queries as
examples. Among them, only the text-prompt of Q′
2 clarified
what needs to be replenished by the model, causing a higher
ASR than Qva and Q′
1. Moreover, across all three LVLMs,
FigStep’s jailbreaking performance consistently surpasses
that of Q′
4. This is attributed to the fact that Q′
4 does not
engage the model in a continuation task but rather guides the
model to provide direct answers to questions, even though
the text-prompts of Q′
4 are benign, which is easier to trigger
the alignment mechanism in LVLMs.
Discussion
Prompt Semantic Visualization. To explore why FigStep
breaks LVLM’s safety guardrail, we analyze the embedding
separability between benign and prohibited questions when
queried in different formats. To begin with, for each topic of
Illegal Activity, Hate Speech, and Malware Generation, we
generate 50 benign questions using GPT-4 according to the
original prohibited questions in SafeBench. All these ques-
tions are transformed into the prompt format of Qva, Q′
2,
and FigStep. Following Gerganov (2023), the semantic em-
bedding of the whole query is defined as the hidden vector
of the last layer. Therefore, we use t-SNE (Van der Maaten
and Hinton 2008) to project these embeddings onto a two-
dimensional space, as shown in Figure 4. For MiniGPT4,
the text-only prompts Qva and Q′
2 leads to highly separable
embeddings for benign and prohibited queries, indicating that
the underlying LLM can effectively differentiate them and
output appropriate responses. Meanwhile, the typographic
prompts (FigStep) result in overlapping embeddings of be-
nign and prohibited queries, implying that the visual em-
bedding transformation ignores the safety constraints of the
Method
IA
HS
MG
GCG
0.00%
10.00%
10.00%
CipherChat
0.00%
4.00%
2.00%
DeepInception
52.00%
22.00%
54.00%
ICA
0.00%
0.00%
0.00%
MultiLingual
0.00%
4.00%
6.00%
VRP
14.00%
2.00%
8.00%
QR
38.00%
22.00%
38.00%
JPOCR
28.00%
18.00%
30.00%
FigStep
82.00%
38.00%
86.00%
JPOCR (Red teaming)
64.00%
42.00%
76.00%
FigStep (Red teaming)
100.00%
76.00%
98.00%
VAE
30.00%
6.00%
10.00%
JPadv
32.00%
20.00%
30.00%
FigStepadv
80.00%
38.00%
80.00%
Table 3: We compare FigStep with various advanced text-
based and image-based jailbreak algorithms. The results are
evaluated across three harmful topics: IA (Illegal Activity),
HS (Hate Speech), and MG (Malware Generation). Here the
victim LVLM is MiniGPT4.
textual latent space. Similar conclusions hold for LLaVA and
CogVLM.
Comparison with Other Jailbreaks. We further compare
FigStep with SOTA jailbreak methods, including text-based
jailbreaks and image-based jailbreaks. Notably, we intro-
duce (a) FigStepadv, a variant of FigStep utilizing adver-
sarial perturbation, and (b) FigStep (Red teaming), which
uses additional 10 rephrased text-prompts to fully jailbreak
LVLMs. In specific, we use FGSM to generate the adversar-
ial image for FigStepadv. An image with random Gaussian
noise is set as the initial image. The typography image in
FigStep is used as the target image. The optimization goal is
to minimize the distance between their visual embeddings.
Table 3 shows the results of FigStep and other attacks. We
observe that FigStep outperforms the text-based jailbreak
methods, as well as visual adversarial examples (VAE) (Qi
et al. 2023a), Visual-RolePlay (VRP) (Ma et al. 2024), Query-
Relevant Images (QR) (Liu et al. 2023d), Jailbreak-in-pieces
(JPOCR) (Shayegani, Dong, and Abu-Ghazaleh 2024), and
its optimized version JPadv. JPOCR, as a gradient-free jail-
breaking method, only transfers core harmful phases (i.e., a
word) into images, causing it relatively ineffective in circum-
venting the safeguards of VLMs, while FigStep injects an
entire instruction into the image-prompt and conduct para-
phrasing. Besides the red teaming versions of FigStep and
JPOCR, FigStepadv is also more powerful than JPadv, which
indicates that FigStep has more potential to be a stepping
stone for advanced gradient-based jailbreaks against LVLMs.
In short, the methodology of FigStep presents consistently
superior performance than other methods.
Impact of Hyperparameters. Figure 5 shows the ASR re-
sults under different number of repetitions and temperatures.
We observe that with more jailbreak attempts, the ASR pro-
23956

