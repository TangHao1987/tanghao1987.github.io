当我刚开始学习提示工程, 我找了很多地方，但找不到一篇能很好的介绍LLM基础参数设置的文章。在我看过的文章当中，有些文章讲的太浅，没法让我很清楚的弄懂这些重要的概念。我也读到过一些有深度的文章，但是信息都非常的分散，很难让人形成一个整体的认知。因此，我决定写一遍文章把这些信息整合起来。

我的目标是写一篇能涉及所有LLM常用的参数，稍微有深度利于大家理解的文章。这些参数包括 **Temperature**, **TOP-P**, **Max Length**, **Stop Sequence**, **Frequency Penalty**, 和 **Presence Penalty**。 

# **令牌（Token）**

在我们开始讨论参数之前，我们得先理解一个很重要的概念`令牌（token）`。我们在使用LLM API的时候，我们都知道大语言模型（LLM）的计费都是根据令牌来的。但是令牌到底是什么呢？

## 什么是令牌？

令牌是LLM可以理解的最小单位。 一个令牌可以是一个词，一个标点符号，甚至是一个空格。对于AI来说，令牌像是电脑可以看到的一个字母，或者是标记。注意：对于一个令牌而言，它自己可能没有**独立的意义**的, 但是它是一个有意义的整体的一部分。也就是说，令牌的意义通常是**上下文相关**的。

## 举个例子

让我们一起来看看下边这个例子，来理解下令牌到底是怎么工作的:

假设我们现在在LLM里输入 "**Hello there, my friend\!**"，AI会把这个句子分解成下边几个令牌:

![sentence_to_token](assets/llm_setting_img1.png)

我们可以注意到有些令牌，比如说 **" there"** 和 **" my"**，他们前缀是个空格。这正是因为AI的标记器（tokenizer）一开始就被设计成能捕捉到用空格开分词，这些空格对模型能够理解整句话有至关重要的意义。

让我们再来看一个例子:

"**unbelievable**" 这个词会被模型分解成下边几个token:

* **"un"**  
* **"bel"**  
* **"ievable"**

![sentence_to_token_2](assets/llm_setting_img2.png)

这种把一个单词分解成多个令牌的方式，有助于AI更有效地处理新词或长词。因为AI可以用这些更小的组成部分（前缀或者后缀）来学习单词。

简而言之，令牌是AI模型**观察**和**理解**语言的方式，它将语言分解成可管理、带数字的片段。我们可以把它想象成AI的字母表和词汇表的结合体。

## 令牌ID

从技术层面讲，AI会为每个令牌（token）分配一个数字。这个数字ID和token是完全1对1对应的。由于计算机计算数字的速度远远大于文字的速度，所以转化成数字可以大幅提高运算效率。

让我门来举个简单的例子，如果我们有个句， "**Hello there, my friend\!**"
AI会先把句子分解成: "Hello", " there", ",", " my", " friend", "\!".

然后根据预设的数字映射，给每个令牌一个完全唯一的数字ID。这整个过程叫做**tokenization**。

![token_id](assets/llm_setting_img3.png)

This numbering allows the AI to work with the sentence not as a string of letters, but as a sequence of numbers.This numerical format is much easier for a computer to process and understand the relationships between words.

# **Temperature**

When talking about **temperature** in an AI, we are referring to how much **creativity** or **randomness** it's allowed to have when it generates text. Think of it like a control dial that you can turn up or down.

---

### **Low Temperature (Predictable and Factual)**

When the temperature is **low**, the AI is being very cautious. It will almost always choose the next word that it thinks is the **most likely** to come next. This makes the AI's responses very **predictable**, **direct**, and **safe**.

* **Analogy:** Imagine a student taking a multiple-choice test. With a low temperature, the student will always pick the answer they are 100% sure is correct.  
* **Best for:** Tasks where you want a very specific, factual answer, such as summarizing a document, answering a question about history, or writing a professional email.

---

### **High Temperature (Creative and Diverse)**

When the temperature is **high**, the AI gets more adventurous. It is more willing to choose a word that isn't the most probable one. This introduces **randomness** and **variety** into the AI's output.

* **Analogy:** Think of a creative writer brainstorming ideas. They don't just go with the most obvious word; they consider many different options to find something unique and interesting.  
* **Best for:** Creative tasks like writing a poem, creating a story, or brainstorming new ideas, where you want a less predictable and more imaginative result.

In short, **low temperature** gives you **certainty** and **facts**, while **high temperature** gives you **creativity** and **variety**.

---

### **Example** 

Let’s say we ask the AI a question, “why is the sky blue?”

When the temperature is low, the AI plays it safe. It will almost certainly choose the word with the highest probability. The next words that AI might come out could be:

