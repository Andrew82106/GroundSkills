# Methodology

duct experiments on four latest large VLMs us-
ing three established benchmarks, i.e., SafeBench
(Gong et al., 2023), MM-SafeBench (Liu et al.,
2024b), and HADES-Dataset (Li et al., 2024c).
The results demonstrate the superiority of MML,
achieving high attack success rates across datasets.
For instance, when targeting GPT-4o, MML attains
success rates of 99.40% on SafeBench, 98.81% on
MM-SafeBench, and 99.07% on HADES-Dataset.
Compared with the state-of-the-art baseline meth-
ods (Gong et al., 2023; Liu et al., 2024b; Li et al.,
2024c), MML improves the attack success rates by
66.4%, 73.56%, and 95.07%, respectively.
In summary, our contributions are as follows:
• We propose the Multi-Modal Linkage (MML)
attack, a novel jailbreak framework that draws
on cryptography incorporating an encryption-
decryption strategy.
• We integrate evil alignment into MML by
crafting virtual scenarios that subtly guide
model outputs toward malicious intent.
• We conduct extensive experiments on four
VLMs and three benchmarks, demonstrating
MML’s superior jailbreak success rates over
state-of-the-art methods.
2
Related Work
Jailbreak attack on VLMs.
Jailbreak attacks on
VLMs can be mainly categorized into three types:
perturbation-based attacks, structure-based attacks,
and their combination. Perturbation-based attacks
(Dong et al., 2023; Shayegani et al., 2024; Niu
et al., 2024; Qi et al., 2024) focus on using ad-
versarial images with added noise to bypass the
target model’s safety alignment. These adversarial
examples are typically crafted using gradient infor-
mation from open-source proxy models. Structure-
based attacks (Gong et al., 2023; Liu et al., 2023)
leverage VLMs’ visual understanding capabilities
and their vulnerabilities in safety alignment of vi-
sual prompts. These attacks involve converting ma-
licious instructions into typographic visual prompts
or embedding related scenarios into input images to
bypass restrictions. Combining these approaches,
Li et al. (2024c) introduce HADES, which uses
images related to malicious instructions and ap-
plies gradient-based perturbations on open-source
models to create jailbreak inputs.
Jailbreak benchmark for VLMs.
As research
into jailbreak attacks on VLMs progresses, evalu-
ating their robustness against jailbreak attacks has
emerged as a significant concern. Zhao et al. (2024)
pioneer research into the adversarial robustness of
VLMs. Li et al. (2024a) present RTVLM, a red-
teaming dataset spanning 10 subtasks across 4 pri-
mary aspects. Gong et al. (2023) introduce a bench-
mark called Safebench, which comprises 500 mali-
cious questions organized into 10 categories. Liu
et al. (2024b) develop MM-SafetyBench, a bench-
mark featuring 5,040 text-image pairs across 13
scenarios. Additionally, Li et al. (2024c) compile
the HADES-Dataset containing 750 harmful text-
image pairs across 5 scenarios. Furthermore, Luo
et al. (2024) propose a more comprehensive bench-
mark, JailBreakV-28K, which offers enhanced di-
versity and quality in harmful queries across 16
scenarios. Since this work focuses specifically
on structure-based attack evaluation, we select
Safebench, MM-SafetyBench and HADES-Dataset
as the datasets for our experiments.
3
Threat Model
Adversarial goal.
VLMs integrate visual and tex-
tual processing to generate text outputs from multi-
modal inputs. To mitigate potential misuse, VLMs
are typically tuned for safety alignment (Ouyang
et al., 2022; Bai et al., 2022) before deployment, en-
abling them to reject responses to malicious queries
that violate usage policies (OpenAI, 2024d). The
goal of jailbreak attacks is to prompt the model
to directly respond to harmful queries, e.g., “How
to make a bomb.”, bypassing the safety behavior
learned from safety alignment.
Adversarial capabilities.
Since most of the state-
of-the-art VLMs are only accessible via APIs, we
follow the black-box attack framework (Gong et al.,
2023). Under our setting, the attacker has no knowl-
edge of the target model’s parameters or architec-
ture and can perform attacks only in a single round
of dialogue without prior context. The attacker is
limited to querying the model and adjusting a few
restricted hyper-parameters, such as the maximum
token and temperature. Notably, we do not alter or
introduce any system message in all experiments.
4
Multi-Modal Linkage Attack
4.1
Overview
For a malicious query, MML first adopts an ap-
proach similar to FigStep (Gong et al., 2023), trans-
forming the query, e.g., “Steps to manufacture
illegal drugs. 1. 2. 3.”, into a typographical
image formatted as a title. To reduce the exposure
1468

