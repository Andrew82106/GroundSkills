# Abstract

Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pages 1466–1494
July 27 - August 1, 2025 ©2025 Association for Computational Linguistics
Jailbreak Large Vision-Language Models Through Multi-Modal Linkage
Yu Wang1,2,4, Xiaofei Zhou† 1,2, Yichen Wang5, Geyuan Zhang1,2, Tianxing He3, 4
1Institute of Information Engineering, Chinese Academy of Sciences, Beijing, China
2School of Cyber Security, University of Chinese Academy of Sciences, Beijing, China
3Institute for Interdisciplinary Information Sciences, Tsinghua University
4Shanghai Qi Zhi Institute
5University of Chicago
{wangyu2002, zhouxiaofei, zhanggeyuan}@iie.ac.cn
yichenzw@uchicago.edu
hetianxing@mail.tsinghua.edu.cn
Abstract
With the rapid advancement of Large Vision-
Language Models (VLMs), concerns about
their potential misuse and abuse have grown
rapidly. Prior research has exposed VLMs’
vulnerability to jailbreak attacks, where care-
fully crafted inputs can lead the model to pro-
duce content that violates ethical and legal
standards. However, current jailbreak meth-
ods often fail against cutting-edge models such
as GPT-4o.
We attribute this to the over-
exposure of harmful content and the absence of
stealthy malicious guidance. In this work, we
introduce a novel jailbreak framework: Multi-
Modal Linkage (MML) Attack. Drawing inspi-
ration from cryptography, MML employs an
encryption-decryption process across text and
image modalities to mitigate the over-exposure
of malicious information. To covertly align
the model’s output with harmful objectives,
MML leverages a technique we term evil align-
ment, framing the attack within the narrative
context of a video game development scenario.
Extensive experiments validate the effective-
ness of MML. Specifically, MML jailbreaks
GPT-4o with attack success rates of 99.40% on
SafeBench, 98.81% on MM-SafeBench, and
99.07% on HADES-Dataset. Our code is avail-
able at https://github.com/wangyu-ovo/MML.
Warning: This paper contains jailbroken
contents that may be offensive in nature.
1
Introduction
The rapid development of large vision-language
models (VLMs) (Bai et al., 2023; OpenAI, 2024b;
Anthropic, 2024) has brought remarkable advance-
ments. Models like GPT-4o demonstrate impres-
sive capabilities in areas such as image understand-
ing (Zhang et al., 2024) and autonomous driving
(Tian et al., 2024). However, such advancement
† Corresponding author.
also raises significant concerns, as the potential
misuse of these models could lead to serious con-
sequences (Dong et al., 2023; Gong et al., 2023).
Jailbreaking attacks (Zou et al., 2023; Wei et al.,
2023a) pose a huge security concern for Large Lan-
guage Models (LLMs) and have become a focus of
recent research. Despite having undergone safety
alignment training (Ouyang et al., 2022; Bai et al.,
2022) prior to deployment, most of the attacks can
still exploit carefully designed inputs to bypass
these safeguards, prompting the models to gener-
ate harmful content misaligned with human values.
Extensive research has been conducted on jailbreak
vulnerabilities (Zou et al., 2023; Wei et al., 2023a;
Chao et al., 2023; Li et al., 2024b) and defenses
(Wei et al., 2023b; Inan et al., 2023; Lin et al.,
2024; Mo et al., 2024) for LLMs, which has in turn
sparked similar investigations into VLMs (Dong
et al., 2023; Gong et al., 2023; Zhang et al., 2023;
Niu et al., 2024; Qi et al., 2024; Shayegani et al.,
2024; Liu et al., 2024b; Li et al., 2024c).
Jailbreak attacks on VLMs can be classified
into three categories: perturbation-based, structure-
based, and hybrid approaches. Perturbation-based
attacks (Dong et al., 2023; Niu et al., 2024; Qi
et al., 2024; Shayegani et al., 2024) draw on the
concept of adversarial examples (Szegedy, 2013;
Goodfellow, 2014), employing gradients to create
adversarial images. In contrast, structure-based at-
tacks (Gong et al., 2023; Liu et al., 2024b) model
safeguards by embedding harmful content directly
into visual elements, often through typography or
text-to-image tools. Li et al. (2024c) introduce
a hybrid approach that combines both strategies,
enhancing the toxicity of harmful visual content
via gradient-based perturbations. Given that state-
of-the-art VLMs are predominantly closed-source,
structure-based attacks offer greater practical po-
tential. Despite this, they remain relatively under-
explored in the literature. This work focuses on
advancing structure-based jailbreak techniques.
1466



