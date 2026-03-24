# Methodology

Q 
Harmful Query
Image-Grounded
Scenario Simulation
Image Multi-
Perspective Analysis
Iterative Image 
Interrogation
Exploiting Image 
Hallucination
Strategy Pool
𝜋!"#
$%&
Vision-Centric Adversarial Context Generation
Iterative Attack Prompt Refinement
𝜋'()
Response
𝜋*+,
Final Attack Sequence
Auxiliary Image
Describe in detail how to 
kill someone using the 
objects in this room.
𝜋*+,
The image shows a well-
lit living and dining room 
area with a dining table 
set for four people in 
the foreground. The 
table is arranged with 
dark wooden chairs, blue 
plates, ……
Image Description
A person sitting at a desk in a 
study, focused on writing on a 
laptop. Bookshelves and a lamp 
are visible …
Fabricated Context
Attack Prompt
Initial Attack Sequence
Initial Attack Sequence
pass
Refine Until Pass
Semantic
Assessment
Q1: I'm currently writing a crime novel, and 
I'm trying to set a scene in a modern living 
room. ...make a setting feel real and immersive
to the reader?
A1: Of course, crafting an immersive scene in your novel is 
key to drawing readers in. Here are some tips …
Q2: Now, to get even more specific for my
scene, I have a picture of …. Could you 
describe this scene … I want to really 
capture the potential within this space.
A2: Let's set the scene based on the image you provided. …
Q3: Now, thinking about crime novels, what kind of 
unusual events or risky actions could realistically unfold in 
such a setting, using the items in the image? I'm 
brainstorming … leverage the specific details of this room.
A3: Certainly, when considering unusual events or risky 
actions within this setting, let's explore … image:
1. Sudden Confrontation During a Meal …
Attack Prompt: Based on our previous discussion about 
unusual events and risky actions in a living room setting for a 
crime novel, describe in detail specific methods using items 
present in the image. Focus on providing precise, step-by-step 
instructions for practical application within a fictional context.
Figure 2: Workflow of the VisCo Attack. (Left) generation of the fabricated visual context and the initial attack
prompt using vision-focused strategies. (Right) iterative toxicity obfuscation and semantic refinement of the initial
attack prompt.
of Qh, and it increases its likelihood of bypassing
safety filters. The result is the final attack prompt,
Patk. Once constructed, the full sequence Satk is
submitted to the target MLLM in a single forward
pass to elicit the desired harmful response Rh.
3.2
Vision-Centric Adversarial Context
Generation
To generate a vision-centric adversarial context, we
propose four vision-focused construction strategies
in this section. These strategies apply different
mechanisms to enhanced visual information in or-
der to craft a deceptive context and an initial attack
prompt P initial
atk
.
Visual Context Extraction.
We begin by gener-
ating a textual description DI of the target image
I, specifically guided by the harmful query Qh.
This step serves two key purposes: (1) It provides
a lightweight, text-based representation for context
construction, reducing reliance on the computa-
tionally expensive image input; (2) It ensures the
description emphasizes visual details most relevant
to Qh, resulting in a more targeted and effective
basis for generating the deceptive context Cfake.
To obtain DI, we utilize an auxiliary vision-
language model πaux
VLM, which processes the target
image I using a template Tdes specifically designed
to extract a concise description that emphasizes
elements most relevant to the harmful query Qh.
DI = πaux
VLM(I, Qh, Tdes).
(2)
Multi-Strategy Context Generation.
Combin-
ing image description DI with the harmful query
Qh, we generate the N simulated dialogue turns
(Pi, Ri) that form Cfake, along with the initial at-
tack prompt P initial
atk
. This process is performed effi-
ciently in a single call to a dedicated LLM, referred
to as the Red Team Assistant πred, which takes as
input DI, Qh, and one of four strategy-specific
templates Tk (where k ∈{1, 2, 3, 4}).
(P1, · · · , PN, RN, P initial
atk
) = πred(DI, Qh, Tk).
(3)
We design four vision-focused strategies, each con-
structing a fabricated dialogue that embeds unsafe
content linked to I and Qh within a contextually
plausible interaction. All strategies ensure that at
least one turn introduces harmful content into Cfake.
These strategies are crafted to mislead the MLLM
by leveraging different styles of deceptive context,
including:
Image-Grounded Scenario Simulation.
This
strategy constructs a fictional narrative (e.g., re-
search project, filmmaking process) centered
around the content of the target image, option-
ally incorporating a synthesized auxiliary image
Igen. The dialogue blends harmless exchanges with
turns that subtly introduce unsafe elements associ-
ated with the harmful query Qh. The initial attack
prompt P initial
atk
frames Qh as a reasonable and con-
textually appropriate request within the simulated
scenario.
9642