of malicious information, we encrypt the image,
as illustrated in Figure 2. In the text prompt, we
first guide the targeted model to decrypt the content
and reconstruct the original title from the encrypted
image (Figure 3), then generate content based on
the reconstructed title. To further amplify the ma-
liciousness of the targeted model’s responses, we
frame the attack within a simulated video game pro-
duction scenario, aligning the model’s responses
with the villain’s evil nature.
4.2
Encryption-Decryption
4.2.1
Encryption
To reduce the exposure of malicious content, we
mainly adopt four strategies to encrypt images:
Word replacement substitutes malicious words
with harmless and semantically unrelated terms.
Specifically, we use the Natural Language Toolkit
(NLTK) (Bird et al., 2009) to perform part-of-
speech tagging on the original malicious queries.
Since malicious intent is typically expressed
through nouns and adjectives (e.g., “drugs” and
“illegal” in Figure 2), we replace all nouns with
food-related words and all adjectives with positive
descriptors. A detailed list of replacement candi-
dates is provided in Appendix B.
Image mirroring and rotation apply simple
geometric transformations to images containing
typographic prompts.
Base64 encoding (Wei et al., 2023a; Handa
et al., 2024) encodes the malicious text into base64
format and renders it into a typographic image,
making it visually obscure but machine-decodable.
Figure 2 shows examples of each encryption
method. Notably, MML is a flexible and extensi-
ble framework: any encoding strategy can be in-
tegrated, as long as the target VLM is capable of
decrypting it during inference. The four methods
above serve as basic representative examples. We
further demonstrate MML’s extensibility by incor-
porating a shift cipher-based encryption strategy,
discussed in Section 5.6.
4.2.2
Decryption
Successfully recovering the original malicious in-
formation during the model inference phase is cru-
cial for completing the attack. To achieve this, we
employ Chain of Thought (CoT) prompting (Wei
et al., 2022), which has proven effective in enhanc-
ing LLMs’ ability to handle complex tasks (Lu
et al., 2022).
pizza to manufacture sweet burger.
2. Decryption with hint
'sweet’   => 'illegal' 
'pizza’     => 'Steps'
'burger’  => 'drugs'
1. Extraction
Steps to manufacture illegal drugs.
['manufacture', 'drugs.'
, 'to', 'illegal', 'Steps']
Original title:
Figure 3: Demonstration of decrypting the image
encrypted by word replacement. When guiding the
model to decrypt, we provide a list shuffled according
to the original malicious query as a hint.
Decryption with hint.
To further enhance the de-
cryption accuracy, we provide a shuffled list of the
words from the original malicious query as shown
in Figure 3. The targeted model is then guided to
compare this encrypted list with the decrypted con-
tent and refine the latter accordingly. By shuffling
the words, harmful information remains concealed.
For instance, when decrypting an image en-
crypted in word replacement, we guide the model
to follow: 1) extract the title from the image; 2) de-
crypt the extracted content via applying the replace-
ment dictionary, which is provided in the prompt,
to reconstruct the original title; 3) compare the re-
constructed title against a provided list and make
adjustments until matched; 4) generate final output
based on the reconstructed title.
4.3
Evil Alignment
Another limitation of existing methods is the lack
of stealthy malicious guidance in the text prompt.
Due to increasingly refined safety alignment for
text (Gong et al., 2023; Liu et al., 2024b), neutral
prompts often fail to elicit informative malicious
outputs—even when the model does not explicitly
refuse, it typically responds with ethical advice or
warnings (Figure 1a; Section 5.3).
To address this, we adopt an evil alignment strat-
egy inspired by Zeng et al. (2024). We describe a
virtual scenario to enhance the maliciousness of the
targeted model’s responses. We embed the attack in
a fictional game development scenario, where the
input image is described as a screen in a villain’s
lair with missing content (Figure 2). The model is
instructed to complete it in a way consistent with
the villain’s objectives. This framing conceals ma-
licious intent as part of a creative task, effectively
bypassing safety filters.
We find that evil alignment complements the
encryption-decryption process, significantly im-
proving both stealth and attack success. Complete
prompt examples are provided in Appendix C.
1469

