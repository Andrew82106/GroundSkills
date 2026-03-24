# Related Work

foundation for future research into both attack and
defense mechanisms for multimodal models.
Acknowledgments
This work was supported by the Shanghai Artificial
Intelligence Laboratory. We thank the anonymous
reviewers for their helpful feedback.
Limitations
While VisCo demonstrates strong effectiveness in
constructing realistic and visually grounded jail-
break scenarios, our current approach to context
fabrication still relies on a set of manually designed
strategy templates. These templates guide the gen-
eration of multi-turn dialogue contexts and are tai-
lored to specific attack strategies. Although effec-
tive, this design limits the flexibility and scalability
of the attack pipeline, especially when adapting
to new domains or unforeseen prompts. In future
work, we plan to explore automatic context gen-
eration techniques that can dynamically synthe-
size adversarial multimodal histories without hand-
crafted templates. Such advancements may fur-
ther enhance the generalizability and stealthiness
of vision-centric jailbreaks in real-world settings.
Ethics Statement
This work reveals safety risks in black-box MLLMs
through controlled jailbreak experiments. The in-
tent is academic, aiming to highlight vulnerabili-
ties and encourage the development of stronger de-
fenses. We emphasize the need for rigorous safety
evaluations before releasing both open-source and
API-based MLLMs to the public.
References
Josh Achiam, Steven Adler, Sandhini Agarwal, Lama
Ahmad, Ilge Akkaya, Florencia Leoni Aleman,
Diogo Almeida, Janko Altenschmidt, Sam Altman,
Shyamal Anadkat, and 1 others. 2023. Gpt-4 techni-
cal report. arXiv preprint arXiv:2303.08774.
Cem Anil, Esin Durmus, Nina Panickssery, Mrinank
Sharma, Joe Benton, Sandipan Kundu, Joshua Bat-
son, Meg Tong, Jesse Mu, Daniel Ford, and 1 others.
2024. Many-shot jailbreaking. Advances in Neural
Information Processing Systems, 37:129696–129742.
Shuai Bai, Keqin Chen, Xuejing Liu, Jialin Wang, Wen-
bin Ge, Sibo Song, Kai Dang, Peng Wang, Shijie
Wang, Jun Tang, and 1 others. 2025. Qwen2. 5-vl
technical report. arXiv preprint arXiv:2502.13923.
Yangyi Chen, Karan Sikka, Michael Cogswell, Heng
Ji, and Ajay Divakaran. 2024a. Dress: Instructing
large vision-language models to align and interact
with humans via natural language feedback. In Pro-
ceedings of the IEEE/CVF Conference on Computer
Vision and Pattern Recognition, pages 14239–14250.
Zhe Chen, Weiyun Wang, Yue Cao, Yangzhou Liu,
Zhangwei Gao, Erfei Cui, Jinguo Zhu, Shenglong
Ye, Hao Tian, Zhaoyang Liu, and 1 others. 2024b.
Expanding performance boundaries of open-source
multimodal models with model, data, and test-time
scaling. arXiv preprint arXiv:2412.05271.
Cognitive
Computations.
2023.
Wizard-vicuna-13b-uncensored.
https://huggingface.co/cognitivecomputations/Wizard-
Vicuna-13B-Uncensored.
Chenhang Cui, Gelei Deng, An Zhang, Jingnan Zheng,
Yicong Li, Lianli Gao, Tianwei Zhang, and Tat-Seng
Chua. 2024. Safe+ safe= unsafe? exploring how
safe images can be exploited to jailbreak large vision-
language models. arXiv preprint arXiv:2411.11496.
Aobotao Dai, Xinyu Ma, Lei Chen, Songze Li, and Lin
Wang. 2025. When data manipulation meets attack
goals: An in-depth survey of attacks for vlms. arXiv
preprint arXiv:2502.06390.
Yunkai Dang, Kaichen Huang, Jiahao Huo, Yibo Yan,
Sirui Huang, Dongrui Liu, Mengxi Gao, Jie Zhang,
Chen Qian, Kun Wang, and 1 others. 2024. Explain-
able and interpretable multimodal large language
models: A comprehensive survey. arXiv preprint
arXiv:2412.02104.
Yi Ding, Bolian Li, and Ruqi Zhang. 2024. Eta: Evalu-
ating then aligning safety of vision language models
at inference time. arXiv preprint arXiv:2410.06625.
Yi Ding, Lijun Li, Bing Cao, and Jing Shao. 2025. Re-
thinking bottlenecks in safety fine-tuning of vision
language models. arXiv preprint arXiv:2501.18533.
Patrick Esser, Sumith Kulal, Andreas Blattmann, Rahim
Entezari, Jonas Müller, Harry Saini, Yam Levi, Do-
minik Lorenz, Axel Sauer, Frederic Boesel, and 1
others. 2024. Scaling rectified flow transformers for
high-resolution image synthesis. In Forty-first Inter-
national Conference on Machine Learning.
Kuofeng Gao, Yang Bai, Jiawang Bai, Yong Yang, and
Shu-Tao Xia. 2024. Adversarial robustness for vi-
sual grounding of multimodal large language models.
arXiv preprint arXiv:2405.09981.
Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun
Wang. 2023.
Figstep: Jailbreaking large vision-
language models via typographic visual prompts.
arXiv preprint arXiv:2311.05608.
Xuhao Hu, Dongrui Liu, Hao Li, Xuanjing Huang,
and Jing Shao. 2024.
Vlsbench: Unveiling vi-
sual leakage in multimodal safety. arXiv preprint
arXiv:2411.19939.
9647

