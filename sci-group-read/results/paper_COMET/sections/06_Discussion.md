# Discussion

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
(a) Harmful Semantics Distribution with/without Rubric
(b) Attack Visual Payload
w/o Rubric
(c) VLMs’ Attention Pattern
w/o Rubric
(d) Attack Visual Payload
w/ Rubric
(e) VLMs’ Attention Pattern
w/ Rubric
Figure 8. Impact of Rubric-based Steering on Model Attention.
(a) It is counterintuitive that adding the visual rubric reduces the
overall attack stealthiness while leading to more harmful output.
(b-e) Finding: The rubric guides VLM´s attention from entity-level
harmfulness analysis to more explicit instruction-following mode
for problem-solving.
sarial samples achieve lower semantic similarity compared
438
to methods like CS-DJ (which uses fixed templates for jail-
439
break). This lower similarity indicates greater diversity, en-
440
abling broader coverage of unsafe patterns. The core of at-
441
tack entanglement payload (Tentgl, Ientgl), which operates
442
without fixed scenario nesting, further achieves lower se-
443
mantic similarity than HIMRD, highlighting COMET’s red-
444
teaming potential.
445
Impact of Rubric-based Steering Ablation study (§ 4.3)
446
demonstrates the visual rubric’s significance in steering
447
VLMs toward useful harmful outputs.
However, it also
448
exhibits synergistic effects on attack stealth as shown in
449
Figure 8(a), which is counterintuitive. We further observe
450
the VLMs’ attention patterns to analyze this phenomenon,
451
as shown in Figure 8(b-e). We find that the rubric trans-
452
forms the VLM’s attention from entity-level harmfulness
453
judgment in the image to focus on the task outline of dis-
454
guised score-seeking scenarios for problem-solving, which
455
indicates that the VLM more explicitly enters instruction-
456
following mode without compromising safety alignment
457
and usefulness, thus self-steering into the jailbreak.
458
Table 5. Comparison of COMET and HIMRD across visual
styles. We report their Attack Success Rate / Visual Payload Gen-
eration Success Rate for comparison. We use dall-e-3, which
is a commercial model with safeguards, to generate images and
GPT-4.1 as the victim VLM for evaluation on SafeBench-tiny.
Method
Visual Style
Realistic
Cartoon
Pixel Art
Sketch
HIMRD
0.00/0.08
0.02/0.04
0.04/0.08
0.02/0.06
COMET
0.94/1.00
0.98/1.00
0.96/1.00
0.98/1.00
Impact of Cross-modal Scenario Nesting. As shown in
459
Figure 8(c, e), the rubric fundamentally alters the VLM’s
460
attention. Without the rubric, the model’s attention is dif-
461
fusely spread across the image’s general features. However,
462
with the rubric (part of our Scenario Nesting), the VLM’s
463
attention shifts significantly to the disguised UI, including
464
the dashboard and evaluation criteria. This indicates the
465
model has transitioned from a simple safety-checking mode
466
to an instruction-following mode, focused on the problem-
467
solving task presented in the fabricated ‘Model Quality
468
Control’ scenario.
469
Impact of Visual Style.
The visual style is essential
470
for both attack effectiveness and camouflage. We evaluate
471
COMET’s performance across 4 distinct image generation
472
styles (Realistic, Cartoon, Pixel Art, and Sketch) for evalu-
473
ation. As shown in Table 5, COMET achieves 100% visual
474
payload generation success rate across all styles, signifi-
475
cantly outperforming HIMRD. This demonstrates that our
476
method not only effectively disperses harmful information
477
through visual channels but also leverages state-of-the-art
478
T2I models to enhance attack effectiveness, regardless of
479
visual presentation style.
480
5. Conclusion
481
In this paper, we investigated vulnerabilities of advanced
482
Vision-Language Models (VLMs) to jailbreak attacks by
483
exploiting their multimodal reasoning.
We argued that
484
existing methods relying on simple and fixed attack pay-
485
laods are insufficient for red-teaming advanced VLMs. To
486
address this, we introduced COMET, an attack frame-
487
work constructing deeply entangled cross-modal payloads
488
through knowledge reframing, cross-modal clue entangling,
489
and scenario nesting.
Our extensive experiments on 9
490
VLMs demonstrated that COMET achieves over 94% at-
491
tack success rate, significantly outperforming state-of-the-
492
art baselines by 29%, particularly against prompt-based de-
493
fenses. The results confirm that by creating complex, entan-
494
gled reasoning chains, COMET effectively bypasses safety
495
alignments and exposes deep vulnerabilities in VLMs’ mul-
496
timodal understanding. This study further underscores the
497
importance of developing more sophisticated red-teaming
498
strategies and robust defenses for advanced multimodal
499
models.
500
8