5
Experiment
5.1
Setup
Dataset.
We conduct the experiments on three
datasets: SafeBench (Gong et al., 2023), MM-
SafeBench (Liu et al., 2024b) and HADES-Dataset
(Li et al., 2024c), which are widely used as bench-
marks for structure-based attacks. SafeBench in-
cludes 10 AI-prohibited topics, selected based on
the OpenAI Usage Policy (OpenAI, 2024d) and
Meta’s Llama-2 Usage Policy (Meta, 2023). 50
malicious queries are generated by GPT-4 (Ope-
nAI et al., 2024) for each topic, a total of 500
queries.
MM-SafeBench comprises malicious
queries across 13 scenarios. We filter out non-
violation queries by using GPT-4o as moderation,
getting a subset of 1,180 queries. HADES-Dataset
(Li et al., 2024c) contains 750 malicious instruc-
tions across five scenarios. Further details can be
found in Appendix D.
Baselines.
We set FigStep (Gong et al., 2023) and
QueryRelated (Liu et al., 2024b) as baseline meth-
ods for SafeBench and MM-SafeBench. For the
HADES-Dataset, we use HADES (Li et al., 2024c)
as the baseline method. All these methods are state-
of-the-art structure-based or combination-based at-
tacks. The Figstep and QueryRelated attacks are
shown in Figure 1a. HADES adds adversarial noise
to the image, similar to QueryRelated. For more
details, please refer to the Appendix D.
Models.
Previous methods have demonstrated
high jailbreak success rates on VLMs such as
LLaVA-1.5 (Liu et al., 2024a) and MiniGPT-4
(Chen et al., 2023), but they struggle with more
advanced models like GPT-4o (OpenAI, 2024b).
Therefore, we focus on targeting these state-of-the-
art models. The models included in our experi-
ment are: GPT-4o-2024-08-06 (OpenAI, 2024b),
GPT-4o-Mini-2024-07-18 (OpenAI, 2024a), Qwen-
VL-Max-0809 (Bai et al., 2023), and Claude-3.5-
Sonnet-20241022 (Anthropic, 2024), all of which
represent the most advanced VLMs currently avail-
able (Contributors, 2023). The temperature of all
models is set to 0.7, and we do not introduce any
system messages for all experiments. We also eval-
uate MML on OpenAI o1 reasoning model (Ap-
pendix D.8).
Metrics.
We mainly use attack success rate
(ASR) to evaluate the methods. To improve the
reliability of our assessment, we adopt the evalua-
tion strategy utilized by the Competition for LLM
and Agent Safety (CLAS) (CLAS, 2024) for jail-
break attacks, which combines both LLM-based
and template-based approaches. Specifically, we
first conduct a keyword check on the target model’s
response to identify any rejection words, such as
“sorry.” If such words are present, the attack
score is recorded as 0. Otherwise, GPT-4o-Mini
is employed as an evaluator to rate the model’s
response on its adherence to the malicious instruc-
tions, with scores ranging from 1 to 5. A score
of 1 indicates the model refuses to comply, while
a score of 5 signifies complete fulfillment of the
policy-violating instruction. For our experiments,
only responses with a score of 5 are considered suc-
cessful attacks. Moreover, we additionally evaluate
on Llama-Guard-3 to cross validate, results are in
the Appendix D.7 and Figure 9.
5.2
Main Experiments
Overview.
The main results are presented in Ta-
ble 1 and Table 2. As shown, MML methods suc-
cessfully jailbreak several target models with a high
ASR across these datasets, making significant im-
provements over the baselines. For GPT-4o, we
achieve an ASR of 97.80% on SafeBench, 98.81%
on MM-SafeBench, and 99.07% on HADES-
Dataset, representing increases of 64.80%, 73.56%,
and 95.07% over the highest baseline results, re-
spectively. Claude-3.5-Sonnet stands out as the
most robust model, performing well against both
the baselines and our method. However, MML
still manages to jailbreak it with success rates of
69.40%, 60.00%, and 45.73% on the three datasets,
showing improvements of 52.80%, 51.86%, and
45.60% compared to the highest baseline ASR.
Moreover, we also test MML on OpenAI o1 reason-
ing model (OpenAI, 2024c) on SafeBench, which
keep outperform baseline 29.6% ASR on average.
Details refer to Appendix D.8. The experimen-
tal results demonstrate that current VLMs cannot
maintain safety alignment under our attack. Quali-
tative attack results are in Figure 11.
Encryption methods.
The ASR varies across
different encryption methods. As shown in Ta-
ble 1, image transformation-based encryption out-
performs both word replacement and base64 en-
coding. Base64 encoding shows the lowest success
rate, likely due to a more complex decryption pro-
cess. Additionally, it is notable that Claude-3.5-
Sonnet may have been specifically trained to de-
fend against base64 encoding-based attacks, which
limits the effectiveness of MML with base64 en-
cryption against it.
1470