Haibo Jin, Leyang Hu, Xinuo Li, Peiyan Zhang, Chong-
han Chen, Jun Zhuang, and Haohan Wang. 2024.
Jailbreakzoo: Survey, landscapes, and horizons in
jailbreaking large language and vision-language mod-
els. arXiv preprint arXiv:2407.01599.
Martin Kuo, Jianyi Zhang, Aolin Ding, Qinsi Wang,
Louis DiValentin, Yujia Bao, Wei Wei, Hai Li, and
Yiran Chen. 2025. H-cot: Hijacking the chain-of-
thought safety reasoning mechanism to jailbreak
large reasoning models, including openai o1/o3,
deepseek-r1, and gemini 2.0 flash thinking. arXiv
preprint arXiv:2502.12893.
Lijun Li, Bowen Dong, Ruohui Wang, Xuhao Hu, Wang-
meng Zuo, Dahua Lin, Yu Qiao, and Jing Shao.
2024. Salad-bench: A hierarchical and comprehen-
sive safety benchmark for large language models.
arXiv preprint arXiv:2402.05044.
Lijun Li, Zhelun Shi, Xuhao Hu, Bowen Dong, Yi-
ran Qin, Xihui Liu, Lu Sheng, and Jing Shao. 2025.
T2isafety: Benchmark for assessing fairness, toxic-
ity, and privacy in image generation. arXiv preprint
arXiv:2501.12612.
Haotian Liu, Chunyuan Li, Yuheng Li, and Yong Jae
Lee. 2024a. Improved baselines with visual instruc-
tion tuning. In Proceedings of the IEEE/CVF Con-
ference on Computer Vision and Pattern Recognition,
pages 26296–26306.
Haotian Liu, Chunyuan Li, Qingyang Wu, and Yong Jae
Lee. 2023. Visual instruction tuning. Advances in
neural information processing systems, 36:34892–
34916.
Xin Liu, Yichen Zhu, Jindong Gu, Yunshi Lan, Chao
Yang, and Yu Qiao. 2024b. Mm-safetybench: A
benchmark for safety evaluation of multimodal large
language models. In European Conference on Com-
puter Vision, pages 386–403. Springer.
Yue Liu, Hongcheng Gao, Shengfang Zhai, Xia
Jun, Tianyi Wu, Zhiwei Xue, Yulin Chen, Kenji
Kawaguchi, Jiaheng Zhang, and Bryan Hooi. 2025a.
Guardreasoner: Towards reasoning-based llm safe-
guards. arXiv preprint arXiv:2501.18492.
Yue Liu, Xiaoxin He, Miao Xiong, Jinlan Fu, Shumin
Deng, and Bryan Hooi. 2024c. Flipattack: Jailbreak
llms via flipping. arXiv preprint arXiv:2410.02832.
Yue Liu, Shengfang Zhai, Mingzhe Du, Yulin Chen,
Tri Cao, Hongcheng Gao, Cheng Wang, Xinfeng
Li, Kun Wang, Junfeng Fang, Jiaheng Zhang, and
Bryan Hooi. 2025b. Guardreasoner-vl: Safeguard-
ing vlms via reinforced reasoning. arXiv preprint
arXiv:2505.11049.
Chaochao Lu, Chen Qian, Guodong Zheng, Hongx-
ing Fan, Hongzhi Gao, Jie Zhang, Jing Shao, Jingyi
Deng, Jinlan Fu, Kexin Huang, and 1 others. 2024.
From gpt-4 to gemini and beyond: Assessing the
landscape of mllms on generalizability, trustworthi-
ness and causality through four modalities. arXiv
preprint arXiv:2401.15071.
Mantas Mazeika, Long Phan, Xuwang Yin, Andy Zou,
Zifan Wang, Norman Mu, Elham Sakhaee, Nathaniel
Li, Steven Basart, Bo Li, and 1 others. 2024. Harm-
bench: A standardized evaluation framework for auto-
mated red teaming and robust refusal. arXiv preprint
arXiv:2402.04249.
Wenlong Meng, Fan Zhang, Wendao Yao, Zhenyuan
Guo, Yuwei Li, Chengkun Wei, and Wenzhi Chen.
2025.
Dialogue injection attack:
Jailbreaking
llms through context manipulation. arXiv preprint
arXiv:2503.08195.
Ziqi Miao, Lijun Li, Yuan Xiong, Zhenhua Liu, Pengyu
Zhu, and Jing Shao. 2025. Response attack: Exploit-
ing contextual priming to jailbreak large language
models. arXiv preprint arXiv:2507.05248.
Renjie Pi, Tianyang Han, Jianshu Zhang, Yueqi Xie,
Rui Pan, Qing Lian, Hanze Dong, Jipeng Zhang, and
Tong Zhang. 2024. Mllm-protector: Ensuring mllm’s
safety without hurting performance. arXiv preprint
arXiv:2401.02906.
Xiangyu Qi, Kaixuan Huang, Ashwinee Panda, Peter
Henderson, Mengdi Wang, and Prateek Mittal. 2024.
Visual adversarial examples jailbreak aligned large
language models. In Proceedings of the AAAI con-
ference on artificial intelligence, volume 38, pages
21527–21536.
Xiangyu Qi, Yi Zeng, Tinghao Xie, Pin-Yu Chen, Ruoxi
Jia, Prateek Mittal, and Peter Henderson. 2023. Fine-
tuning aligned language models compromises safety,
even when users do not intend to! arXiv preprint
arXiv:2310.03693.
Salman Rahman, Liwei Jiang, James Shiffer, Genglin
Liu, Sheriff Issaka, Md Rizwan Parvez, Hamid
Palangi, Kai-Wei Chang, Yejin Choi, and Saadia
Gabriel. 2025. X-teaming: Multi-turn jailbreaks and
defenses with adaptive multi-agents. arXiv preprint
arXiv:2504.13203.
Qibing Ren, Hao Li, Dongrui Liu, Zhanxu Xie, Xiaoya
Lu, Yu Qiao, Lei Sha, Junchi Yan, Lizhuang Ma,
and Jing Shao. 2024. Derail yourself: Multi-turn llm
jailbreak attack through self-discovered clues. arXiv
preprint arXiv:2410.10700.
Mark Russinovich and Ahmed Salem. 2025. Jailbreak-
ing is (mostly) simpler than you think. arXiv preprint
arXiv:2503.05264.
Mark Russinovich, Ahmed Salem, and Ronen Eldan.
2024. Great, now write an article about that: The
crescendo multi-turn llm jailbreak attack.
arXiv
preprint arXiv:2404.01833.
Gemini Team, Petko Georgiev, Ving Ian Lei, Ryan
Burnell, Libin Bai, Anmol Gulati, Garrett Tanzer,
Damien Vincent, Zhufeng Pan, Shibo Wang, and 1
others. 2024. Gemini 1.5: Unlocking multimodal
understanding across millions of tokens of context.
arXiv preprint arXiv:2403.05530.
9648

