## 前言
先说说我为什么要研究这个东西。我并不是一个AI算法工程师，但是我是大语言模型的重度使用者。对我而言，虽然大语言模型的确厉害，利用得好能帮我们事半功倍。但目前使用的感觉上还是会有各种各样的问题。比如为什么模型不会稳定的输出我们想要的东西，质量有时候好有时候差。有时候感觉像在”降智“，有时候幻觉严重。我想要搞清楚要怎么使用模型才是最有效率的，这样我就得回答，模型能解决什么问题，从而让我开始感兴趣先深入了解模型的工作原理。

读了很多篇讲transformer的文章，我感觉我总算弄得清楚这玩意儿是怎么工作的，但这个东西不是那么容易讲清楚，让我有了写这篇文章的动机。

这篇文章的目标是用简单的语言讲清楚到底Transformer构架是怎么工作的，包括Attention机制，构架中的Query，Key，Value是什么，是如何工作的。然后整个框架是怎么输出结果的。

先贴上transformer架构的原图
![transformer架构](assets/transformer/the-annotated-transformer_14_0-removebg-preview.png)

## 从简单的例子开始
要解释清楚这个问题，让我们从最简单的数据结构开始说，假设我有一个python的dict，是这样定义的
```
fruits = {
  'apple' : 'a red, sweet fruit',
  'banana' : 'a yellow, sweet fruit',
  'kiwi' : 'a green, sour and sweet fruit',
  'plum' : 'a purple, sour fruit',
}
```

这个最简单的数据结构是一对一的关系，每种水果都有一个名称，这个名称是这种水果的key，现在如果我们要查询这种水果，我们需要用同样的key在代码里边去拿这种水果的信息。
所以，在python里，要拿苹果的信息我们这么写
```
fruits['apple'] # we will get 'a red, sweet fruit',
```

在这段代码里，我们用了 `apple` （query）来查询这个dict，然后match了dict里的key `apple` （key）, 返回了值 'a red, sweet fruit' （value）。

是需要说明的是，在大语言模型里，query到key的映射是一个更抽象的“查询意图”， 并不是一个真正的1对1映射。所以，用这种方法我们做出来的模型就没太大用，我们想要用更复杂的查询来寻找我们想要的信息。比如说，

如果我们问 `what fruit is red？`
我们期望大语言模型返回 `apple, a red,  sweet fruit`
那我们要怎么达到这种效果呢？

现在，我们在查询的时候不能只用key了，我们还需要知道水果的**特性**，我们能想到最直接的方法就是用这些特性作为查询（query），这样我们就能找到这种水果了。

如果是传统的系统，我们可以做一个database，里边放一个这样的table
```sql
CREATE TABLE fruit {
  Name VARCHAR(50) PRIMARY KEY,
  Color VARCHAR(50); // red, yellow
}
```
加上之前的dict，我们现在就能做到用color去找苹果的值了。虽然例子还是很简单，但这个就是大语言模型attention机制的本质：*用query去寻找对应的key，然后拿到最终的value。*

大模型的query和key的对应并不是绝对的，而是一个概率。我们可以理解为，**在给出的query里，最有可能对应的key是哪一个**。

要解释清楚这个到底是怎么工作的，我们还得先了解一个概念，叫做embedding。

## Embedding
刚刚我们说到，每个水果都以自己的**特性**，

|name|colour|taste|
|:---------|:---------|:---------|
|apple|red|sweet|
|banana|yellow|sweet|
|kiwi|green|sweet & sour|
|plum|purple|sour|

假设我们把这个特性做成一个vector（向量），我们就能用这个向量来表示每种水果。我们把颜色变成RGB表示的，taste分成甜度和酸度，上边的那个表格就会变成

|name|red|green|blue|sweetness|sourness|
|:---|:---|:---|:---|:---|:---|
|apple|255|0|0|0.8|0.2|
|banana|255|255|0|1.0|0.0|
|kiwi|0|255|0|0.5|0.5|
|plum|255|0|255|0.2|0.8|

这样，我们就能用一个数组（向量）表示每一种水果了，比如苹果
apple => [255,0,0,0.8,0.2]
我们就可以说，这个数组是这个苹果这种水果的embedding。