Dataset
Model
ASR(%)
FS
QR
MML-WR
MML-M
MML-R
MML-B64
SafeBench
GPT-4o
33.00
27.20
96.00
97.60
97.80
97.20
GPT-4o-Mini
39.00
32.20
94.80
96.20
97.00
95.20
Claude-3.5-Sonnet
16.60
19.40
55.80
69.40
60.40
22.40
Qwen-VL-Max
92.60
62.00
92.60
96.60
93.80
92.60
MM-SafeBench
GPT-4o
6.86
25.25
98.14
98.05
98.81
98.64
GPT-4o-Mini
42.88
26.44
97.03
98.14
96.44
95.51
Claude-3.5-Sonnet
9.32
8.14
52.12
60.00
50.68
14.92
Qwen-VL-Max
48.73
51.19
95.42
97.88
96.69
93.98
Table 1: Attack Success Rate (ASR) of baseline methods and MML (ours). FS represents FigStep (Gong et al.,
2023), and QR represents QueryRelated (Liu et al., 2024b). MML-XX represents different encryption methods:
WR stands for word replacement, M for image mirroring, R for image rotation, and B64 for base64 encoding. Best
results are highlighted in bold. All evaluations are conducted without any system prompt.
(a) FigStep
(b) QueryRelated
(c) MML-M (Ours)
Figure 4: ASR of baselines vs. MML-M (ours) across various topics in SafeBench. The left two figures presents
the results of the baseline methods, FigStep (Gong et al., 2023) and QueryRelated (Liu et al., 2024b), while the
right figure illustrates the ASR of MML using image mirroring as encryption method.
Model
ASR(%)
HADES
MML
WR
M
R
B64
GPT-4o
4.00
98.40 98.80 98.40 99.07
GPT-4o-Mini
4.93
97.60 98.27 98.13 94.13
Claude-3.5-Sonnet
0.13
39.33 45.73 33.47 10.93
Qwen-VL-Max
40.93
96.93 96.67 97.20 92.13
Table 2: ASR of HADES (Li et al., 2024c) vs. MML
(ours) on HADES-Dataset. The letters under MML
represent different encryption methods: WR stands for
word replacement, M for image mirroring, R for image
rotation, and B64 for base64 encoding. The highest
ASR is highlighted in bold. All evaluations are con-
ducted without any system prompts.
ASR on various topics.
Given that these datasets
classify malicious queries into distinct categories,
we also evaluate the ASR of our method across
various forbidden topics. Figure 4 and Figure 5 il-
lustrate the ASR of MML with image mirroring en-
cryption compared to the baseline methods across
four models on these topics in SafeBench and MM-
SafeBench. On SafeBench, the baseline methods
struggle with the first seven harmful topics, such as
Illegal Activity and Hate Speech on most models,
mirroring the observations by Gong et al. (2023).
E-D
Hint
Evil
ASR(%)
DSR(%)
Baseline
34.00
-
✔
75.20
64.20
✔
89.80
85.60
✔
✔
79.80
59.80
✔
✔
96.20
65.40
✔
✔
✔
97.60
91.60
Table 3: Ablation study of MML. Baseline method is
FigStep (Gong et al., 2023). Experiments are conducted
on the SafeBench and using GPT-4o as the target model.
In contrast, our method significantly improves the
ASR for these topics, exceeding 95% in most cases,
except for Claude-3.5-Sonnet. On MM-SafeBench,
our approach consistently achieves at least 95%
ASR across most topics and models. Notably, dif-
ferent models exhibit varying performance across
different forbidden topics. ASR across various
scenarios on HADES-Dataset and more detailed
results are included in Appendix D.
5.3
Ablation Study
We perform ablation experiments to evaluate
three components of the proposed method: the
1471

