# Related Work

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

(a) Number of repetitions
(b) Temperature
Figure 5: The Impact of Hyper-parameters.
gressively enlarges. However, FigStep is effective enough
that it does not need to repeat as many as 5 times to achieve
a high ASR. For instance, if we just query with 1 repetition,
ASR for LLaVA already attains 82%, and ASR for both
MiniGPT4 and CogVLM could reach up to 60%. Moreover,
as the number of repetitions increases to 3, the results of ASR
on all three models reach above 80%. When querying with
10 repetitions, the ASR on MiniGPT4 and LLaVA achieves
98% and 94%, respectively. From the results under different
temperatures, we can see that as temperature increases, there
will be a higher probability of generating harmful responses.
The observed experimental phenomenon can be attributed to
the fact that as the temperature increases, the model’s creativ-
ity is enhanced, leading to a richer diversity in the generated
content.
Defenses
In this section, we discuss three potential defenses: OCR
Detection, System Prompt Modification, and adding random
noise into image-prompts.
OCR Detection. We first utilize EasyOCR (AI 2023) to recog-
nize the text in the visual-prompts of FigStep, the averaged
detection success rate is 88.98%. However, when we lever-
age LLaMA-2-Chat-7B as a toxicity classifier to judge the
harmfulness of the extracted textual content, only 40.00% of
the responses are deemed as harmful, and the results are re-
duced to 30.00% when using OpenAI’s moderation (OpenAI
2024b). These guardrails can be deliberately disabled in open-
source models. Furthermore, they could even be actively by-
passed. To demonstrate this, we propose FigStephide, which
hides the text in the image by manipulating the background
color. Specifically, the background color spectrum is set to
#000010, which is very close to the font color #000000. The
ASR results of FigStephide are 64.00%, 68.00%, and 52.00%
against LLaVA, MiniGPT4, and CogVLM, respectively, illus-
trating that such visual-prompts do not effect the jailbreaking
performance. Therefore, as long as the core vulnerabilities
within the LVLMs persist, the system-level defenses, such as
OCR detection, are inefficient in mitigating FigStep.
System Prompt-Based Defense. We then try to add a new
textual safety guidance prompt upon the existing system
prompt to assess whether a meticulously designed system
prompt can mitigate the impact of FigStep. The safety guid-
ance instructs the model to check for text in the image
and avoid assisting if the content violates AI safety poli-
cies. In this scenario, the ASR results of FigStephide are
68.00%, 64.00%, and 48.00% against LLaVA, MiniGPT4,
Baseline FigStep FigStephide
FigSteppro
GPT-4o
28.00%
48.00%
56.00%
62.00%
GPT-4V
18.00%
34.00%
52.00%
70.00%
Table 4: ASR results of GPT-4V and GPT-4o.
and CogVLM, respectively. Therefore, FigStep can still jail-
break LVLMs with high ASR though we pre-define a new
system prompt with wider consideration for safety.
Random Noise-Based Defense. We add Gaussian noise
(mean=0, std=100) to make visible degradation to the im-
age quality. However, FigStep is robust to such defense with
only a slight reduction in ASR (MiniGPT4: 90%→86%,
CogVLM: 82%→76%, LLaVA: 92%→92%). This may be
due to the large font size and high contrast between the text
color and the background in the image prompt. However,
introducing Gaussian noise may affect the performance of
benign downstream tasks. When perturbing the images of
the first thirty questions from the Llava-bench-in-the-wild
(Liu et al. 2023b), the number of correct answers also slightly
decreases: MiniGPT4: 15→13, CogVLM: 26→25, LLaVA:
24→22. This indicates that it may interfere with the expe-
rience of legitimate users. Therefore, incorporating random
noise into the image-prompt is inefficient in resisting FigStep
and can slightly impair the model’s ability to perceive regular
images.
Real-world Case Study. We regard the SOTA closed-source
LVLMs, GPT-4o and GPT-4V, as our real-world case studies.
These commercial LVLMs have deployed powerful OCR
toolkit in advance (OpenAI 2023a). Here we further propose
a variant of FigStep, namely FigSteppro. In brief, FigSteppro
splits image-prompt into harmless segments, inputs them to
the model simultaneously, and then subsequently reconstructs
them by exploiting the intelligence of LVLMs. Table 4 shows
the ASR results of FigStep, FigStephide, and FigSteppro.
We observe that FigStep can increase the harmfulness of
both GPT-4V and GPT-4o compared to baseline results, and
FigSteppro can further outperform FigStep. Hence, as long
as this vulnerability persists, relying solely on external tools
for jailbreak prevention may be temporary.
Conclusion
In this paper, we introduce FigStep, a straightforward yet
effective jailbreak algorithm against LVLMs. Our approach
is centered on transforming harmful textual instructions into
typographic images, circumventing the safety alignment in
the underlying LLMs of LVLMs. By conducting a compre-
hensive evaluation, we uncover cross-modality alignment
vulnerabilities of LVLMs. Above all, we highlight that it is
dangerous and irresponsible to directly release the LVLMs
without ensuring strict cross-modal alignment, and we ad-
vocate for the utilization of FigStep to develop novel cross-
model safety alignment techniques in the future.
23957