CVPR
#8543
CVPR
#8543
CVPR 2026 Submission #8543. CONFIDENTIAL REVIEW COPY. DO NOT DISTRIBUTE.
References
501
[1] Jinze Bai, Shuai Bai, Shusheng Yang, Shijie Wang, Sinan
502
Tan, Peng Wang, Junyang Lin, Chang Zhou, and Jingren
503
Zhou. Qwen-vl: A versatile vision-language model for un-
504
derstanding, localization, text reading, and beyond. arXiv
505
preprint arXiv:2308.12966, 2023. 1
506
[2] Peng Chen et al.
Distraction is all you need for multi-
507
modal large language model jailbreaking.
arXiv preprint
508
arXiv:2502.10794, 2025. 2
509
[3] Yuhao Dong, Zuyan Liu, Hai-Long Sun, Jingkang Yang,
510
Winston Hu, Yongming Rao, and Ziwei Liu. Insight-v: Ex-
511
ploring long-chain visual reasoning with multimodal large
512
language models. pages 9062–9072, 2025. 2
513
[4] Yichen Gong, Delong Ran, Jinyuan Liu, Conglei Wang,
514
Tianshuo Cong, Anyu Wang, Sisi Duan, and Xiaoyun Wang.
515
Figstep: Jailbreaking large vision-language models via typo-
516
graphic visual prompts. In Proceedings of the AAAI Confer-
517
ence on Artificial Intelligence, pages 23951–23959, 2025. 2,
518
3, 5, 6
519
[5] Shuyang Hao, Zhixuan Liu, Yitao Wang, ZhaoyuLi, Kai-Wei
520
Chang, and Z. Morley Mao. Exploring visual vulnerabili-
521
ties via multi-loss adversarial search for jailbreaking vision-
522
language models, 2024. 2
523
[6] Aaron Hurst, Adam Lerer, Adam P Goucher, Adam Perel-
524
man, Aditya Ramesh, Aidan Clark, AJ Ostrow, Akila Weli-
525
hinda, Alan Hayes, Alec Radford, et al. Gpt-4o system card.
526
arXiv preprint arXiv:2410.21276, 2024. 1
527
[7] Haibo Jin, Leyang Hu, Xinuo Li, Peiyan Zhang, Chonghan
528
Chen, Jun Zhuang, and Haohan Wang. Jailbreakzoo: Survey,
529
landscapes, and horizons in jailbreaking large language and
530
vision-language models. arXiv preprint arXiv:2407.01599,
531
2024. 2
532
[8] Xiaohui Li, Wei Chen, Yue Zhang, Tao Wang, and Ming
533
Liu. Visco: Visual contextual jailbreak attack on multimodal
534
large language models.
arXiv preprint arXiv:2507.02844,
535
2025. 3
536
[9] Yifan Li, Hangyu Guo, Kun Zhou, Wayne Xin Zhao, and Ji-
537
Rong Wen. Images are achilles’ heel of alignment: Exploit-
538
ing visual vulnerabilities for jailbreaking multimodal large
539
language models. In European Conference on Computer Vi-
540
sion. Springer, 2024. 2, 5
541
[10] Ming Liu, Hao Chen, Jindong Wang, and Wensheng Zhang.
542
On the robustness of multimodal large language models to-
543
wards distractions. arXiv preprint arXiv:2502.09818, 2025.
544
6
545
[11] Xin Liu, Yichen Zhu, Jindong Gu, Yunshi Lan, Chao Yang,
546
and Yu Qiao. Mm-safetybench: A benchmark for safety eval-
547
uation of multimodal large language models. In European
548
Conference on Computer Vision, pages 386–403. Springer,
549
2024. 2
550
[12] Yue Liu, Xiaoxiao Ma, Weihang Wang, Xiaohan Hu, Yiming
551
Zhao, et al. Jailbreak large vision-language models through
552
multi-modal linkage.
In Proceedings of the 63rd Annual
553
Meeting of the Association for Computational Linguistics,
554
pages 1395–1416, 2025. 2, 3
555
[13] Yuqi Luo et al.
Cross-modal obfuscation for jailbreak
556
attacks on large vision-language models.
arXiv preprint
557
arXiv:2506.16760, 2025. 2
558
[14] Chuofan Ma, Yi Jiang, Jiannan Wu, Zehuan Yuan, and Xiao-
559
juan Qi. Groma: Localized visual tokenization for grounding
560
multimodal large language models. In European Conference
561
on Computer Vision, pages 417–435. Springer, 2025. 2
562
[15] Siyuan Ma, Weidi Luo, Yu Wang, Xiaogeng Liu, Muhao
563
Chen, Bo Li, and Chaowei Xiao.
Visual-roleplay: Uni-
564
versal jailbreak attack on multimodal large language mod-
565
els via role-playing image characte.
arXiv preprint
566
arXiv:2405.20773, 2024. 3
567
[16] Teng Ma, Xiaojun Jia, et al. Heuristic-induced multimodal
568
risk distribution jailbreak attack for multimodal large lan-
569
guage models.
In Proceedings of the IEEE/CVF Interna-
570
tional Conference on Computer Vision (ICCV), pages 2686–
571
2696, 2025. 2, 3, 5, 6
572
[17] Gr´egoire Mialon, Cl´ementine Fourrier, Craig Swift, Thomas
573
Wolf, Yann LeCun, and Thomas Scialom.
Gaia:
A
574
benchmark for general ai assistants.
arXiv preprint
575
arXiv:2311.12983, 2023. 5
576
[18] Zhiliang Peng, Wenhui Wang, Li Dong, Yaru Hao, Shaohan
577
Huang, Shuming Ma, and Furu Wei. Kosmos-2: Ground-
578
ing multimodal large language models to the world. CoRR,
579
abs/2306.14824, 2023. 2
580
[19] Long Phan, Alice Gatti, Ziwen Han, Nathaniel Li, et al. Hu-
581
manity’s last exam. arXiv preprint arXiv:2501.14249, 2025.
582
5
583
[20] Xiangyu Qi, Kaixuan Huang, Ashwinee Panda, Peter Hen-
584
derson, Mengdi Wang, and Prateek Mittal. Visual adversarial
585
examples jailbreak aligned large language models. In Pro-
586
ceedings of the AAAI Conference on Artificial Intelligence,
587
pages 21527–21536, 2024. 2
588
[21] Hao Shao, Shengju Qian, Han Xiao, Guanglu Song, Zhuo-
589
fan Zong, Letian Wang, Yu Liu, and Hongsheng Li. Visual
590
cot: Advancing multi-modal language models with a com-
591
prehensive dataset and benchmark for chain-of-thought rea-
592
soning. Advances in Neural Information Processing Systems,
593
37:8612–8642, 2024. 2
594
[22] Erfan Shayegani, Yue Dong, and Nael Abu-Ghazaleh. Jail-
595
break in pieces: Compositional adversarial attacks on multi-
596
modal language models. In The Twelfth International Con-
597
ference on Learning Representations, 2023. 2, 3
598
[23] Bingrui Sima, Linhua Cong, Wenxuan Wang, and Kun
599
He. Viscra: A visual chain reasoning attack for jailbreak-
600
ing multimodal large language models.
arXiv preprint
601
arXiv:2505.19684, 2025. 6
602
[24] Alexandra Souly, Qingyuan Lu, Dillon Bowen, Tu Trinh,
603
Elvis Hsieh, Sana Pandey, Pieter Abbeel, Justin Svegliato,
604
Scott Emmons, Olivia Watkins, et al.
A strongreject for
605
empty jailbreaks. arXiv preprint arXiv:2402.10260, 2024.
606
3, 5, 6
607
[25] Gemini Team, Petko Georgiev, Ving Ian Lei, Ryan Burnell,
608
Libin Bai, Anmol Gulati, Garrett Tanzer, Damien Vincent,
609
Zhufeng Pan, Shibo Wang, et al. Gemini 1.5: Unlocking
610
multimodal understanding across millions of tokens of con-
611
text. arXiv preprint arXiv:2403.05530, 2024. 1
612
9

