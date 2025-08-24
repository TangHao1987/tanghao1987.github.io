# **Introduction**

When I first started learning about prompt engineering, I couldn't find comprehensive and well-structured articles explaining the fundamental settings provided by LLM APIs. Many articles were either too superficial, only scratching the surface of critical concepts, or the information was scattered across various sources, making it difficult to build a holistic understanding. This personal struggle sparked the motivation behind this write up.

My goal here is to provide a single, in-depth resource that addresses this gap. This article aims to be the go-to guide for anyone who needs a comprehensive understanding of the fundamental LLM parameters. These include the **Temperature**, **TOP-P**, **Max Length**, **Stop Sequence**, **Frequency Penalty**, and **Presence Penalty**. We'll explore how each of these influences creativity, coherence, and conciseness in AI-generated text, empowering users to effectively steer AI models toward desired outcomes.

# **Tokens**

Before we start discussing the parameters, it's crucial to have a solid understanding about the concept token. 

What are the tokens?

A token can be a single word, part of a word, a punctuation mark, or even a space. For an AI, it's like a computer's version of a letter or a syllable. 

## Examples of Tokenization

Let's look at a simple example to see how this works:

The sentence "**Hello there, my friend\!**" would be broken down by an AI into several tokens, such as:

![sentence_to_token](assets/llm_setting_img1.png)

Notice how some tokens, like **" there"** and **" my"**, include a space at the beginning. This is because the AI's tokenizer is designed to capture the spaces that separate words, which is crucial for the model to understand the structure of a sentence.

Here's another example with a more complex word:

The word "**unbelievable**" might be split into:

* **"un"**  
* **"bel"**  
* **"ievable"**

![sentence_to_token_2](assets/llm_setting_img2.png)

This helps the AI handle new or long words more effectively, as it can learn from the patterns in these smaller parts.

In short, tokens are how AI models **see** and **understand** language, by breaking it down into manageable, numbered pieces. Think of it as the AI's alphabet and vocabulary all rolled into one.

## Token IDs

Technically, AI assigns a number to each of these tokens. This numbering process allows the AI to understand and process text efficiently, since computers are better at working with numbers than with letters.

For example, let's take the sentence "**Hello there, my friend\!**". The AI first breaks this down into tokens: "Hello", " there", ",", " my", " friend", "\!".

Next, it assigns a unique number to each of these tokens based on its internal dictionary. This process is called **tokenization**, and the resulting numbers are a numerical representation of the text.

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
