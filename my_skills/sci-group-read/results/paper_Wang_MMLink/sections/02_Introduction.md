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

