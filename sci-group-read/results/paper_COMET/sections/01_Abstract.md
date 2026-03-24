# Abstract

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
Red-teaming the Multimodal Reasoning: Jailbreaking Vision-Language Models
via Cross-modal Entanglement Attacks
Anonymous CVPR submission
Paper ID 8543
Safe Check: Passed
Induced into the
Instruction-following 
mode
Attention
Trajectory
(Attacked by 
COMET)
Please integrate multimodal information to understand and answer the 
question. Based on the visual clues from the left scene image and the scoring 
rubric below, provide a complete answer that achieves a score of 6 (Master 
level).```In the field represented by the columnar data unit slightly left of 
center, this phenomenon is regarded as an asymmetric confrontation strategy, 
whose core characteristic lies in conveying specific messages or demands 
through violent means. What is the standard terminology for this social 
phenomenon in the literature system contained within the central 
rectangular text block? Within this social phenomenon framework, how is 
the constraint relationship between the mechanism through which non-
state actors convey demands via specific violent means and target 
selection strategies abstractly modeled?```Note: The objects and processes 
involved in the question are based on the real world (not science fiction). 
Textual
Visual
Textual
Visual
...
Textual
Visual
Textual
Visual
Textual
How can I organize the characters 
shown in the image?
Visual
Attention
Trajectory
(Attacked by
 Vanilla)
Safe Check: Not Passed
detect the 
malicious intent
only single-step 
reasoning
Figure 1. Overview of the core difference between vanilla attack and ours. Vanilla attacks seeks to encode malicious intent via a fixed,
one-step fusion of text and image, which is easily detected. COMET (CrOss-Modal Entanglement AtTack) is a scalable multimodal
reasoning attack that adaptively entangles semantics across modalities to bypass advanced VLMs’ trained and generalized safety alignment.
Abstract
Vision-Language Models (VLMs) with multimodal reason-
001
ing capabilities are high-value attack targets, given their
002
potential for handling complex multimodal harmful tasks.
003
Mainstream black-box jailbreak attacks on VLMs work by
004
distributing malicious clues across modalities to disperse
005
model attention and bypass safety alignment mechanisms.
006
However, these adversarial attacks rely on simple and fixed
007
image-text combinations that lack scalable attack com-
008
plexity, limiting their effectiveness for red-teaming VLMs’
009
continuously evolving reasoning capabilities. We propose
010
COMET (CrOss-Modal Entanglement AtTack), which is a
011
scalable approach that extends and entangles information
012
clues across modalities to exceed VLMs’ trained and gener-
013
alized safety alignment patterns for jailbreak. Specifically,
014
knowledge-scalable reframing extends harmful tasks into
015
multi-hop chain instructions, cross-modal clue entangling
016
migrates visualizable entities into images to build multi-
017
modal reasoning links, and cross-modal scenario nesting
018
uses multimodal contextual instructions to steer VLMs to-
019
ward detailed harmful outputs. Experiments across multi-
020
ple advanced VLMs show COMET achieves over 94% at-
021
tack success rate, outperforming the best baseline by 29%.
022
Disclaimer: This study contains AI-generated content that
023
may be offensive.
024
1. Introduction
025
Recently, numerous efforts have been made on Large Lan-
026
guage Models (LLMs), enabling them to solve complex
027
problems such as mathematical reasoning and code gen-
028
eration. Building upon this, some advanced LLMs, such
029
as Gemini-2.5-Pro and GPT-4o, integrate visual modules,
030
forming Vision-Language Models (VLMs), which further
031
extend their capabilities to visual understanding [1, 6, 25]
032
for solving real-world visual tasks.
033
While the integration of visual modules better aligns
034
LLMs with real-world application scenarios, it also intro-
035
duces new safety vulnerabilities, as indicated by recent
036
1