* **Rayleigh scattering (95% chance)**  
* light (2% chance)  
* reflection (1% chance)  
* absorption (1% chance)  
* something (0.5% chance)

**The resulting sentence will be:** "The sky is blue because of a process called **Rayleigh scattering**."

However, when the temperature is high, the AI is more adventurous. It is less concerned with the most probable word and is more willing to pick from the other, less likely options, leading to more creative and diverse outputs. The next words that AI might come out could be:

* **Rayleigh scattering (60% chance)**  
* **light (15% chance)**  
* **reflection (10% chance)**  
* **sunlight's (5% chance)**  
* **atmosphere's (5% chance)**

This will result:

* "The sky is blue because of a process called **Rayleigh scattering**." (Still the most likely, but not guaranteed)  
* "The sky is blue because of a process called **light** scattering by the atmosphere." (A slightly different, but still correct, explanation)  
* "The sky is blue because of a process called **reflection**, as the tiny air molecules reflect the sun's blue light." (A less precise, but still plausible, explanation)  
* "The sky is blue because of a process called **the sunlight's** interaction with the atmosphere." (A more poetic, less technical answer)

# **TOP-P**

TOP-P, also known as **nucleus sampling**, is another way to control how creative an AI is when generating text. While **temperature** changes the likelihood of every possible next word, **TOP-P** focuses on narrowing down the choices to the most probable ones.

---

### **How TOP-P Works**

Imagine the AI has a list of possible next words for a sentence, each with its own probability (how likely it is to be chosen). With TOP-P, the AI will only consider the words at the top of this list until their **combined probability** reaches a certain percentage.

* **Low TOP-P:** Let's say you set TOP-P to 0.1 (or 10%). The AI will only look at the most likely words that add up to 10% of the total probability. This results in the AI choosing from a very small, certain group of words. The output will be very **safe** and **factual**.  
* **High TOP-P:** If you set TOP-P to 0.9 (or 90%), the AI will consider a much larger group of words from the top of the list, including many that are less likely. This gives the AI more options to choose from, leading to more **diverse** and **creative** outputs.

---

### **Example** 

Let’s use the example when the temperature is 0.8 above

Recap the next words that AI might come out could be:

* **Rayleigh scattering (60% chance)**  
* **light (15% chance)**  
* **reflection (10% chance)**  
* **sunlight's (5% chance)**  
* **atmosphere's (5% chance)**  
* **…**

With this example, AI calculates the combined probability as:

* **Rayleigh scattering (60% chance) \=\>** combined probability 60%  
* **light (15% chance) \=\>** combined probability 75%   
* **reflection (10% chance) \=\>** combined probability 85%  
* **sunlight's (5% chance) \=\>** combined probability 90%  
* **atmosphere's (5% chance) \=\>** combined probability 95%  
* …

Let’s say we set a low TOP-P (0.3). In this case, the AI's "fence" is placed after the word "Rayleigh scattering", since its **cumulative probability** is 60%. This means the AI only considers word **Rayleigh scattering** .

But when we set a high TOP-P (0.9), the AI would consider all the words up to "sunlight's," as their combined probability (60% \+ 15% \+ 10% \+ 5% \= 90%) is below the 90% threshold. The output could be “Rayleigh scattering”, "light", "reflection", or "sunlight's". 

# **Difference between TOP-P and Temperature**

The main difference between TOP-P and temperature is how they affect the word choices.

* **Temperature** changes the probabilities of *all* possible words. It makes the unlikely words a bit more likely, and the most likely words a bit less likely.  
* **TOP-P** completely **removes** the least likely words from consideration. It's like putting a fence around the most probable options and telling the AI to only choose from within that fence.

Because both controls are designed to adjust the AI's creativity, it's generally recommended to only adjust one at a time for the best results. You'd typically use a **low TOP-P** for factual tasks and a **high TOP-P** for creative ones.

# **Max Length** 

Max Length parameter is used to control the length of the token that model generated. When the model hits the limit of this parameter, it will stop generating more tokens immediately. 

Note the model is not smart enough based on this parameter to summarize or conclude its thoughts in a way that fits within the constraint; it simply stops generating tokens once the maximum is reached..

This can result in incomplete sentences or phrases. For instance, if you set `max length` to a small number and the model is in the middle of generating a long sentence, the output will abruptly end. It's a hard limit, not a suggestion for the model to "wrap up."

For example, if the model is generating the sentence: 

"The quick brown fox jumps over the lazy dog."

... and your `max length` is set to 5, the output might be: 

"The quick brown fox jumps..."

You may ask, as this parameter can lead to abrupt cut-offs, why do we need this parameter?