对于大语言模型来说，embedding表示的不可能只有水果，而是**token**。所以embedding里，向量的维度要大得多。这个维度，每个模型是不一样的，越大的模型维度越大，维度越大大语言模型对于每个token的语义理解（semantic understanding）就可以越精确。

对于刚刚给出的query，`what fruit is red？`
我们可以猜想embedding里的性状大概能表示的东西是这样的：
- **what** ： 是一个表示问什么的
- **fruit**： 是表示水果
- **is** ： 单数的是
- **red** ： 一种颜色

虽然embedding的数值表示词的真正含义，但是值得注意的是，在这里，embedding只是一个vector，大语言模型并不知道这个vector的含义。但是，意思相近的词，vector的距离是越靠近的。比如说

![embedding vector distance](assets/transformer/vector-distance.png)

下边是模型里embedding的过程

![embedding](assets/transformer/embedding.png)

模型把token先转化成一个key，然后再从自己的字典里拿到embedding向量，再加上位置信息，得到了一个embedding矩阵， 这个矩阵的维度为（总token数， embedding向量长度）。
## Query, Key, Value
从上边的例子里，我们可以大体上感觉得出什么是
这里我给一个更加具体的定义：
- **Query**：代表“我正在寻找什么信息？”
- **Key**：代表“我拥有什么信息？”
- **Value**：代表“我的信息具体是什么？”

大语言模型训练之后，会产生三个关于Query，Key和Value的2维权重矩阵。一个是embedding维度，代表对于某个特定的语义，另一个就是Q，K和V的特性维度，代表着这三种不同的信息的特性。query和Key必须要有相同的维度（原因之后会讲到），value可以用不同的维度

假设我们把embedding维度定义为`model_d`, query和key的维度定义为`key_d`, value的维度定义为`value_d`

我们权重矩阵就可以定义为
- **Query矩阵**：W_Q (key_d, model_d) 
- **Key矩阵**：W_K (key_d, model_d)
- **Value矩阵**：W_V (value_d, model_d)

这个权重矩阵的作用就是能把刚刚说到的embedding向量（维度为model_d），通过线性变换，把每个输入的token转化成query（查询），key（键）和 value （值）的向量形式（维度为key_d或者value_d）。

整个过程如下

![qkv 转化](assets/transformer/qkv.gif)

值得注意的是，上边的图里不仅做了线性变换，加了位置信息。这是因为每个词在不同的位置里，会影响词义，所以在transformer设计的时候，token的位置也是被考虑进去了的。

## 自注意力机制（Self-Attention）
为啥我们需要每个token的QKV向量呢？我们的终极目标是，用query去找key。上边我给出那个简单的解决方案虽然加入了color，但是并没有考虑这些问题：
1）我们输入一个句子，里边不能只有水果，里边还得有其他的词，比如`what fruit is red？`，模型不但需要理解`fruit`，还得理解我们问的是什么，这个需要理解句子里其他几个词。这几个词虽然本身有自己的意思，但是词与词之间相互相关才形成了这个句子整体的意思。也就是说，大语言模型不但得理解每个词，还得理解这些词之间的关系，理解这些关系还不够，还得知道用户是想通过什么讯息，去寻找什么信息。

简单的话说，我们要通过输入中每个token的语义向量来寻找
- 每个词之间的关系
- 每个词Query和Key的映射关系

这个正是自注意力机制（Self-Attention）的核心公式要做的事情。这个是公式：

$Attention(Q, K, V) = Softmax(\frac{Q \cdot K^T}{\sqrt{d_k}})V$

我们来详细的理解下这个公式在干啥。

首先是 $Q \cdot K^T$：我们用输入的句子的Query向量和Key的转置（transpose）来寻找词与词之间的对应关系。里边衡量得是每个词的Query对应每个词的Key的相似度。

下一步，我们用得到的值除以$\sqrt{d_k}$: 这一步是为了防止点积结果过大，导致 Softmax 函数的梯度消失

然后，把注意力用Softmax函数转化成了在0到1之间的**注意力权重**，这个权重的意义在于大语言模型知道对于每一个token，它和哪个token是强相关，哪个token和哪个token是弱相关，甚至是不相关。

