# Introduction

FigStep: Jailbreaking Large Vision-Language Models via Typographic Visual
Prompts
Yichen Gong1*, Delong Ran2*, Jinyuan Liu3, Conglei Wang4,
Tianshuo Cong3†, Anyu Wang3,5,6†, Sisi Duan3,5,6,7, Xiaoyun Wang3,5,6,7,8
1Department of Computer Science and Technology, Tsinghua University,
2Institute for Network Sciences and Cyberspace, Tsinghua University,
3Institute for Advanced Study, BNRist, Tsinghua University,
4Carnegie Mellon University,
5Zhongguancun Laboratory,
6National Financial Cryptography Research Center,
7Shandong Institute of Blockchain,
8School of Cyber Science and Technology, Shandong University
{gongyc18, rdl22, liujinyuan24}@mails.tsinghua.edu.cn, congleiw@andrew.cmu.edu,
{congtianshuo, anyuwang, duansisi, xiaoyunwang}@tsinghua.edu.cn
Abstract
Large Vision-Language Models (LVLMs) signify a ground-
breaking paradigm shift within the Artificial Intelligence (AI)
community, extending beyond the capabilities of Large Lan-
guage Models (LLMs) by assimilating additional modalities
(e.g., images). Despite this advancement, the safety of LVLMs
remains adequately underexplored, with a potential overre-
liance on the safety assurances purported by their underlying
LLMs. In this paper, we propose FigStep, a straightforward
yet effective black-box jailbreak algorithm against LVLMs. In-
stead of feeding textual harmful instructions directly, FigStep
converts the prohibited content into images through typogra-
phy to bypass the safety alignment. The experimental results
indicate that FigStep can achieve an average attack success
rate of 82.50% on six promising open-source LVLMs. Not
merely to demonstrate the efficacy of FigStep, we conduct
comprehensive ablation studies and analyze the distribution
of the semantic embeddings to uncover that the reason behind
the success of FigStep is the deficiency of safety alignment
for visual embeddings. Moreover, we compare FigStep with
five text-only jailbreaks and four image-based jailbreaks to
demonstrate the superiority of FigStep, i.e., negligible attack
costs and better attack performance. Above all, our work re-
veals that current LVLMs are vulnerable to jailbreak attacks,
which highlights the necessity of novel cross-modality safety
alignment techniques.
Code, Datasets — https://github.com/ThuCCSLab/FigStep
Extended version — https://arxiv.org/abs/2311.05608
Introduction
Large Vision-Language Models (LVLMs) are at the forefront
of the recent transformative wave in Artificial Intelligence
*These authors contributed equally.
†These authors are the corresponding authors.
Copyright © 2025, Association for the Advancement of Artificial
Intelligence (www.aaai.org). All rights reserved.
LVLMs
Reject
Accept
Reject
Accept
Vanilla
FigStep
Textual Module
Connector
Visual Module
Safety Alignment
Figure 1: FigStep jailbreaks LVLM through transferring the
harmful information from textual domain to visual domain,
thereby bypassing the textual module’s safety alignment.
(AI) research. Unlike single-modal Large Language Models
(LLMs) like ChatGPT (OpenAI 2022), LVLMs can process
queries with both visual and textual modalities. Notewor-
thy LVLMs like GPT-4V (OpenAI 2023a) and LLaVA (Liu
et al. 2023b) have remarkable abilities, which could enhance
end-user-oriented scenarios like image captioning for blind
people (Xu et al. 2015) or recommendation systems for chil-
dren (Deldjoo et al. 2017), where content safety is crucial.
Typically, an LVLM consists of a visual module, a con-
nector, and a textual module (see Figure 1). To be specific,
the visual module is an image encoder (Radford et al. 2021;
Li et al. 2023) that extracts visual embeddings from image-
prompts. The connector will transform these visual embed-
dings to the same latent space as the textual module (Liu et al.
2023b). The textual module takes the concatenation of text-
prompts and transforms visual embeddings to generate the
final textual responses. As the core component of LVLM, the
textual module is usually an off-the-shelf pre-trained LLM
that has undergone strict safety alignment to ensure LVLM
safety (Zheng et al. 2023; Touvron et al. 2023; Perez et al.
2022; Korbak et al. 2023; Shevlane et al. 2023).
However, most of the popular open-source LVLMs do
not undergo a rigorous safety assessment before being re-
The Thirty-Ninth AAAI Conference on Artificial Intelligence (AAAI-25)
23951