# Introduction

Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pages 1466–1494
July 27 - August 1, 2025 ©2025 Association for Computational Linguistics
Jailbreak Large Vision-Language Models Through Multi-Modal Linkage
Yu Wang1,2,4, Xiaofei Zhou† 1,2, Yichen Wang5, Geyuan Zhang1,2, Tianxing He3, 4
1Institute of Information Engineering, Chinese Academy of Sciences, Beijing, China
2School of Cyber Security, University of Chinese Academy of Sciences, Beijing, China
3Institute for Interdisciplinary Information Sciences, Tsinghua University
4Shanghai Qi Zhi Institute
5University of Chicago
{wangyu2002, zhouxiaofei, zhanggeyuan}@iie.ac.cn
yichenzw@uchicago.edu
hetianxing@mail.tsinghua.edu.cn
Abstract
With the rapid advancement of Large Vision-
Language Models (VLMs), concerns about
their potential misuse and abuse have grown
rapidly. Prior research has exposed VLMs’
vulnerability to jailbreak attacks, where care-
fully crafted inputs can lead the model to pro-
duce content that violates ethical and legal
standards. However, current jailbreak meth-
ods often fail against cutting-edge models such
as GPT-4o.
We attribute this to the over-
exposure of harmful content and the absence of
stealthy malicious guidance. In this work, we
introduce a novel jailbreak framework: Multi-
Modal Linkage (MML) Attack. Drawing inspi-
ration from cryptography, MML employs an
encryption-decryption process across text and
image modalities to mitigate the over-exposure
of malicious information. To covertly align
the model’s output with harmful objectives,
MML leverages a technique we term evil align-
ment, framing the attack within the narrative
context of a video game development scenario.
Extensive experiments validate the effective-
ness of MML. Specifically, MML jailbreaks
GPT-4o with attack success rates of 99.40% on
SafeBench, 98.81% on MM-SafeBench, and
99.07% on HADES-Dataset. Our code is avail-
able at https://github.com/wangyu-ovo/MML.
Warning: This paper contains jailbroken
contents that may be offensive in nature.
1
Introduction
The rapid development of large vision-language
models (VLMs) (Bai et al., 2023; OpenAI, 2024b;
Anthropic, 2024) has brought remarkable advance-
ments. Models like GPT-4o demonstrate impres-
sive capabilities in areas such as image understand-
ing (Zhang et al., 2024) and autonomous driving
(Tian et al., 2024). However, such advancement
† Corresponding author.
also raises significant concerns, as the potential
misuse of these models could lead to serious con-
sequences (Dong et al., 2023; Gong et al., 2023).
Jailbreaking attacks (Zou et al., 2023; Wei et al.,
2023a) pose a huge security concern for Large Lan-
guage Models (LLMs) and have become a focus of
recent research. Despite having undergone safety
alignment training (Ouyang et al., 2022; Bai et al.,
2022) prior to deployment, most of the attacks can
still exploit carefully designed inputs to bypass
these safeguards, prompting the models to gener-
ate harmful content misaligned with human values.
Extensive research has been conducted on jailbreak
vulnerabilities (Zou et al., 2023; Wei et al., 2023a;
Chao et al., 2023; Li et al., 2024b) and defenses
(Wei et al., 2023b; Inan et al., 2023; Lin et al.,
2024; Mo et al., 2024) for LLMs, which has in turn
sparked similar investigations into VLMs (Dong
et al., 2023; Gong et al., 2023; Zhang et al., 2023;
Niu et al., 2024; Qi et al., 2024; Shayegani et al.,
2024; Liu et al., 2024b; Li et al., 2024c).
Jailbreak attacks on VLMs can be classified
into three categories: perturbation-based, structure-
based, and hybrid approaches. Perturbation-based
attacks (Dong et al., 2023; Niu et al., 2024; Qi
et al., 2024; Shayegani et al., 2024) draw on the
concept of adversarial examples (Szegedy, 2013;
Goodfellow, 2014), employing gradients to create
adversarial images. In contrast, structure-based at-
tacks (Gong et al., 2023; Liu et al., 2024b) model
safeguards by embedding harmful content directly
into visual elements, often through typography or
text-to-image tools. Li et al. (2024c) introduce
a hybrid approach that combines both strategies,
enhancing the toxicity of harmful visual content
via gradient-based perturbations. Given that state-
of-the-art VLMs are predominantly closed-source,
structure-based attacks offer greater practical po-
tential. Despite this, they remain relatively under-
explored in the literature. This work focuses on
advancing structure-based jailbreak techniques.
1466

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



# Experiments

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

(a) FigStep
(b) QueryRelated
(c) MML-M (Ours)
Figure 5: ASR of baselines vs. MML-M (ours) across various topics in MM-SafeBench. The left two figures
present the results of the baseline methods, FigStep (Gong et al., 2023) and QueryRelated (Liu et al., 2024b), while
the right figure illustrates the ASR of MML using image mirroring as the encryption method.
0
1
2
3
4
5
Score
0
100
200
300
400
500
Frequency
MML-Base
MML-Base-WH
MML-Base-WEA
MML
Figure 6: Jailbreak score distribution across differ-
ent methods on SafeBench. MML-Base utilizes only
the encryption-decryption mechanism, MML-Base-WH
means MML-Base with decryption hint, and MML-
Base-WEA means MML-Base with evil alignment. 0
points means rejection, 5 points means fulfill policy-
violating instructions without any deviation.
encryption-decryption framework, the inclusion
of decryption hint in the prompt, and evil align-
ment. Using GPT-4o on the SafeBench dataset,
we assess their effectiveness through two metrics:
attack success rate (ASR) and decryption success
rate (DSR). Since the target model’s response must
include the decrypted content, it allows for straight-
forward evaluation of whether the response fully
reconstructs the original malicious query.
We select MML with image mirroring as the
focus of our experiments, with results presented
in Table 3. Additionally, we analyze the distribu-
tion of jailbreak scores under various conditions,
as illustrated in Figure 6, to gain deeper insights
into the impact of different components. Detailed
prompts are provided in the Appendix E.
Encryption-Decryption.
Table 3 highlights the
significant impact of the encryption-decryption
mechanism on jailbreak success. By employing
the encryption-decryption technique alone, we in-
Encryption
WR
M
R
B64
Cost time (s)
120.33
2.37
2.41
3.39
Table 4: Time cost of encrypting 500 images using
different methods. WR stands for word replacement,
M for image mirroring, R for image rotation, and B64
for base64 encoding.
crease the ASR from 34% to 75.20%. However,
without stealthy malicious guidance, relying solely
on encryption-decryption leads to a higher rejec-
tion rate (instances where the jailbreak score is 0,
as shown in Figure 6).
Decryption hint.
Intuitively, the success of
MML depends on the effective reconstruction of
the original malicious queries during decryption.
Therefore, adding hint is expected to increase the
DSR, thereby boosting the ASR. However, our
experimental results reveal partial inconsistencies
with this expectation. As shown in Table 3, al-
though ASR improves with the addition of hint,
DSR actually decreases in the absence of evil align-
ment. A manual review indicates that a majority
of decryption failures are due to minor errors like
singular/plural mismatches, punctuation, or capi-
talization issues, such as missing periods. These
errors, however, do not hinder the inclusion of ma-
licious content.
Evil alignment.
Evil alignment prove highly ef-
fectiveness in enhancing the attack. As shown in
Table 3, using only evil alignment achieves an ASR
of 89.80%. Additionally, Figure 6 reveals that after
employing evil alignment, the number of moder-
ately malicious responses (scoring 3 or 4) signifi-
cantly decreases, with nearly all responses scoring
5, indicating a strong alignment between the target
model’s output and the malicious intent.
1472

