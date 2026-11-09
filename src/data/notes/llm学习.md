# BytePair encoding
- it allows the model to break down words that aren't in its predefined vocabulary into smaller subword units or even individual characters, enabling it to handle out-of-vocabulary words
- For instance, if GPT-2's vocabulary doesn't have the word "unfamiliarword," it might tokenize it as ["unfam", "iliar", "word"] or some other subword breakdown, depending on its trained BPE merges

gpt2使用的encoder

# Data sampling with a sliding window
使用滑动窗口，每次取(a,b), (a+1,b+1)
Transformer（Attention + MLP）是一个保持序列长度不变的映射结构，因此输入 n 个 Token，输出仍然有 n 个位置的表示。
为了训练效率，对于每一个位置都进行预测，
只预测最后一个token，训练效率很低
而在推理阶段，仅仅看最后一个token的输出

# one-hot encoding
embedding使用one-hot encoding, 这样token数字id的大小就不会影响训练，
这个embedding layer本质是一个查找表
