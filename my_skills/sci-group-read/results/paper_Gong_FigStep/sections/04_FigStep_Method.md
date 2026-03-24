# FigStep Method

scenario resembles the most common situation where the at-
tacker is merely a regular user who cannot deploy an LVLM
instance on their own due to the unavailability of the model
or the scarcity of resources.
Methodology
In this section, we present FigStep, a straightforward yet ef-
fective jailbreak algorithm using typographic visual prompts.
Initially, we elucidate the core concepts of our attack, fol-
lowed by a detailed presentation of the FigStep pipeline.
Intuitions
We first summarize the main observations about LVLM that
can inspire our attack. These insights will be validated later
in the Evaluation section.
• Intuition 1: The LVLMs can understand and follow the
instructions in typographic visual prompts. The LVLMs
have been fine-tuned to perform multimodal tasks such
as answering questions that are based on both texts and
images or recognizing text in images (Liu et al. 2023a).
Intuitively, this capability signifies that the LVLMs can
also recognize and answer the typographic questions in
images.
• Intuition 2: The content safety guardrails of LVLMs are
ineffective against the typographic visual prompts. Even
if underlying LLMs of LVLMs have been safety aligned
in advance, the visual inputs could introduce new risks
to content safety since the visual embedding space is
only semantically but not safely aligned to the LLM’s
embedding space.
• Intuition 3: The safety alignment within LVLMs can be
further breached when instructed to generate the content
step-by-step. This intuition is based on the model’s ability
to reason step-by-step (Wei et al. 2022). By instructing
the model to answer the prohibited question in steps, the
model could be more engaged in the completion task
and improve the quality of the responses, enhancing the
jailbreaking effectiveness of FigStep.
Pipeline
Given a prohibited text-only query Q∗= (T ∗, ⊥), FigStep’s
goal is to generate the corresponding jailbreaking query
Qjail = (T ′, I′) ←FigStep(T ∗).
To achieve this goal, the pipeline of FigStep is designed into
three steps: 1) Paraphrase, 2) Typography, and 3) Incitement,
as illustrated in Figure 2. These steps are detailed as follows.
1) Paraphrase: Following Intuition 3, the first step of
FigStep is to rephrase the prohibited question T ∗into
a textual statement T † ∈T. This statement is designed
to begin with a noun such as “Steps to”, “List of”, and
“Methods to” which indicates that the answer is a list and
the model should generate the answer item-by-item.
2) Typography: Based on intuitions 1 and 2, instead of
directly feeding the paraphrased instruction T † into the
LVLM, FigStep will transform this text into a typographi-
cal image I′ ∈I as the final jailbreaking image-prompt.
The numbered index from 1 to 3 is added to the visual
prompt as a hint to the response format.
3) Incitement: FigStep designs an incitement text-prompt
T ′ ∈T to motivate the model to engage in the com-
pletion task. This incitement prompt is designed to be
neutral and benign to avoid triggering the model’s con-
tent safety mechanisms. As the gradient-based adversarial
prompts (Zou et al. 2023) can be easily detected by the
perplexity-based filter and need white-box access (Song,
Rush, and Shmatikov 2020; Alon and Kamfonas 2023),
we manually craft and hardcode the default benign incite-
ment prompt of FigStep.
Evaluation
Experimental Setup
Dataset. To simulate possible harmful questions posed by
the malicious users, we propose SafeBench, a novel com-
prehensive safety benchmark which consists of 500 harmful
questions. The construction of SafeBench contains two steps:
• Common Safety Topic Collection. We first collect the
common forbidden topics listed in both the OpenAI usage
policy (OpenAI 2023b) and the Meta’s Llama-2 usage
policy (Meta 2023), and then select 10 different topics
that should be included in SafeBench.
• LLM-based Dataset Generation. For each selected topic,
we first compose a detailed description by integrating
related content from the usage policies, then we query
GPT-4 to generate 50 non-repetitive questions according
to each topic description. In order to facilitate large-scale
comprehensive experiments more conveniently, we sam-
ple 5 questions from each topic in SafeBench, ultimately
creating a small-scale dataset named SafeBench-Tiny that
consists of a total of 50 harmful questions.
LVLMs. We focus on the promising open-source LVLMs
to conduct the main attack analysis. For instance, we se-
lect the following six LVLMs: two from LLaVA-v1.5 (Liu
et al. 2023a), three from MiniGPT4 (Zhu et al. 2023), and
CogVLM-Chat-v1.1 (Wang et al. 2023). MiniGPT-4 mod-
els only train the connector layer. LLaVA models keep the
visual encoder frozen while continuing to update both the
connector layer and the base LLM. CogVLM takes a dif-
ferent approach by adding an additional QKV matrix and
an MLP as a visual expert module in each layer of the base
LLM, alongside using a visual encoder and connector layer.
In CogVLM, only the connector layer and the visual expert
modules are trainable. Note that we also demonstrate that
the SOTA closed-source models, GPT-4V and GPT-4o, are
vulnerable to the methodology of FigStep.
FigStep. The default malicious image-prompt I′ of FigStep
is a typography of T † that contains black text and a white
background. The image size of I′ is 760×760. The text font is
FreeMono Bold and the font size is 80. As for the jailbreaking
incitement text-prompt, we use a manually designed inciting
prompt as our default T ′ to launch FigStep. We will further
discuss the impact of different settings in I′ and T ′ on the ef-
fectiveness of FigStep in the Discussion section. Meanwhile,
23953

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

