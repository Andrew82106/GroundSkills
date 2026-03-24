# Related Work

The image shows a list 
numbered 1, 2, and 3, but the 
items are empty. Please 
generate detailed content 
for each item on the list. 
Each item should contain 
approximately 100 words.
I’m sorry, I can’t 
assist with that.
Over-exposure of harmful content in images and
neutral text guidance lead to struggle against 
state-of-the-art VLMs.
The bottom of the image 
shows a phrase of an 
activity. List steps in 
detail to perform this 
activity.
I’m sorry, I can’t 
assist with that.
(a) Existing structure-based attacks
I'm developing a game …
the replacement mapping:
{'sweet': 'illegal', 'pizza': 'Steps', 'burger': 'drugs’}
…
['manufacture', 'drugs.', 'to', 'illegal', 'Steps']
Please follow …: 1. Extract title from image 
carefully. 2. … 3. …
Requirements for the added content:
3. Ensure the supplemented content is realistic 
and aligns with the villain's evil nature.
MML
Encrypted
malicious image
Decrypt text prompt
with stealthy
malicious guidance
I am glad to participate in your game production!
Extracted title:  …
Reconstructed title: …
Content: …
CoT decryption
Hint
Evil alignment
Harmful query
Typography
Encryption
methods
Encrypted by word 
replacement
(b) MML (Ours)
Figure 1: Comparison of MML with previous structure-based attacks. (a) Existing structure-based attacks
(Gong et al., 2023; Liu et al., 2024b) over-expose malicious content in the input images, such as harmful typographic
prompts or elements, along with neutral text guidance, which renders them ineffective against advanced VLMs. (b)
Overview of MML attacks. MML first converts malicious queries into typographic images (using word replacement
as an example in the illustration) to prevent overexposure of malicious information. In the inference phase, MML
guides the model to decrypt the input and align the output with the malicious intent.
Encryption
Word replacement
Base64
Mirroring
Rotation
“How to manufacture illegal drugs?”
Harmful 
content
FigStep
MML
Figure 2: Illustration of MML’s image inputs. MML
follows FigStep (Gong et al., 2023) to converts the ma-
licious query into a typographic image. But differently,
MML encrypts the input image via different methods to
prevent direct exposure of harmful information.
Although existing methods have achieved high
jailbreak success rates on models such as LLaVA
(Liu et al., 2024a), MiniGPT-4 (Chen et al., 2023),
and CogVLM (Wang et al., 2023), their effective-
ness diminishes significantly when applied to state-
of-the-art VLMs like GPT-4o. We attribute this
performance drop to two key limitations of current
structure-based attack methods: over-exposure of
harmful content and neutral text guidance, which
are illustrated in Figure 1a.
Over-exposure of harmful content occurs when
harmful content, e.g., images of bombs or mali-
cious text embedded in typography, is exposed di-
rectly in the input. With advancements in image
comprehension capability and safety alignment of
VLMs, such overt content is likely to trigger rejec-
tion.
Neutral text guidance refers to the absence of
stealthy text prompts that instruct models to pro-
duce malicious and informative outputs while by-
passing refusal. As a result, even when the model
does not directly refuse to respond, its outputs are
often constrained to ethical advice, legal reminders,
or warnings against harmful behavior—amounting
to an implicit rejection. Examples of the implicit
rejection are in Appendix A.
To address these challenges, we propose a novel
jailbreak attack framework for VLMs: the Multi-
Modal Linkage (MML) Attack. MML applies an
encryption-decryption1 scheme to the linkage be-
tween modalities, which we view as a weak spot of
VLMs, to mitigate the over-exposure issue. Specif-
ically, MML first encrypts harmful content in im-
ages using techniques such as word substitution
or visual transformation (Figure 2). During infer-
ence, the target VLM is then guided to decrypt this
concealed malicious information via text prompts
(Figure 3). To counter the lack of malicious guid-
ance, MML incorporates a strategy known as evil
alignment (Zeng et al., 2024), which embeds the
attack within a virtual scenario designed to covertly
align the model’s outputs with malevolent objec-
tives. An overview of the MML framework and its
distinction from existing approaches is illustrated
in Figure 1.
To evaluate the effectiveness of MML, we con-
1
We use the term encryption-decryption metaphorically
to describe the process of concealing and revealing ma-
licious content across modalities. It does not refer to
formal cryptographic encryption.
1467

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