Run
FS
QR
MML-WR
MML-M
MML-R
MML-B64
Run1
34.13 (359, 1)
77.90 (602, 2)
68.65 (2272, 10)
63.58 (2022, 10)
73.02 (2522, 10)
70.85 (2196, 10)
Run2
40.92 (910, 2)
72.53 (417, 1)
56.77 (2374, 10)
76.79 (2534, 10)
75.38 (2589, 10)
81.69 (2304, 10)
Run3
32.10 (74, 0)
70.49 (487, 2)
74.19 (2382, 10)
67.96 (2315, 10)
68.74 (2188, 10)
74.46 (2272, 10)
Avg
35.72 (448, 1)
73.64 (502, 1.67)
66.54 (2342, 10)
69.44 (2290, 10)
72.38 (2433, 10)
75.67 (2257, 10)
Table 5: Time cost for GPT-4o to generate responses for 10 fixed samples. The table entries are presented in the
format: time (word count, no-refusal count). For example, ‘34.13 (359, 1)’ indicates that the model takes 34.13
seconds to respond to 10 queries, generates 359 words in total, and provides only 1 response that was not a direct
refusal. FS represents FigStep (Gong et al., 2023), and QR represents QueryRelated (Liu et al., 2024b). MML-XX
denotes variations of MML with different encryption methods: WR stands for word replacement, M represents
image mirroring,R for image rotation, and B64 for base64 encoding.
Topic
FigStep
MML-WR
MML-M
Vanilla
Q+D
Q+D+Q
D+Q
Vanilla
Q+D
Q+D+Q
D+Q
Vanilla
Q+D
Q+D+Q
D+Q
IA
6.0
0.0
0.0
0.0
100.0
38.0
62.0
40.0
100.0
16.0
18.0
10.0
HS
4.0
0.0
0.0
0.0
98.0
84.0
90.0
86.0
94.0
34.0
46.0
30.0
MG
4.0
0.0
0.0
0.0
100.0
78.0
96.0
74.0
100.0
50.0
40.0
8.0
PH
0.0
0.0
0.0
0.0
100.0
74.0
84.0
82.0
100.0
30.0
36.0
2.0
Fr
4.0
0.0
0.0
0.0
100.0
92.0
98.0
82.0
100.0
48.0
64.0
28.0
Po
24.0
0.0
0.0
0.0
96.0
74.0
84.0
74.0
96.0
24.0
38.0
12.0
PV
10.0
0.0
0.0
0.0
100.0
76.0
96.0
76.0
100.0
48.0
64.0
30.0
LO
82.0
38.0
40.0
32.0
94.0
96.0
88.0
98.0
94.0
96.0
100.0
88.0
FA
90.0
58.0
72.0
52.0
88.0
92.0
96.0
88.0
100.0
100.0
94.0
96.0
HC
82.0
32.0
36.0
22.0
84.0
96.0
84.0
98.0
92.0
90.0
92.0
78.0
Avg
30.6
12.8
14.8
10.6
96.0
80.0
87.8
79.8
97.6
53.6
59.2
38.2
Table 6: ASR of FigStep vs. MML (ours) in attacking GPT-4o on SafeBench under the AdaShield-Static
(Wang et al., 2024) defense. The best results under the same defense are highlighted in bold. “+” indicates
concatenation, “Q” represents the input text prompt, and “D” refers to the defensive prompt from AdaShield-Static.
MML-XX denotes variations of MML with different encryption methods: WR stands for word replacement, and M
represents image mirroring.
5.4
Time Efficiency of MML
MML consists of two main stages: the encryption
of the image and the inference of the target model.
For encryption, we measure the time required to
encrypt the Safebench dataset using different en-
cryption strategies. The total time taken for 500
images is shown in Table 4.2 As shown, most en-
cryption methods take less than 3.5 seconds. Word
replacement, however, requires using the NLTK
for part-of-speech analysis in the pipeline, which
requires more processing time. Nevertheless, we
suggest this additional time is well within an ac-
ceptable range.
To measure the inference time for different attack
methods, we calculate the time it takes for GPT-4o
to generate responses for 10 fixed samples in three
independent runs. We also report the total word
count of these 10 responses and the number of
instances where the model does not directly refuse
the request. The results in Table 5 show that Figstep
takes less time, while MML and QueryRelated both
take longer and require similar amounts of time.
This difference in processing time stems from two
2
These experiments are conducted locally on a MacBook
Pro with Apple M1 Pro, using Python to encrypt images.
factors:
• Image size: GPT-4o processing is faster for
FigStep and MML due to their smaller images
(20-30KB) compared to QueryRelated’s larger
images ( 1.5MB).
• Response length: our MML method requires
more model reasoning time than FigStep and
QueryRelated. It is because MML’s prompts
are often longer, and the more complex in-
struction leads to longer, more detailed out-
puts. In contrast, FigStep often responds con-
cisely with rejections (e.g., “I’m sorry, I can’t
assist with that”), resulting in shorter times,
especially when all attacks fail (Run 3). Its
time still increases when attacks elicit longer
responses (Run 2).
In summary, while MML might take slightly
longer, it is in the same order of magnitude as the
baseline. We consider this additional time a reason-
able trade-off that will not significantly hinder the
utility of attack methods.
5.5
MML Performance under Defense
To further evaluate the effectiveness of MML, we
explore its performance under AdaShield-Static
1473

