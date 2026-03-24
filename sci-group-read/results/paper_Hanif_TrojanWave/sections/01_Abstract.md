# Abstract

Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing, pages 18629–18645
November 4-9, 2025 ©2025 Association for Computational Linguistics
TrojanWave: Exploiting Prompt Learning for Stealthy Backdoor Attacks
on Large Audio-Language Models
Asif Hanif1, Maha Tufail Agro1, Fahad Shamshad1, Karthik Nandakumar1,2
1Mohamed Bin Zayed University of Artificial Intelligence, UAE
2Michigan State University, USA
{asif.hanif, maha.agro, fahad.shamshad, karthik.nandakumar}@mbzuai.ac.ae
Abstract
Prompt learning has emerged as an efficient
alternative to full fine-tuning for adapting large
audio-language models (ALMs) to downstream
tasks. While this paradigm enables scalable de-
ployment via Prompt-as-a-Service frameworks,
it also introduces a critical yet underexplored
security risk of backdoor attacks. In this work,
we present TrojanWave, the first backdoor at-
tack tailored to the prompt-learning setting in
frozen ALMs. Unlike prior audio backdoor
methods that require training from scratch on
full datasets, TrojanWave injects backdoors
solely through learnable prompts, making it
highly scalable and effective in few-shot set-
tings. TrojanWave injects imperceptible audio
triggers in both time and spectral domains to ef-
fectively induce targeted misclassification dur-
ing inference. To mitigate this threat, we further
propose TrojanWave-Defense, a lightweight
prompt purification method that neutralizes ma-
licious prompts without hampering the clean
performance. Extensive experiments across 11
diverse audio classification benchmarks demon-
strate the robustness and practicality of both the
attack and defense. Our code is publicly avail-
able at Github†.
1
Introduction
Recent advancements in audio language models
(ALMs) have demonstrated remarkable capabili-
ties across diverse acoustic processing tasks (Su
et al., 2025). These models, trained on vast audio-
text datasets using contrastive objectives, excel
in acoustic scene classification, audio captioning,
emotion recognition, and spoken command under-
standing with minimal task-specific adaptation (Wu
et al., 2024a; Latif et al., 2023). Due to their im-
pressive performance, their applications have ex-
panded into critical domains including healthcare
monitoring, security surveillance, and voice-based
authentication systems. However, recent studies
†https://asif-hanif.github.io/trojanwave/
have shown that ALMs are vulnerable to adversar-
ial attacks (Kang et al., 2024; Goodfellow et al.,
2014), raising concerns about the reliability of
these widely adopted models (Kang et al., 2024).
Among the adversarial threats facing ALMs,
backdoor attacks are particularly concerning due to
their stealth and potential harm (Yan et al., 2024).
In such attacks, an adversary injects a small number
of poisoned samples into the training data, causing
the model to associate a specific, often impercep-
tible, audio trigger with an attacker-chosen label.
The compromised model performs normally on
clean inputs but reliably misclassifies any input
containing the trigger, enabling the attack to re-
main undetected. The stakes are particularly high
given ALMs’ integration into sensitive applications,
where an undetected backdoor could compromise
voice authentication systems, enable surveillance
evasion, or cause dangerous misclassifications in
safety-critical contexts (Lan et al., 2024).
Meanwhile, prompt learning has emerged as a
parameter-efficient alternative to full fine-tuning
for adapting large ALMs to downstream tasks (Liu
et al., 2023). Instead of updating all model weights,
it introduces a small set of trainable embeddings, re-
ferred to as soft or audio prompts, optimized on lim-
ited data to guide the frozen model toward the tar-
get task. Recent work has shown its effectiveness
across diverse audio classification tasks, achieving
performance comparable to full fine-tuning with
significantly lower computational cost (Hanif et al.,
2024a; Seth et al., 2024). Owing to its efficiency
and minimal parameter overhead, prompt learn-
ing has become the default strategy for deploying
ALMs in resource-constrained settings.
As prompt learning gains adoption, Prompt-as-
a-Service (PaaS) has emerged as a scalable frame-
work for adapting ALMs (Ding et al., 2021; Wu
et al., 2024b). In this setup, third-party providers
release optimized prompts that users combine with
their private data for inference on a frozen model,
18629