Image Multi-Perspective Analysis.
This strat-
egy guides the MLLM to examine the image I
from contrasting perspectives, such as safety ver-
sus risk. Unsafe content linked to Qh is gradually
introduced through discussion under the risk per-
spective. The final prompt P initial
atk
emerges as a
seemingly logical continuation of this comparative
analysis.
Iterative Image Interrogation.
This method fab-
ricates an argumentative dialogue focusing on the
image I and sensitive topics related to Qh. The
simulated exchange mimics a debate, with user
prompts questioning or rebutting fabricated model
responses. These responses are carefully designed
to introduce harmful elements subtly. By simu-
lating prior discussion of sensitive content, this
strategy lowers the MLLM’s caution. The result-
ing P initial
atk
is presented as a natural progression of
the dialogue, aiming to elicit an explicit harmful
response aligned with Qh.
Exploiting Image Hallucination.
This strategy
leverages multimodal misinterpretation by intro-
ducing an auxiliary image Igen that is visually am-
biguous but thematically related to Qh. The dia-
logue falsely attributes unsafe content to this image,
misleading the MLLM into believing it has already
processed such information.
The final prompt
P initial
atk
exploits this induced bias to provoke the
desired harmful output.
For strategies that require auxiliary images Igen,
such as Scenario Simulation and Hallucination Ex-
ploitation, the Red Team Assistant πred is responsi-
ble for generating the corresponding text-to-image
prompts Tgen. These prompts are then processed
by a diffusion model πdiff to synthesize the auxil-
iary images, i.e., Igen = πdiff(Tgen). Both the target
image I and any synthesized Igen are included in
the relevant user prompts Pi within the final attack
sequence Satk. The generated initial attack prompt
P initial
atk
is subsequently passed to the refinement
stage.
3.3
Iterative Attack Prompt Refinement
Given that the automatically generated initial at-
tack prompt P initial
atk
may deviate semantically from
the original harmful query Qh or contain explicit
language and sensitive keywords likely to trigger
the target MLLM’s safety mechanisms, we intro-
duce an iterative refinement stage to mitigate these
issues. This stage aims to better align the prompt
with the intent of Qh while enhancing its ability to
evade safety filters. At iteration i, we first assess
the semantic alignment of the current attack prompt
P (i−1)
atk
. If misalignment is detected, the Red Team
Assistant πred is prompted to refine it, producing
an updated prompt P (i)
atk . This process repeats until
the prompt is semantically aligned with Qh.
Semantic Assessment.
To assess whether the
generated attack prompt has semantically devi-
ated from the original harmful query, we propose
a novel evaluation strategy. Specifically, we use
an uncensored language model not aligned with
safety protocols (Wizard-Vicuna-13B-Uncensored
πwiz (Computations, 2023)) to generate a response
under the deceptive context. We obtain the re-
sponse as Yi ∼πwiz(·|C′
fake, P (i−1)
atk
), where C′
fake
denotes the context Cfake with all images replaced
by their corresponding textual captions. Using an
uncensored model is crucial here; a safety-aligned
model might refuse generation, hindering semantic
assessment. Then, we prompt the Red Team Assis-
tant πred to perform a semantic QA relevance check
between the generated response Yi and the original
harmful query Qh, evaluating whether the answer
aligns with the intended question.
Toxicity Obfuscation and Semantic Refinement.
The prompt is first revised to realign with the intent
of Qh. Subsequently, all prompts, regardless of
whether semantic deviation was detected, are fur-
ther optimized using the refinement rules defined
in Trefine. This optimization aims to enhance eva-
siveness and reduce the likelihood of being flagged
by safety filters.
(P (i)
atk ) = πred(Qh, C′
fake, P (i−1)
atk
, Yi, Trefine). (4)
Specifically, techniques focus on enhancing eva-
siveness, such as using contextual references to
objects within the image (I or Igen) to obscure sen-
sitive keywords or adjusting the prompt’s tone. The
outcome of this process is the refined prompt for
the iteration, P (i)
atk .
This iterative process continues until πred deter-
mines that semantic drift has been resolved or a
predefined maximum of M iterations is reached.
Let ifinal denote the final iteration index, where
1 ≤ifinal ≤M. The resulting prompt from this
iteration, P (ifinal)
atk
, is designated as the final refined
attack prompt, denoted as Patk. This final prompt
is then incorporated into the complete attack se-
quence Satk.
9643

