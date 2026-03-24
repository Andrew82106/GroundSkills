# Related Work

soning.
Mismatched Visual-Intent.
The attack is inef-
fective when a clear semantic or logical disconnect
exists between the image and the harmful instruc-
tion. VisCRA requires a plausible visual context to
initiate its reasoning chain; without it, the model
cannot form the logical connections for the attack
to proceed.
Unrealistic or Theatrical Scenarios.
Models ex-
hibit robustness when they identify an image as
theatrical or fictional. They then treat the harmful
query as a fictional exercise and refuse to provide
real-world, actionable steps. This points to an ad-
vanced safety mechanism relying on contextual
understanding over simple object recognition.
5.4.2
Future Improvements
Our work reveals that a model’s reasoning process
is a critical vulnerability. Future defenses should
therefore move beyond surface-level moderation to
secure the reasoning chain itself. We suggest two
complementary directions:
Reinforced Process Alignment.
Beyond static
SFT, a hybrid approach with Reinforcement Learn-
ing (RL) could build more adaptive defenses. SFT
can first be used to teach a model the basic skill of
correcting faulty reasoning paths. Process-level RL
can then generalize this skill, using a reward model
that scores entire reasoning trajectories. This would
train the model to develop a robust policy for safe
reasoning, rather than merely memorizing specific
corrections.
Dynamic Reasoning Auditing.
A crucial real-
time safeguard is dynamic auditing. This involves
a secondary "auditor" system that observes the step-
by-step formation of a model’s reasoning chain to
detect anomalous structures indicative of an attack.
By flagging the malicious process as it unfolds,
such a system can interrupt attacks early, providing
a vital defense layer independent of the primary
model’s training.
6
Conclusion
We explored the security risks introduced by en-
hanced visual reasoning in Multimodal Large Rea-
soning Models (MLRMs). Through empirical anal-
ysis, we illustrated that stronger reasoning capa-
bilities paradoxically undermine safety, making
models more prone to producing detailed and co-
herent responses to harmful prompts. To probe this
vulnerability, we proposed VisCRA, a novel jail-
break framework that combines attention-guided
visual masking with a two-stage reasoning induc-
tion strategy. VisCRA effectively manipulates the
model’s reasoning chain to evade safety mecha-
nisms while preserving visual coherence. Exten-
sive experiments across a wide range of open- and
closed-source MLRMs validate the effectiveness
of VisCRA, revealing significantly elevated attack
success rates. These findings expose advanced rea-
soning as a double-edged sword — an asset for task
performance, but also a critical security liability.
Our work highlights the urgent need for reasoning-
aware safety frameworks to safeguard current and
next-generation MLRMs against increasingly so-
phisticated adversarial attacks.
Limitations
Our study mainly focuses on how to leverage
the visual reasoning capabilities of Multimodal
Large Reasoning Models (MLRMs) to amplify
their safety risks. However, developing strategies
to enhance the safety of these models against such
reasoning-based vulnerabilities, while preserving
their core reasoning capabilities, remains an open-
problem for future research.
Ethical Statement
This research investigates security vulnerabilities
within Multimodal Large Reasoning Models (ML-
RMs), particularly those related to their enhanced
visual reasoning capabilities. We introduce our
VisCRA jailbreak method in this work primarily
to highlight and analyze these critical risks. Our
primary objective is to expose such limitations to
promote safer AI development and robust safety
alignments, not to create or facilitate tools for mis-
use. All evaluations are conducted on established
public benchmarks in controlled settings.
Furthermore, all data and artifacts used in this
study were sourced from public repositories, and
our use of these artifacts is consistent with their in-
tended use and adheres to their respective licenses.
Acknowledgements
We thank the anonymous reviewers for their valu-
able feedback. We also utilized AI assistants to
help polish the grammar in this paper. This work is
supported by National Natural Science Foundation
(U22B2017), and International Cooperation Foun-
dation of Hubei Province, China (2024EHA032).
6151

