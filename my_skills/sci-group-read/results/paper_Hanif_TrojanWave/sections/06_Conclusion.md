# Conclusion

Yi Su, Jisheng Bai, Qisheng Xu, Kele Xu, and Yong
Dou. 2025. Audio-language models for audio-centric
tasks: A survey. arXiv preprint arXiv:2501.15177.
Mi Tian, Ajay Srinivasamurthy, Mark Sandler, and
Xavier Serra. 2014. A study of instrument-wise on-
set detection in beijing opera percussion ensembles.
In 2014 ieee international conference on acoustics,
speech and signal processing (icassp), pages 2159–
2163. IEEE.
Alexander Turner, Dimitris Tsipras, and Aleksander
Madry. 2019.
Label-consistent backdoor attacks.
arXiv preprint arXiv:1912.02771.
Haibin Wu, Xuanjun Chen, Yi-Cheng Lin, Kai-wei
Chang, Ho-Lam Chung, Alexander H Liu, and Hung-
yi Lee. 2024a. Towards audio language modeling–an
overview. arXiv preprint arXiv:2402.13236.
Yixin Wu, Rui Wen, Michael Backes, Pascal Berrang,
Mathias Humbert, Yun Shen, and Yang Zhang. 2024b.
Quantifying privacy risks of prompts in visual prompt
learning.
In 33rd USENIX Security Symposium
(USENIX Security 24), pages 5841–5858.
Jinwen Xin, Xixiang Lyu, and Jing Ma. 2022. Natural
backdoor attacks on speech recognition models. In
International Conference on Machine Learning for
Cyber Security, pages 597–610. Springer.
Baochen Yan, Jiahe Lan, and Zheng Yan. 2024. Back-
door attacks against voice recognition systems: A
survey. ACM Computing Surveys, 57(3):1–35.
Shaobo Zhang, Yimeng Pan, Qin Liu, Zheng Yan,
Kim-Kwang Raymond Choo, and Guojun Wang.
2024. Backdoor attacks and defenses targeting multi-
domain ai models: A comprehensive review. ACM
Computing Surveys, 57(4):1–35.
Kaiyang Zhou, Jingkang Yang, Chen Change Loy, and
Ziwei Liu. 2022a.
Conditional prompt learning
for vision-language models. In Proceedings of the
IEEE/CVF conference on computer vision and pat-
tern recognition, pages 16816–16825.
Kaiyang Zhou, Jingkang Yang, Chen Change Loy, and
Ziwei Liu. 2022b. Learning to prompt for vision-
language models. International Journal of Computer
Vision, 130(9):2337–2348.
Appendix
A Constraints on Temporal and Spectral Trigger
B Impact of using Temporal and Spectral Triggers
C Impact of Perturbation Budgets
D Impact of Poisoning Rate
E Impact of Target Class Label
F tSNE Plots of Clean and Poisoned Samples
G Entropy of Clean vs. Poisoned Predictions
H Impact of Running Defense on Benign Models
I Few-Shot Training Under Clean and Defense
J Imperceptibility of Triggers
A
Constraints on Temporal and Spectral
Trigger Values
In normalized audio waveforms, amplitude values
are constrained within the interval [−1, 1]. The
perturbation budget for the temporal trigger (δt)
is defined by ϵt ∈[0, 1]. For example, setting
ϵt = 0.2 allows the learnable δt values to vary
within the range [−0.2, 0.2]. In contrast to wave-
form amplitudes, spectrogram coefficients vary dy-
namically based on audio content. To introduce
perturbations in the spectral domain, we use multi-
plicative noise (δs), which scales spectrogram co-
efficients proportionally to their magnitudes. This
enables content-aware modifications that maintain
perceptual quality. Unlike additive noise, which
can distort low-magnitude coefficients when the
noise is too strong, or become ineffective for high-
magnitude regions when too weak, multiplicative
noise provides consistent, adaptive perturbations.
This makes it more suitable for preserving the nat-
ural structure of the spectrogram. The perturbation
budget for spectral noise is governed by ϵs ∈[0, 1],
which specifies the maximum allowable percentage
change. For instance, ϵs = 0.1 implies that δs lies
in the range [1 −ϵs, 1 + ϵs] = [0.9, 1.1]. Values
of δs < 1 attenuate the corresponding spectrogram
coefficients, while values > 1 amplify them.
B
Impact of using Temporal and Spectral
Triggers
Table A shows the influence of using temporal (δt)
and spectral (δs) triggers independently and jointly
on Backdoor Accuracy (BA). The attack is less ef-
fective when either trigger is used in isolation. In
18639

