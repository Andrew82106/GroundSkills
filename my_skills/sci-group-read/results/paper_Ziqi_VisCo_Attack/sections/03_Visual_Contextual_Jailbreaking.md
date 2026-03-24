# Visual Contextual Jailbreaking

mented by combining safe images and text inputs
to trigger harmful responses from MLLMs (Cui
et al., 2024; Zhou et al., 2024a).
In-Context Jailbreak.
In-context jailbreak lever-
ages the contextual understanding ability of lan-
guage models to elicit unsafe outputs, typically by
manipulating the input prompt (Liu et al., 2024c,
2025a; Li et al., 2024; Zhang et al., 2024). Wei
et al. (2023); Anil et al. (2024); Miao et al. (2025)
inject harmful context examples before malicious
queries to induce jailbreak behavior. Vega et al.
(2023) exploit the model’s preference for coher-
ent completions by appending an incomplete but
affirmatively phrased sentence after the query, co-
ercing the model to continue with unsafe content.
Kuo et al. (2025) manually simulate the reasoning
chain of harmful queries and inject such reason-
ing into the context as an attack. Recent work has
also shifted focus to manipulating LLM dialogue
history. Russinovich and Salem (2025) construct
fixed-format conversations that make the model
believe it has already agreed to provide sensitive
information. Meng et al. (2025) fabricate affirma-
tive assistant responses within fake dialogue history
and use “continue” prompts or delayed responses
to guide the model toward unsafe outputs. How-
ever, these methods are designed for LLM-only
contexts and typically rely on affirmative suffixes
or in-context demonstrations. In contrast, we con-
struct semantically coherent multi-turn deceptive
conversations that effectively embed vision-centric
manipulated dialogue histories, closely mimick-
ing natural interactions between the user and the
model.
Multi-turn Jailbreak.
Multi-turn jailbreak at-
tacks aim to avoid directly exposing harmful intent
in a single interaction by decomposing the intent
and gradually guiding the model to unsafe outputs
through continued dialogue (Wang et al., 2025).
Russinovich et al. (2024); Zhou et al. (2024b);
Weng et al. (2025) start from seemingly benign
exchanges and progressively escalate toward harm-
ful objectives. Yang et al. (2024b) adopt seman-
tically driven construction strategies that leverage
context progression to elicit sensitive outputs step
by step. Ren et al. (2024); Rahman et al. (2025)
further explore diverse multi-turn attack paths for
breaking model alignment.
3
Visual Contextual Jailbreaking
Our attack methodology focuses on bypassing the
safety mechanisms of a target MLLM in a black-
box setting. This is accomplished by constructing
a deceptive multi-turn context that precedes the ac-
tual harmful query. The core process involves gen-
erating a fabricated dialogue history and then refin-
ing the final attack prompt, which is subsequently
used to execute the complete sequence against the
target model.
3.1
Problem Formulation
The problem setting involves a target MLLM, a tar-
get image I, and a harmful query Qh. This query is
crafted to exploit the model’s understanding of the
visual content in I, aiming to trigger a response that
violates the MLLM’s safety policies. The attack
critically relies on the model’s ability to perceive
and reason over visual inputs, making the image
I an essential component of the adversarial setup.
Specifically, our goal is to construct a multimodal
input sequence Satk that elicits a harmful response
Rh that fulfills the intent of the original harmful
query Qh, which is closely tied to the visual con-
tent. The attack sequence Satk is organized as a
multi-turn conversation, where fabricated context
is used to “shield” the final attack prompt, enabling
it to trigger the targeted unsafe behavior.
Satk = (P1, R1, P2, R2, . . . , PN, RN, Patk), (1)
where (P1, R1, · · · , PN, RN) constitutes the de-
ceptive context Cfake, consisting of N simulated
user-model interaction rounds designed to mislead
the MLLM. The final prompt Patk, refined from the
original harmful query Qh, is crafted to effectively
trigger the desired unsafe response.
The construction of Satk involves two main
stages. In the deceptive context and initial prompt
generation stage (Section 3.2), N rounds of simu-
lated interactions (Pi, Ri) are generated to form the
deceptive context Cfake. Currently, an initial attack
prompt P initial
atk
is crafted based on the preceding
dialogue and is guided by the harmful query Qh.
The target image I, along with any auxiliary syn-
thesized images Igen, is embedded in relevant user
prompts Pi. In the second Attack Prompt Refine-
ment stage (Section 3.3), the initial prompt P initial
atk
is iteratively optimized to enhance its effectiveness.
This refinement process serves two key purposes:
it aligns the prompt more closely with the intent
9641

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