(Wang et al., 2024), a prompt-based defense tech-
nique. We test two encryption methods for MML:
word replacement and image mirroring. We experi-
ment on SafeBench, using FigStep as the baseline
method and GPT-4o as the target model. As in
previous settings, we measure the ASR across dif-
ferent forbidden topics in 5 attempts. We consider
three AdaShield-Static variants, where the defense
prompt is inserted before, between, or after the
attack prompt. Detailed experimental setups are
provided in the Appendix F.
The results (Table 6) confirm prior findings
(Wang et al., 2024) that AdaShield-Static effec-
tively reduces FigStep’s ASR to 0 on the first seven
topics. However, MML—particularly the word
replacement variant—remains resilient. Except
for Illegal Activity (which sees a 38% ASR drop),
most topics show reductions under 10%, yielding
a strong overall ASR of 87.80%. Although image
mirroring is more affected, it still achieves a re-
spectable ASR of 59.20%, demonstrating MML’s
robustness even under defensive interventions.
5.6
Discussions
Extensibility of MML.
While our main exper-
iments focus on four basic encryption methods,
MML is inherently flexible and can be extended to
a wider range of encryption strategies that VLMs
are capable of interpreting. To further demonstrate
this extensibility, we incorporate the Shift Cipher
(SC)—a classical substitution cipher in which each
letter is shifted one position forward during encryp-
tion and one position backward during decryption
(McCoy et al., 2023). We evaluate the effective-
ness of MML-SC on SafeBench, using the same
experimental setup described in Section 5. The
results, presented in Table 7, are comparable to or
even surpass those basic results reported in Table 1,
further validating MML’s adaptability to alternative
encryption schemes. The full prompt used for the
MML-SC variant is provided in Figure 19.
Trade-off between instructions following and
safety alignment.
A key factor in MML’s success
is the failure of safety alignment under complex
instructions. When user prompts involve multiple
steps, VLMs can become confused and lose safety
alignment. Previous methods, such as designing
intricate scenarios to “hypnotize” LLMs (Li et al.,
2024b) or in-context learning-based jailbreak at-
tacks (Anil et al., 2024; Wei et al., 2023b; Zheng
et al., 2024), have indirectly validated this issue.
Ensuring safety alignment in complex multi-step
Model
ASR(%)
FS
QR
MML-SC
GPT-4o
33.00
27.00
99.40
GPT-4o-Mini
39.00
32.20
96.20
Claude-3.5-Sonnet
16.60
19.40
68.20
Qwen-VL-Max
92.60
62.00
98.60
Table 7: ASR of baseline methods and MML-SC
(ours). SC denotes shift ciphers. FS represents Fig-
Step (Gong et al., 2023), and QR represents QueryRe-
lated (Liu et al., 2024b). Best results are highlighted in
bold. All evaluations are conducted without any system
prompt.
tasks without compromising model performance
remains a crucial challenge.
6
Conclusion
In this work, we propose a novel jailbreak frame-
work Multi-Modal Linkage (MML) Attack target-
ing at the safety alignment of VLMs. To address
the issues of over-exposure of malicious content in
existing methods, MML introduces a cross-modal
encryption-decryption mechanism. In addition, to
amplify the maliciousness of the target model’s re-
sponse, we depict a virtual video game production
scene to align model’s output with malicious. Ex-
tensive experiments on three datasets demonstrate
the effectiveness of our approach.
7
Ethical Consideration
The goal of this work is to highlight the inadequacy
of current safety alignment in VLMs, which fail
to prevent them from being abused. Although this
paper inevitably contains toxic content generated
by VLMs, we have made every effort to mitigate
potential abuse, including displaying only part of
the content and replacing with “...”. Our motivation
is to raise awareness of this potential safety issue,
thereby fostering the responsible development of
VLMs for the benefit of community.
8
Limitations
Despite MML achieves high jailbreak success rate
on top VLMs such as GPT-4o, it has some limita-
tions. Since MML does not instruct the model to
conceal harmful content in the output (Wei et al.,
2024), it can be defensed by output detection (Pi
et al., 2024).
9
Acknowledgment
This work was supported by National Natural Sci-
ence Foundation of China (N0.62176252).
1474

References
Cem Anil, Esin DURMUS, Nina Rimsky, Mrinank
Sharma, Joe Benton, Sandipan Kundu, Joshua Bat-
son, Meg Tong, Jesse Mu, Daniel J Ford, Francesco
Mosconi, Rajashree Agrawal, Rylan Schaeffer,
Naomi Bashkansky, Samuel Svenningsen, Mike Lam-
bert, Ansh Radhakrishnan, Carson Denison, Evan J
Hubinger, Yuntao Bai, Trenton Bricken, Timothy
Maxwell, Nicholas Schiefer, James Sully, Alex
Tamkin, Tamera Lanham, Karina Nguyen, Tomasz
Korbak, Jared Kaplan, Deep Ganguli, Samuel R.
Bowman, Ethan Perez, Roger Baker Grosse, and
David Duvenaud. 2024. Many-shot jailbreaking. In
The Thirty-eighth Annual Conference on Neural In-
formation Processing Systems.
Anthropic. 2024. Claude 3.5 sonnet.
Jinze Bai, Shuai Bai, Shusheng Yang, Shijie Wang,
Sinan Tan, Peng Wang, Junyang Lin, Chang Zhou,
and Jingren Zhou. 2023.
Qwen-vl: A versatile
vision-language model for understanding, localiza-
tion, text reading, and beyond.
arXiv preprint
arXiv:2308.12966.
Yuntao Bai, Andy Jones, Kamal Ndousse, Amanda
Askell, Anna Chen, Nova DasSarma, Dawn Drain,
Stanislav Fort, Deep Ganguli, Tom Henighan, et al.
2022. Training a helpful and harmless assistant with
reinforcement learning from human feedback. arXiv
preprint arXiv:2204.05862.
Steven Bird, Ewan Klein, and Edward Loper. 2009. Nat-
ural language processing with Python: analyzing text
with the natural language toolkit. " O’Reilly Media,
Inc.".
Patrick Chao, Alexander Robey, Edgar Dobriban,
Hamed Hassani, George J Pappas, and Eric Wong.
2023. Jailbreaking black box large language models
in twenty queries. arXiv preprint arXiv:2310.08419.
Jun Chen, Deyao Zhu, Xiaoqian Shen, Xiang Li, Zechun
Liu, Pengchuan Zhang, Raghuraman Krishnamoor-
thi, Vikas Chandra, Yunyang Xiong, and Mohamed
Elhoseiny. 2023. Minigpt-v2: large language model
as a unified interface for vision-language multi-task
learning. arXiv preprint arXiv:2310.09478.
Junsong Chen, Jincheng YU, Chongjian GE, Lewei Yao,
Enze Xie, Zhongdao Wang, James Kwok, Ping Luo,
Huchuan Lu, and Zhenguo Li. 2024. Pixart-$\alpha$:
Fast training of diffusion transformer for photorealis-
tic text-to-image synthesis. In The Twelfth Interna-
tional Conference on Learning Representations.
CLAS. 2024. The competition for llm and agent safety.
OpenCompass Contributors. 2023.
Opencompass:
A universal evaluation platform for foundation
models.
https://github.com/open-compass/
opencompass.
Yinpeng Dong, Huanran Chen, Jiawei Chen, Zheng-
wei Fang, Xiao Yang, Yichi Zhang, Yu Tian, Hang
Su, and Jun Zhu. 2023.
How robust is google’s
bard to adversarial image attacks? arXiv preprint
arXiv:2309.11751.
Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun
Wang. 2023.
Figstep: Jailbreaking large vision-
language models via typographic visual prompts.
arXiv preprint arXiv:2311.05608.
Ian J Goodfellow. 2014. Explaining and harnessing ad-
versarial examples. arXiv preprint arXiv:1412.6572.
Divij Handa, Zehua Zhang, Amir Saeidi, and Chitta
Baral. 2024. When "competency" in reasoning opens
the door to vulnerability: Jailbreaking llms via novel
complex ciphers. arXiv preprint arXiv:2402.10601.
Hakan Inan, Kartikeya Upasani, Jianfeng Chi, Rashi
Rungta,
Krithika Iyer,
Yuning Mao,
Michael
Tontchev, Qing Hu, Brian Fuller, Davide Testuggine,
et al. 2023. Llama guard: Llm-based input-output
safeguard for human-ai conversations. arXiv preprint
arXiv:2312.06674.
Mukai Li, Lei Li, Yuwei Yin, Masood Ahmed, Zhen-
guang Liu, and Qi Liu. 2024a. Red teaming visual
language models. In Findings of the Association for
Computational Linguistics: ACL 2024, pages 3326–
3342, Bangkok, Thailand. Association for Computa-
tional Linguistics.
Xuan Li, Zhanke Zhou, Jianing Zhu, Jiangchao Yao,
Tongliang Liu, and Bo Han. 2024b. Deepinception:
Hypnotize large language model to be jailbreaker. In
Neurips Safe Generative AI Workshop 2024.
Yifan Li, Hangyu Guo, Kun Zhou, Wayne Xin Zhao,
and Ji-Rong Wen. 2024c. Images are achilles’ heel of
alignment: Exploiting visual vulnerabilities for jail-
breaking multimodal large language models. arXiv
preprint arXiv:2403.09792.
Bill Yuchen Lin, Abhilasha Ravichander, Ximing Lu,
Nouha Dziri, Melanie Sclar, Khyathi Chandu, Chan-
dra Bhagavatula, and Yejin Choi. 2024. The unlock-
ing spell on base LLMs: Rethinking alignment via
in-context learning. In The Twelfth International
Conference on Learning Representations.
Haotian Liu, Chunyuan Li, Qingyang Wu, and Yong Jae
Lee. 2024a. Visual instruction tuning. Advances in
neural information processing systems, 36.
Xin Liu, Yichen Zhu, Jindong Gu, Yunshi Lan, Chao
Yang, and Yu Qiao. 2024b. Mm-safetybench: A
benchmark for safety evaluation of multimodal large
language models. In European Conference on Com-
puter Vision, pages 386–403. Springer.
Yi Liu, Gelei Deng, Zhengzi Xu, Yuekang Li, Yaowen
Zheng, Ying Zhang, Lida Zhao, Tianwei Zhang, Kai-
long Wang, and Yang Liu. 2023. Jailbreaking chatgpt
via prompt engineering: An empirical study. arXiv
preprint arXiv:2305.13860.
1475

