# Conclusion

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