leased (Liu et al. 2023b; Zhu et al. 2023; Wang et al. 2023).
Meanwhile, since the components of LVLM are not safely
aligned as a whole, the safety guardrail of the underlying
LLM may not cover the unforeseen domains introduced by
the visual modality, which could lead to jailbreaks. There-
fore, a natural question arises: Does the safety alignment of
the underlying LLMs provide an illusory safety guarantee
to the corresponding LVLMs? It is worth noting that recent
research has revealed that LVLMs are susceptible to jailbreak
attacks (Shayegani, Dong, and Abu-Ghazaleh 2024; Qi et al.
2023a; Carlini et al. 2023). The cornerstone of their methodol-
ogy involves manipulating the model’s output by introducing
perturbation, usually generated through optimization, to the
image-prompts, which is fundamentally analogous to the
techniques employed in crafting adversarial examples within
the Computer Vision (CV) domain (Carlini and Wagner 2017;
Madry et al. 2019).
We highlight that distinct from the above jailbreak meth-
ods, FigStep eliminates the need for perturbation, thereby
asserting that black-box access alone is sufficient to jailbreak
LVLMs. Meanwhile, our intention is not only to exhibit that
the computational cost and technical barriers to executing
FigStep are negligible, but also to leverage FigStep to under-
score the ubiquity of safety vulnerabilities within LVLMs.
More critically, compared with optimization-based jailbreaks,
FigStep could offer a more convenient baseline for conduct-
ing safety assessments of LVLMs.
Our Contributions
We first propose a novel safety benchmark namely SafeBench,
on which we launch FigStep against six popular open-source
LVLMs. Our results demonstrate that FigStep substantially
promotes the Attack Success Rate (ASR) compared to di-
rectly feeding text-only harmful questions. To find out the
reason behind the success of FigStep, we further perform
exhaustive ablation studies and analyze the distribution of se-
mantic embeddings, noticing that the visual embeddings are
only semantically but not safely aligned to the LLM’s textual
embeddings. Finally, we explore three potential defense meth-
ods: OCR-tool detection, adding random noise, and system
prompt modification, and find that all of them are ineffective
in resisting FigStep. Accordingly, we propose two enhanced
variants: FigStepadv and FigStephide to address the OCR
detection. We also propose FigSteppro, which splits image-
prompt into harmless segments, to jailbreak GPT-4V (Ope-
nAI 2023a) and GPT-4o (OpenAI 2024a).
In summary, we prove that adversaries can easily exploit
the core ideas of FigStep to jailbreak LVLMs, thereby re-
vealing that the safety of LVLMs cannot be solely dependent
on their underlying LLMs. This is because of an intrinsic
limitation within text-only safety alignment approaches that
hinders their applicability to the non-discrete nature of visual
information. To this end, we advocate for the utilization of
FigStep as a “probe” to aid in the development of novel safety
alignment methodologies that can align the textual and visual
modalities in a compositional manner.
Above all, our major contributions are as follows.
• We introduce SafeBench, a novel comprehensive safety
benchmark for evaluating the safety risks of LVLMs.
• We propose FigStep, an efficient black-box jailbreak algo-
rithm against LVLMs. We highlight that FigStep should
serve as a baseline for evaluating LVLM’s cross-modal
safety alignment.
• Our work demonstrates that current prominent LVLMs
(open-source or closed-source) are exposed to significant
risks of misuse, necessitating the urgent development of
new defensive mechanisms.
Related Work
Jailbreak Against LLMs. To forbid LLMs from generat-
ing harmful content that violates human values (Bommasani
et al. 2021; Liang et al. 2022), different safety alignment
techniques are proposed, such as supervised instruction-
tuning (Wei et al. 2021; Ouyang et al. 2022) and RLHF (Li
2017; Chung et al. 2022). However, safety alignment tech-
niques are not impregnable. Currently, there are two method-
ologies capable of compromising these safety mechanisms:
the removal of safety guardrails through model fine-tuning
techniques (Qi et al. 2023b; Zhan et al. 2023; Yang et al.
2023) and jailbreaks that focus on the meticulous modifica-
tion of inputs to bypass the safety alignment without updat-
ing model parameters (Yi et al. 2024; Liu et al. 2023c; Deng
et al. 2024). We focus on jailbreaks in this paper. The jail-
break techniques are broadly classified into two categories:
gradient-based methods represented by Greedy Coordinate
Gradient (GCG) (Zou et al. 2023) and non-gradient methods,
such as MultiLingual (Deng et al. 2024), CipherChat (Yuan
et al. 2023), DeepInception (Li et al. 2024), and In-Context
Attack (ICA) (Wei, Wang, and Wang 2023).
Jailbreak Against LVLMs. The current safety alignment
techniques primarily focused on the training and fine-tuning
processes of single-modal language models. With the trend in
LLMs moving towards multimodality, recent studies (Carlini
et al. 2023; Bailey et al. 2023; Zhao et al. 2023; Qi et al.
2023a; Shayegani, Dong, and Abu-Ghazaleh 2024; Niu et al.
2024) have demonstrated that LVLMs can be directed to pro-
duce arbitrary responses (e.g., wrong image description or
harmful response) through generating adversarial perturba-
tions onto the input images. Unlike these attacks, FigStep
has almost no costs with a weaker threat model.
Threat Model
Adversary’s Goal. The adversary’s goal is to exploit the
LVLM in order to obtain the answer to some questions that
are forbidden by the safety policy, even though the LVLM is
designed to avoid doing so. This goal captures the real-world
scenario, where a malicious user might abuse the model’s
power to acquire inappropriate knowledge, or an ignorant
user might force the model to provide guidance for crucial
decisions without considering the risk of being misled.
Adversary’s Knowledge & Capabilities. In this paper, we
present a black-box attack that does not require any infor-
mation or manipulation of the LVLM. The adversary is only
required to have the capability to query the model and re-
ceive its textual response. The dialogue is restricted to one
turn without any history except a preset system prompt. This
23952