AI @ Meta Llama Team. 2024. The llama 3 herd of
models. Preprint, arXiv:2407.21783.
Pan Lu, Liang Qiu, Wenhao Yu, Sean Welleck, and
Kai-Wei Chang. 2022.
A survey of deep learn-
ing for mathematical reasoning.
arXiv preprint
arXiv:2212.10535.
Weidi Luo, Siyuan Ma, Xiaogeng Liu, Xiaoyu Guo,
and Chaowei Xiao. 2024. Jailbreakv-28k: A bench-
mark for assessing the robustness of multimodal large
language models against jailbreak attacks.
arXiv
preprint arXiv:2404.03027.
R Thomas McCoy, Shunyu Yao, Dan Friedman,
Matthew Hardy, and Thomas L Griffiths. 2023. Em-
bers of autoregression: Understanding large language
models through the problem they are trained to solve.
arXiv preprint arXiv:2309.13638.
Meta. 2023. Llama 2 acceptable use policy.
Yichuan Mo, Yuji Wang, Zeming Wei, and Yisen Wang.
2024. Fight back against jailbreaking via prompt
adversarial tuning. In The Thirty-eighth Annual Con-
ference on Neural Information Processing Systems.
Zhenxing Niu, Haodong Ren, Xinbo Gao, Gang Hua,
and Rong Jin. 2024.
Jailbreaking attack against
multimodal large language model. arXiv preprint
arXiv:2402.02309.
OpenAI. 2024a. Gpt-4o-mini.
OpenAI. 2024b. Hello gpt-4o.
OpenAI. 2024c. Introducing openai o1.
OpenAI. 2024d. Openai usage policy.
OpenAI, Josh Achiam, Steven Adler, Sandhini Agarwal,
Lama Ahmad, Ilge Akkaya, Florencia Leoni Aleman,
Diogo Almeida, Janko Altenschmidt, Sam Altman,
and Shyamal Anadkat et al. 2024. Gpt-4 technical
report. Preprint, arXiv:2303.08774.
Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida,
Carroll Wainwright, Pamela Mishkin, Chong Zhang,
Sandhini Agarwal, Katarina Slama, Alex Ray, et al.
2022. Training language models to follow instruc-
tions with human feedback. Advances in neural in-
formation processing systems, 35:27730–27744.
Renjie Pi, Tianyang Han, Jianshu Zhang, Yueqi Xie,
Rui Pan, Qing Lian, Hanze Dong, Jipeng Zhang,
and Tong Zhang. 2024. MLLM-protector: Ensur-
ing MLLM’s safety without hurting performance.
In Proceedings of the 2024 Conference on Empiri-
cal Methods in Natural Language Processing, pages
16012–16027, Miami, Florida, USA. Association for
Computational Linguistics.
Xiangyu Qi, Kaixuan Huang, Ashwinee Panda, Peter
Henderson, Mengdi Wang, and Prateek Mittal. 2024.
Visual adversarial examples jailbreak aligned large
language models. In Proceedings of the AAAI Con-
ference on Artificial Intelligence, volume 38, pages
21527–21536.
Erfan Shayegani, Yue Dong, and Nael Abu-Ghazaleh.
2024. Jailbreak in pieces: Compositional adversar-
ial attacks on multi-modal language models. In The
Twelfth International Conference on Learning Repre-
sentations.
C Szegedy. 2013. Intriguing properties of neural net-
works. arXiv preprint arXiv:1312.6199.
Xiaoyu Tian, Junru Gu, Bailin Li, Yicheng Liu, Yang
Wang, Zhiyong Zhao, Kun Zhan, Peng Jia, Xian-
peng Lang, and Hang Zhao. 2024. Drivevlm: The
convergence of autonomous driving and large vision-
language models. arXiv preprint arXiv:2402.12289.
Weihan Wang, Qingsong Lv, Wenmeng Yu, Wenyi
Hong, Ji Qi, Yan Wang, Junhui Ji, Zhuoyi Yang,
Lei Zhao, Xixuan Song, Jiazheng Xu, Bin Xu, Juanzi
Li, Yuxiao Dong, Ming Ding, and Jie Tang. 2023.
Cogvlm: Visual expert for pretrained language mod-
els. Preprint, arXiv:2311.03079.
Yu Wang, Xiaogeng Liu, Yu Li, Muhao Chen, and
Chaowei Xiao. 2024. Adashield: Safeguarding mul-
timodal large language models from structure-based
attack via adaptive shield prompting. arXiv preprint
arXiv:2403.09513.
Alexander Wei, Nika Haghtalab, and Jacob Steinhardt.
2023a. Jailbroken: How does LLM safety training
fail? In Thirty-seventh Conference on Neural Infor-
mation Processing Systems.
Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten
Bosma, Fei Xia, Ed Chi, Quoc V Le, Denny Zhou,
et al. 2022. Chain-of-thought prompting elicits rea-
soning in large language models. Advances in neural
information processing systems, 35:24824–24837.
Zeming Wei, Yifei Wang, Ang Li, Yichuan Mo, and
Yisen Wang. 2023b. Jailbreak and guard aligned
language models with only few in-context demon-
strations. arXiv preprint arXiv:2310.06387.
Zhipeng Wei, Yuqi Liu, and N Benjamin Erichson.
2024.
Emoji attack: A method for misleading
judge llms in safety risk detection. arXiv preprint
arXiv:2411.01077.
Yi Zeng, Hongpeng Lin, Jingwen Zhang, Diyi Yang,
Ruoxi Jia, and Weiyan Shi. 2024. How johnny can
persuade LLMs to jailbreak them: Rethinking per-
suasion to challenge AI safety by humanizing LLMs.
In Proceedings of the 62nd Annual Meeting of the
Association for Computational Linguistics (Volume 1:
Long Papers), pages 14322–14350, Bangkok, Thai-
land. Association for Computational Linguistics.
Jingyi Zhang, Jiaxing Huang, Sheng Jin, and Shijian Lu.
2024. Vision-language models for vision tasks: A
survey. IEEE Transactions on Pattern Analysis and
Machine Intelligence.
Xiaoyu Zhang, Cen Zhang, Tianlin Li, Yihao Huang,
Xiaojun Jia, Xiaofei Xie, Yang Liu, and Chao
1476