References
Alibaba. 2025. QVQ-Max: A vision-language model
with advanced visual reasoning capabilities. Techni-
cal report, Alibaba Group. Technical Preview.
Shuai Bai, Keqin Chen, Xuejing Liu, Jialin Wang, Wen-
bin Ge, Sibo Song, Kai Dang, Peng Wang, Shi-
jie Wang, Jun Tang, Humen Zhong, Yuanzhi Zhu,
Mingkun Yang, Zhaohai Li, Jianqiang Wan, Pengfei
Wang, Wei Ding, Zheren Fu, Yiheng Xu, and 8 others.
2025. Qwen2.5-vl technical report. arXiv preprint
arXiv:2502.13923.
Luke Bailey, Euan Ong, Stuart Russell, and Scott Em-
mons. 2024. Image hijacks: Adversarial images can
control generative models at runtime. In Proceed-
ings of the 41st International Conference on Machine
Learning, volume 235 of Proceedings of Machine
Learning Research, pages 2792–2804. PMLR.
Zhe Chen, Weiyun Wang, Yue Cao, Yangzhou Liu,
Zhangwei Gao, Erfei Cui, Jinguo Zhu, Shenglong Ye,
Hao Tian, Zhaoyang Liu, Lixin Gu, Xuehui Wang,
Qingyun Li, Yiming Ren, Zixuan Chen, Jiapeng Luo,
Jiahao Wang, Tan Jiang, Bo Wang, and 21 others.
2024. Expanding performance boundaries of open-
source multimodal models with model, data, and
test-time scaling. arXiv preprint arXiv:2412.05271.
Ruoxi Cheng, Yizhong Ding, Shuirong Cao, Ranjie
Duan, Xiaoshuang Jia, Shaowei Yuan, Zhiqiang
Wang, and Xiaojun Jia. 2024.
Pbi-attack: Prior-
guided bimodal interactive black-box jailbreak at-
tack for toxicity maximization.
arXiv preprint
arXiv:2412.05892.
Timothée Darcet, Maxime Oquab, Julien Mairal, and
Piotr Bojanowski. 2024. Vision transformers need
registers. In Proceedings of the 12th International
Conference on Learning Representations (ICLR).
DeepMind. 2024.
Gemini 2.0 flash thinking.
https://deepmind.google/technologies/
gemini/flash-thinking/.
Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun
Wang. 2025.
Figstep: Jailbreaking large vision-
language models via typographic visual prompts. In
Proceedings of the AAAI Conference on Artificial
Intelligence, volume 39, pages 23951–23959.
Daya Guo, Dejian Yang, Haowei Zhang, Junxiao
Song, Ruoyu Zhang, Runxin Xu, Qihao Zhu, Shi-
rong Ma, Peiyi Wang, Xiao Bi, and 1 others. 2025.
Deepseek-r1: Incentivizing reasoning capability in
llms via reinforcement learning.
arXiv preprint
arXiv:2501.12948.
Aaron Hurst, Adam Lerer, Adam P Goucher, Adam
Perelman, Aditya Ramesh, Aidan Clark, AJ Ostrow,
Akila Welihinda, Alan Hayes, Alec Radford, and 1
others. 2024. Gpt-4o system card. arXiv preprint
arXiv:2410.21276.
Hakan Inan, Kartikeya Upasani, Jianfeng Chi, Rashi
Rungta,
Krithika Iyer,
Yuning Mao,
Michael
Tontchev, Qing Hu, Brian Fuller, Davide Testuggine,
and 1 others. 2023. Llama guard: Llm-based input-
output safeguard for human-ai conversations. arXiv
preprint arXiv:2312.06674.
Aaron Jaech, Adam Kalai, Adam Lerer, Adam Richard-
son, Ahmed El-Kishky, Aiden Low, Alec Helyar,
Aleksander Madry, Alex Beutel, Alex Carney, and 1
others. 2024. Openai o1 system card. arXiv preprint
arXiv:2412.16720.
Fengqing Jiang, Zhangchen Xu, Yuetai Li, Luyao Niu,
Zhen Xiang, Bo Li, Bill Yuchen Lin, and Radha
Poovendran. 2025. Safechain: Safety of language
models with long chain-of-thought reasoning capa-
bilities. arXiv preprint arXiv:2502.12025.
Ang Li, Yichuan Mo, Mingjie Li, Yifei Wang, and Yisen
Wang. 2025a. Are smarter llms safer? exploring
safety-reasoning trade-offs in prompting and fine-
tuning. arXiv preprint arXiv:2502.09673.
Yifan Li, Hangyu Guo, Kun Zhou, Wayne Xin Zhao,
and Ji-Rong Wen. 2024. Images are achilles’ heel
of alignment: Exploiting visual vulnerabilities for
jailbreaking multimodal large language models. In
European Conference on Computer Vision, pages
174–189.
Yunxin Li, Zhenyu Liu, Zitao Li, Xuanyu Zhang, Zhen-
ran Xu, Xinyu Chen, Haoyuan Shi, Shenyuan Jiang,
Xintong Wang, Jifang Wang, Shouzheng Huang, Xin-
ping Zhao, Borui Jiang, Lanqing Hong, Longyue
Wang, Zhuotao Tian, Baoxing Huai, Wenhan Luo,
Weihua Luo, and 3 others. 2025b. Perception, rea-
son, think, and plan: A survey on large multimodal
reasoning models. arXiv preprint arXiv:2505.04921.
Xin Liu, Yichen Zhu, Jindong Gu, Yunshi Lan, Chao
Yang, and Yu Qiao. 2024. Mm-safetybench: A bench-
mark for safety evaluation of multimodal large lan-
guage models. In European Conference on Computer
Vision, pages 386–403.
Fanqing Meng, Lingxiao Du, Zongkai Liu, Zhixiang
Zhou, Quanfeng Lu, Daocheng Fu, Tiancheng Han,
Botian Shi, Wenhai Wang, Junjun He, and 1 oth-
ers. 2025. Mm-eureka: Exploring the frontiers of
multimodal reasoning with rule-based reinforcement
learning. arXiv preprint arXiv:2503.07365.
Zhenxing Niu, Haodong Ren, Xinbo Gao, Gang Hua,
and Rong Jin. 2024.
Jailbreaking attack against
multimodal large language model. arXiv preprint
arXiv:2402.02309.
OpenAI.
2025.
Introducing
o3
and
o4-
mini.
https://openai.com/index/
introducing-o3-and-o4-mini/.
Xiangyu Qi, Kaixuan Huang, Ashwinee Panda, Peter
Henderson, Mengdi Wang, and Prateek Mittal. 2024.
Visual adversarial examples jailbreak aligned large
6152