我们来举个例子。假设你输入了一句话：`我爱吃苹果，它又红又甜。` 
在这个注意力权重里，“它”这个字，会和“苹果“的分数非常高，因为在处理“它”时，这个”它“就是指的苹果。反过来说，"它" 和 "吃" 的注意力分数就会很低。

最后，我们用得到的结果对得到的V向量进行**加权求和**，这样做完以后得到一个里边包含着：
- 模型输出需要知道的所有信息
- 以及什么信息更加重要
 
 这个过程可以归纳为这个公式

$\text{Attention Output} = \sum_{i=1}^{L} \alpha_i V_i$

注意，这里的计算只是一个“头”。在transformer构架中，提到了他用的是“多头”（multi-head）。也就是说，transformer构架里有很多个Query，Key和Value的权重矩阵，每个方向从不同的角度入手分析同一个句子。有可能一个头在意的是上下文，另一个头在意的是语义。这样从多个方向入手，才能让模型更“聪明”，从而好地了解输入的真正含义。
整个过程如下：

![attention](assets/transformer/attention.gif)

注意下，现在输出的这个向量，他的长度和embedding向量（model_d）是一致的。

## 全连接层（Feed-Forward）
从自注意层输出之后，那个输出还只包含着最基本的词义，模型还没有真正**思考**这些词义的后边，有没有包含着什么隐含的词义。这个就需要全连接层的提取。这一层其实就是一个传统的MLP （Multi layer perception)。里边是夹着一个非线性激活函数（比如 GELU 或 ReLU）。它的作用是：

- **提炼信息:** 进一步处理自注意力层输出的向量，提取更深层次、更抽象的语义特征。
- **维度调整:** 调整向量的维度，为后续的层做准备。

![全连接层](assets/transformer/feed_forward.png)

## 线性层 （linear layer）
到了这一层，我们得到了一个含有最后我们想要输出的语义的向量，这个向量的长度依然和embedding向量一致。这时候，我们需要一个`解码器`,把这个embedding转化回原始的token。这个解码器是一个矩阵，它也是预先训练好的，叫做**词汇表权重矩阵**。因为embedding代表的是token的特征，我们可以把这个矩阵理解为： **从语意特征（semantic feature）到token可能性的转化器**。
这个转化器像一个反向字典，知道了词的含义来猜单词。给出这个词义对应的单词应该是那一个（更准确地说是token）。

这个过程之后，我们得到了一个长度等于这个模型里所有认识的token长度的向量。向量里的每个值代表的是选择这个token的可能性。

![线性层](assets/transformer/logit.gif)

## 最终输出
到这里，logit里已经包含了输出需要的所有信息了，我们最终只是对他做一些转化。这里有2步：
* 第一步，我们用logit的值**除以温度**，这样可以调整最终输出的词的可能性比例。（温度越低，每个词的logit差就越大，词和词之间的概率差就越大）；
* 第二步，我们再对Logit向量使用Softmax，向量中的每个数都在0和1之间，且整个向量累积概率会变成1. 在这个过程中，我们可以用`top-k`或者`top-p`选出最终可选的候选词，并在其中随机选择一个。

### 关于 top-k 和 top-p 的顺序：
Top-k 可以在 Softmax 之前进行。如果我们只关心最高分数的k个词，直接在 Logit向量中找到它们并保留，这么做可以节省计算Softmax的时间。

而对于Top-p 则必须在 Softmax 之后进行，因为它需要用到累积概率，而累积概率只能通过 Softmax 后的概率分布来计算。

整个过程如下：
![output](assets/transformer/output.png)


到这里，模型完成了一个token的输出。然后，模型会从新回到第一步，预测下一个token。直到预测的token是EOS（End-of-sequence）才会停止。

## 最后的题外话
这篇文章里的截图重度使用了[Transformer explainer](https://poloclub.github.io/transformer-explainer/)。 这个真是个很优秀的项目，让我对transformer理解上到了一个更高的层次。所以我觉得应该直接把这个连接分享出来。

## 引用
[1] attention is all you need https://arxiv.org/abs/1706.03762