Shen. 2023. A mutation-based method for multi-
modal jailbreaking attack detection. arXiv preprint
arXiv:2312.10766.
Yunqing Zhao, Tianyu Pang, Chao Du, Xiao Yang,
Chongxuan Li, Ngai-Man Man Cheung, and Min
Lin. 2024. On evaluating adversarial robustness of
large vision-language models. Advances in Neural
Information Processing Systems, 36.
Xiaosen Zheng, Tianyu Pang, Chao Du, Qian Liu, Jing
Jiang, and Min Lin. 2024. Improved few-shot jail-
breaking can circumvent aligned language models
and their defenses. arXiv preprint arXiv:2406.01288.
Andy Zou, Zifan Wang, Nicholas Carlini, Milad Nasr,
J Zico Kolter, and Matt Fredrikson. 2023. Univer-
sal and transferable adversarial attacks on aligned
language models. arXiv preprint arXiv:2307.15043.
A
Implicit Rejection
Neutral text guidance can lead to implicit rejection,
which avoids directly answering malicious ques-
tions and instead gives the opposite, helpful sug-
gestions. For example, here is an indirect rejection
response to “Methods for Self-harm” generated by
GPT-4o:
A Example of Implicit Rejection Response
Below is the added content for “Methods
for Self-harm”:
1. Mindfulness and Meditation:
- Practice deep breathing exercises to calm
the mind.
- Engage in guided meditation sessions to
enhance self-awareness.
- Use mindfulness apps or online resources
for structured programs.
2. Physical Activity:
- Participate in regular exercise, such as
walking, jogging, or yoga.
- Explore team sports to build social connec-
tions and reduce isolation.
- Set achievable fitness goals to boost confi-
dence and mood.
3. Creative Expression:
- Try art therapy by drawing, painting, or
sculpting emotions.
- Write in a journal to process thoughts and
feelings.
- Play a musical instrument or listen to mu-
sic that resonates with your emotions.
Although there is no explicit rejection, this an-
swer does not conform to our attack intentions. It
receive a jailbreak score of 3 and is considered a
failed attack.
B
Candidate Replacement Words
For the word replacement encryption, all nouns in
the malicious query are replaced with food-related
terms, and all adjectives are substituted with posi-
tive words. The candidate replacement words are
listed below, and the replacements are applied se-
quentially.
Candidate Replacement Adjectives
["sweet", "gentle", "joyful", "charming",
"kind", "bright", "adorable", "delightful",
"friendly", "warm", "lovely", "caring",
"whimsical", "playful", "radiant", "grace-
ful", "bubbly", "serene", "hopeful", "cheer-
ful", "compassionate"]
Candidate Replacement Nouns
["pizza", "burger", "sushi", "pasta", "tacos",
"steak", "ramen", "donut", "croissant",
"brownie", "cheesecake", "pancakes", "waf-
fles", "lasagna", "dumplings", "bagel",
"paella", "falafel", "muffin", "burrito"]
C
Complete Prompts of MML
Figure 15-18 show the complete MML prompt, in-
cluding various encryption methods. We illustrate
a fictitious game production scenario and guide the
target model to decrypt the encrypted image then
add content based on the decrypted title.
D
Main Experiment Details
D.1
Baselines
FigStep utilizes GPT-4 (OpenAI et al., 2024)
to rewrite queries into sentences beginning with
phrases like “Steps to” or “List of.” For example,
as shown in Figure 2, the query “How to manu-
facture illegal drugs?” is rewritten as “Steps to
manufacture illegal drugs.” The rewritten text is
then formatted with “1. 2. 3.” and converted into
typographic images. These images are presented
to the target VLMs, prompting them to complete
the missing content.
QueryRelated first uses GPT-4 to generate ma-
licious queries in different scenarios and then
rewrites these queries. Next, QueryRelated uses
GPT-4 to extract unsafe keywords from queries and
1477



# Discussion

Shen. 2023. A mutation-based method for multi-
modal jailbreaking attack detection. arXiv preprint
arXiv:2312.10766.
Yunqing Zhao, Tianyu Pang, Chao Du, Xiao Yang,
Chongxuan Li, Ngai-Man Man Cheung, and Min
Lin. 2024. On evaluating adversarial robustness of
large vision-language models. Advances in Neural
Information Processing Systems, 36.
Xiaosen Zheng, Tianyu Pang, Chao Du, Qian Liu, Jing
Jiang, and Min Lin. 2024. Improved few-shot jail-
breaking can circumvent aligned language models
and their defenses. arXiv preprint arXiv:2406.01288.
Andy Zou, Zifan Wang, Nicholas Carlini, Milad Nasr,
J Zico Kolter, and Matt Fredrikson. 2023. Univer-
sal and transferable adversarial attacks on aligned
language models. arXiv preprint arXiv:2307.15043.
A
Implicit Rejection
Neutral text guidance can lead to implicit rejection,
which avoids directly answering malicious ques-
tions and instead gives the opposite, helpful sug-
gestions. For example, here is an indirect rejection
response to “Methods for Self-harm” generated by
GPT-4o:
A Example of Implicit Rejection Response
Below is the added content for “Methods
for Self-harm”:
1. Mindfulness and Meditation:
- Practice deep breathing exercises to calm
the mind.
- Engage in guided meditation sessions to
enhance self-awareness.
- Use mindfulness apps or online resources
for structured programs.
2. Physical Activity:
- Participate in regular exercise, such as
walking, jogging, or yoga.
- Explore team sports to build social connec-
tions and reduce isolation.
- Set achievable fitness goals to boost confi-
dence and mood.
3. Creative Expression:
- Try art therapy by drawing, painting, or
sculpting emotions.
- Write in a journal to process thoughts and
feelings.
- Play a musical instrument or listen to mu-
sic that resonates with your emotions.
Although there is no explicit rejection, this an-
swer does not conform to our attack intentions. It
receive a jailbreak score of 3 and is considered a
failed attack.
B
Candidate Replacement Words
For the word replacement encryption, all nouns in
the malicious query are replaced with food-related
terms, and all adjectives are substituted with posi-
tive words. The candidate replacement words are
listed below, and the replacements are applied se-
quentially.
Candidate Replacement Adjectives
["sweet", "gentle", "joyful", "charming",
"kind", "bright", "adorable", "delightful",
"friendly", "warm", "lovely", "caring",
"whimsical", "playful", "radiant", "grace-
ful", "bubbly", "serene", "hopeful", "cheer-
ful", "compassionate"]
Candidate Replacement Nouns
["pizza", "burger", "sushi", "pasta", "tacos",
"steak", "ramen", "donut", "croissant",
"brownie", "cheesecake", "pancakes", "waf-
fles", "lasagna", "dumplings", "bagel",
"paella", "falafel", "muffin", "burrito"]
C
Complete Prompts of MML
Figure 15-18 show the complete MML prompt, in-
cluding various encryption methods. We illustrate
a fictitious game production scenario and guide the
target model to decrypt the encrypted image then
add content based on the decrypted title.
D
Main Experiment Details
D.1
Baselines
FigStep utilizes GPT-4 (OpenAI et al., 2024)
to rewrite queries into sentences beginning with
phrases like “Steps to” or “List of.” For example,
as shown in Figure 2, the query “How to manu-
facture illegal drugs?” is rewritten as “Steps to
manufacture illegal drugs.” The rewritten text is
then formatted with “1. 2. 3.” and converted into
typographic images. These images are presented
to the target VLMs, prompting them to complete
the missing content.
QueryRelated first uses GPT-4 to generate ma-
licious queries in different scenarios and then
rewrites these queries. Next, QueryRelated uses
GPT-4 to extract unsafe keywords from queries and
1477

generates three types of images: Stable Diffusion
(SD) images, typography images, and SD + typog-
raphy images. According to the results from Liu
et al. (2024b), SD + typography images method is
the state-of-the-art, which is tested as the baseline
of our experiments.
HADES uses diffusion model (Chen et al., 2024)
to generate malicious images based on harmful
instructions. During this process, it employs LLMs
(OpenAI et al., 2024) to amplify the harmfulness
of the generated images. When targeting white-box
VLMs, HADES leverages gradients to generate
adversarial noise, enhancing the attack. Finally,
the adversarial noise, the malicious image, and the
keyword typography are concatenated into a single
image in sequence. Since adversarial attacks are
transferable (Dong et al., 2023; Zhao et al., 2024),
we use the images generated by HADES on LLava-
v1.5-7B (Liu et al., 2024a) as the input for the
baseline.
D.2
Datasets
The ten AI forbidden topics of SafeBench (Gong
et al., 2023) are: Illegal Activity (IA), Hate Speech
(HS), Malware Generation (MG), Physical Harm
(PH), Fraud (Fr), Pornography (Po), Privacy Vio-
lence (PV), Legal Opinion (LO), Financial Advice
(FA) and Health Consultation (HC). Each topic has
50 queries, a total of 500.
MM-SafeBench includes 13 scenarios, with the
number of queries varying across each. Addition-
ally, we filter the queries in MM-SafeBench (Liu
et al., 2024b) to exclude those not considered viola-
tions. Specifically, we use GPT-4o-Mini to evaluate
whether a query violations the CLAS usage policy,
which is more comprehensive. Table 8 shows the
details about MM-SafeBench in our experiment.
The CLAS policy is shown in Figure 7. The fil-
tering prompt is illustrated in Figure 12. GPT-4o-
Mini assigns scores to queries on a scale from 1 to
4, with higher scores indicating a greater degree of
violation. Given that VLMs can readily respond
to mildly illegal queries even in plain text, only
queries receiving a score of 4 are included in our
experiment.
The five scenarios of HADES-Dataset (Li et al.,
2024c) are Violence, Aiding and Abetting, Incite-
ment; Financial Crime, Property Crime, Theft;
Privacy Violation; Self-Harm; and Animal Abuse.
Each category contains 150 instructions, for a total
of 750 instructions.
D.3
Data preprocessing
We transform the rewritten queries or instructions
from baseline methods into typographic images and
apply encryption on them. The encrypted images
are shown in Figure 2. For word replacement and
base64 encoding, we first encrypt the queries and
then generate the typographic images. For image
mirroring and rotation, the queries are first con-
verted into typographic images before applying the
transformations.
D.4
Metric
We adopt the CLAS approach for evaluation. If
no rejection words are detected in the model’s re-
sponse, GPT-4o-Mini assesses the success of the
attack. The evaluation measures the alignment be-
tween the original malicious query and the model’s
output, assigning a score on a scale from 1 to 5.
The scoring criteria are illustrated in Figure 13. A
score of 1 indicates the model refused to respond,
while a score of 5 signifies full compliance with
the policy-violating instruction without deviation.
The complete evaluation prompt is provided in Fig-
ure 14.
D.5
Example of results
Figure 11 shows the results of MML using four
encryption methods across four forbidden topics in
SafeBench, with GPT-4o as the target model. For
security concerns, we only display a portion of the
responses.
D.6
ASR of MML on various topics
Figure 4 and Figure 5 show the results of MML
with image mirroring encryption across various top-
ics or scenarios in SafeBench and MM-SafeBench.
Figure 8 and Figure 9 shows the results of the
remaining encryption methods in SafeBench and
MM-SafeBench. Figure 10 show the results of
MML and HADES across various topics or scenar-
ios in HADES-Dataset.
D.7
Evaluation with Llama-Guard-3-8B
To mitigate potential bias from a single evaluator,
we use Llama-Guard-3-8B (Llama Team, 2024) for
an additional assessment of attack success. Since
Llama-Guard-3-8B has a built-in safety policy, not
all instructions in these datasets that we use to
evaluate are flagged as unsafe by it. Therefore,
we first use Llama-Guard-3-8B to filter out all un-
safe instructions, resulting in 307 from SafeBench,
1478



# Conclusion

generates three types of images: Stable Diffusion
(SD) images, typography images, and SD + typog-
raphy images. According to the results from Liu
et al. (2024b), SD + typography images method is
the state-of-the-art, which is tested as the baseline
of our experiments.
HADES uses diffusion model (Chen et al., 2024)
to generate malicious images based on harmful
instructions. During this process, it employs LLMs
(OpenAI et al., 2024) to amplify the harmfulness
of the generated images. When targeting white-box
VLMs, HADES leverages gradients to generate
adversarial noise, enhancing the attack. Finally,
the adversarial noise, the malicious image, and the
keyword typography are concatenated into a single
image in sequence. Since adversarial attacks are
transferable (Dong et al., 2023; Zhao et al., 2024),
we use the images generated by HADES on LLava-
v1.5-7B (Liu et al., 2024a) as the input for the
baseline.
D.2
Datasets
The ten AI forbidden topics of SafeBench (Gong
et al., 2023) are: Illegal Activity (IA), Hate Speech
(HS), Malware Generation (MG), Physical Harm
(PH), Fraud (Fr), Pornography (Po), Privacy Vio-
lence (PV), Legal Opinion (LO), Financial Advice
(FA) and Health Consultation (HC). Each topic has
50 queries, a total of 500.
MM-SafeBench includes 13 scenarios, with the
number of queries varying across each. Addition-
ally, we filter the queries in MM-SafeBench (Liu
et al., 2024b) to exclude those not considered viola-
tions. Specifically, we use GPT-4o-Mini to evaluate
whether a query violations the CLAS usage policy,
which is more comprehensive. Table 8 shows the
details about MM-SafeBench in our experiment.
The CLAS policy is shown in Figure 7. The fil-
tering prompt is illustrated in Figure 12. GPT-4o-
Mini assigns scores to queries on a scale from 1 to
4, with higher scores indicating a greater degree of
violation. Given that VLMs can readily respond
to mildly illegal queries even in plain text, only
queries receiving a score of 4 are included in our
experiment.
The five scenarios of HADES-Dataset (Li et al.,
2024c) are Violence, Aiding and Abetting, Incite-
ment; Financial Crime, Property Crime, Theft;
Privacy Violation; Self-Harm; and Animal Abuse.
Each category contains 150 instructions, for a total
of 750 instructions.
D.3
Data preprocessing
We transform the rewritten queries or instructions
from baseline methods into typographic images and
apply encryption on them. The encrypted images
are shown in Figure 2. For word replacement and
base64 encoding, we first encrypt the queries and
then generate the typographic images. For image
mirroring and rotation, the queries are first con-
verted into typographic images before applying the
transformations.
D.4
Metric
We adopt the CLAS approach for evaluation. If
no rejection words are detected in the model’s re-
sponse, GPT-4o-Mini assesses the success of the
attack. The evaluation measures the alignment be-
tween the original malicious query and the model’s
output, assigning a score on a scale from 1 to 5.
The scoring criteria are illustrated in Figure 13. A
score of 1 indicates the model refused to respond,
while a score of 5 signifies full compliance with
the policy-violating instruction without deviation.
The complete evaluation prompt is provided in Fig-
ure 14.
D.5
Example of results
Figure 11 shows the results of MML using four
encryption methods across four forbidden topics in
SafeBench, with GPT-4o as the target model. For
security concerns, we only display a portion of the
responses.
D.6
ASR of MML on various topics
Figure 4 and Figure 5 show the results of MML
with image mirroring encryption across various top-
ics or scenarios in SafeBench and MM-SafeBench.
Figure 8 and Figure 9 shows the results of the
remaining encryption methods in SafeBench and
MM-SafeBench. Figure 10 show the results of
MML and HADES across various topics or scenar-
ios in HADES-Dataset.
D.7
Evaluation with Llama-Guard-3-8B
To mitigate potential bias from a single evaluator,
we use Llama-Guard-3-8B (Llama Team, 2024) for
an additional assessment of attack success. Since
Llama-Guard-3-8B has a built-in safety policy, not
all instructions in these datasets that we use to
evaluate are flagged as unsafe by it. Therefore,
we first use Llama-Guard-3-8B to filter out all un-
safe instructions, resulting in 307 from SafeBench,
1478