This is because the model may enter a “hallucination loop”, where it generates nonsensical or repetitive content indefinitely. A reasonable max length value could help us to ensure the normal output within the limit, and eliminate the risk for the prompts to generate a massive, unintended response. 

# **Stop sequence**

`Stop sequence` is another way to control when the model stops output. Instead of a hard limit, stop sequences stop when the model outputs a specific pattern. This gives us more granular control over the model output, also prevents the model from adding extra commentary or a narrative after the structured data, which could break our parsing code

### **Potential use cases of stop sequence**

Below are a few common use cases of the the stop sequence:

* **JSON or XML:** When asking the model to generate a JSON object, we can set the stop sequence to the closing tag, such as `}` or `</xml>`.  
* **Code Generation:** When asking an LLM to generate a code snippet, you can use a stop sequence like \`\`\`\` to ensure it stops after the code block.  
* **Lists and Bullet Points:** If we want a list with a specific number of items, we can use a stop sequence to control that. For example, if you want a list of 10 items, you can use `"11."` as the stop sequence.  
* **Dialogue Systems:** In a multi-turn chat or dialogue, we can use the other speaker's name as a stop sequence (e.g., `User:` or `Customer:` ). This tells the model to stop generating the response for one speaker and wait for the next turn, preventing it from role-playing as the other party.

# **Frequency Penalty**

Frequency penalty discourages the model from repeating a word based on how many times it has already appeared. Think of it as a cumulative penalty: the more a word is used, the more its chance of being chosen again decreases.

The model assigns a numerical score, called a **logit**, to each potential next word. A higher logit score means the word is more likely to be chosen. Frequency penalty works by lowering a word's logit score each time it is used. The penalty is applied for every occurrence of a word, so a word that has appeared three times will be penalized more heavily than a word that has appeared just once. This feature is particularly useful when you want to allow for some repetition of common words but prevent a single word from being overused.

For example, 

Let’s consider that originally the model wants to generate this sentence

 *The **cat** sat on the mat, and the dog barked at the **cat**, which then ran away from the **cat**.*

When we apply a Frequency penalty on the word "cat," this is what might happen:

* **1st Occurrence:** The model uses 'cat.' The penalty for 'cat' begins to accumulate.  
* **2nd Occurrence:** The model wants to use "cat" again. A penalty is now applied, but it's small, so the word "cat" is still a very high-probability choice. The model chooses "cat" again.  
* **3rd Occurrence:** The model now considers using "cat" a third time. The penalty has accumulated, making the word's probability significantly lower. The model now chooses a synonym like "it" to avoid the strong penalty.

*This yields an output that shows the penalty's increasing effect:* 

*`The cat sat on the mat, and the dog barked at the cat, which then ran away from it.`*

---

# **Presence Penalty**

Presence penalty, on the other hand, discourages the model from using a word at all after its first appearance. This penalty is a one-time deduction. Once a word has been used, its logit score is reduced, and that penalty remains the same regardless of how many times the word is used afterward.

Similar to frequency penalty, presence penalty reduces a word's **logit** score. However, this reduction happens only once when the word is first generated. This makes it a strong tool for encouraging a wider vocabulary and preventing any single word from being repeated, no matter how many times it has been used.

Let’s use the same example 

 *The **cat** sat on the mat, and the dog barked at the **cat**, which then ran away from the **cat**.*

*With a presence penalty on the word "cat," this is what might happen:*

* ***1st Occurrence:** The model uses "cat." A significant, one-time penalty is immediately applied to the word "cat," making it highly unlikely to be chosen again.*  
* ***2nd Occurrence:** The model wants to use "cat" again. The presence penalty has already been applied, making a different word like "it" or a synonym like "feline" far more probable. The model chooses "it."*  
* ***3rd Occurrence:** The word "cat" has already been used and is still subject to the same high penalty from the first time. It is very unlikely to be chosen again.*

*This yields a more concise and diverse output from the model:* 

*`The cat sat on the mat, and the dog barked at it, which then ran away from the feline.`*

---

# **Key Differences and Summary**

The core difference between the two lies in their cumulative nature. Frequency penalty is like a recurring fine that increases with each violation, while presence penalty is a single, permanent fine.

* Frequency Penalty penalizes per occurrence, making it great for reducing excessive repetition.  
* Presence Penalty penalizes per word, making it a more aggressive way to encourage a diverse vocabulary.

**Note in practice,** the general recommendation is to only use the frequency or presence penalty but not both. 

# **Extension: Beyond the Basics**

With a clear understanding of these core parameters, you are now equipped to move beyond basic prompt usage. This knowledge empowers you to approach LLM APIs not just as black boxes, but as finely tunable instruments. The real value lies in being able to diagnose why an AI's output might be repetitive or uncreative, and confidently experiment with different settings, tailoring the AI's behavior to complex tasks.
