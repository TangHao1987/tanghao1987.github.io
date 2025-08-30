# Understanding Large Language Models: From Basics to Breakthroughs

The past few years have been dynamic since the emergence of ChatGPT, and during this time, leading model companies have been intensely competing, pushing the capabilities of these models further and further. What began with simple text generation and question answering has evolved into Large Language Models (LLMs) handling an increasingly diverse array of tasks. While the ultimate trajectory of this technology is uncertain, understanding its underlying mechanisms is becoming ever more crucial. Even for those not involved in model training, grasping these principles can empower us to better utilize this innovative tool.

This article will guide you through the evolution of neural networks, providing an in-depth and accessible explanation of the core mechanisms behind LLMs.

## Recap: Traditional Neural Network
Before we delve into Large Language Models, it's essential to start with their foundational predecessor: **Traditional Neural Networks**.

The structure of traditional neural networks is simple; they're normally formed by three layers:
- **Input Layer**: Receives raw data, such such as pixel values of an image or a numerical value.

- **Hidden Layers**: Each neuron receives output from the previous layer, performs a non-linear transformation via weighted summation (involving weights and biases) and an activation function (e.g., ReLU, Sigmoid), then passes the result to the next layer.

- **Output Layer**: Produces the final result, for instance, probabilities for "cat" or "dog" in image classification.

![forward neural network](assets/understanding-llm/forward.gif)

The functionality of the traditional network is to **extract high-level features from the raw input data**. These networks proved revolutionary for tasks such as image recognition, pattern classification, and data clustering, making significant strides in areas where data points were relatively independent. However, they faced inherent limitations, particularly in handling sequential data, as they lacked a mechanism to 'remember' past inputs.

## Addressing the Challenge of Sequential Data: Introducing Recurrent Neural Networks (RNNs) 

To address the shortcomings of traditional neural networks in handling sequential data, **Recurrent Neural Networks (RNNs)** were developed.

The core of RNNs is a key component: the **Hidden State**. This acts as the network's "memory," cyclically passed across time steps, allowing it to consider previous inputs when processing current ones.

The functionality of RNNs is to process sequential data and capture temporal dependencies. After training, RNNs make predictions based on learned sequential patterns through these steps:

1. **Sequential Input**: The model receives the initial part of a sequence (or the first element).

2. **State Transfer & Prediction**: At each time step, based on the current input and the hidden state from the previous time step, the model computes a new hidden state and a predicted output for the current time step. The new hidden state is then passed to the next time step, maintaining contextual coherence.

3. **Sequence Generation**: This process can loop to generate an entire sequence, such as predicting subsequent words.

This innovation allowed them to understand context and order within data, making significant strides in areas like natural language processing where the sequence of information is crucial. However, despite this advancement, RNNs still faced considerable challenges, particularly in retaining information over very long sequences and their inherent difficulty with parallel computation.

![rnn](assets/rnn.png)

## The Sequence Revolution: Transformer and Large Language Models (LLM)
To overcome RNNs' limitations, particularly the long-range dependency and parallel computation problems, Google introduced the **Transformer architecture** in 2017. It fundamentally revolutionized the field of sequence processing and became the cornerstone of all modern LLMs. The Transformer abandons the recurrent structure and relies entirely on the **Self-Attention** Mechanism. This allows the model to **Process entire input sequences in parallel** and **directly capture long-range dependencies**.

This means the LLM has the capability to calculate relationships between all words simultaneously, significantly boosting training efficiency. At the same time, it can capture the relationship between any words, no matter how far apart they are.


## Transformer Architecture

The heart of an LLM is a massive neural network, primarily based on the Transformer architecture. 

![forward neural network](assets/understanding-llm/transformer.png)

The diagram above illustrates the basic Transformer architecture. It primarily consists of an Encoder and a Decoder (many LLMs, like the GPT series, predominantly use the decoder part). You can see, the encoder and decoder are formed by the similar components: **Multi-head Attention**, **Add & Norm** and **Feed Forward** .

### Multi-head Attention: Self-Attention Mechanism
The Self-Attention Mechanism is the most innovative part of the Transformer, addressing how the model "understands" the importance of a word by considering its context. It allows the model, when processing one word, to "attend" to all other words in the input sequence and assign them an **Attention Score**. A higher score indicates greater importance of that word to the currently processed word.
To achieve this, each input word's embedding vector is transformed into three different vectors via **weight matrices**:
- **Query Vector (Q)**: Imagine it as a "questioner." It contains the information the current word is "seeking."
-  **Key Vector (K)**: Imagine it as an "information tag." It contains the information the current word can "provide" to be "found" by other words.
- **Value Vector (V)**: Imagine it as "actual information." It contains the specific content of the current word.
Let's use a concrete example to understand the information contained within Q, K, and V vectors:

![embedding](assets/understanding-llm/embedding.png)

Let's use this sentence as an example

 `The apple is`
 
When the model processes the word "apple":
- Qapple​ (Query Vector): Contains the type of information "apple" needs to "seek" in the current context. It might be "asking": `"What am I? What are my attributes?"`
- Kall_words​ (Key Vector): Every word in the sentence has a K vector, acting like an "information tag" on the word, responding to other words' "queries."
  - Kapple​ might contain: "I am a fruit, with healthy properties."
  - Kis​ might contain: "I am a verb, indicating connection."
- Vall_words​ (Value Vector): Contains the specific content of each word, which is the actual information passed to the "questioner" once a match between Q and K is successful.
  - Vapple​ might contain: "My specific meaning is a red or green fruit."
  - Vis​ might contain: "My specific meaning is to establish equivalence."

![multi head attention](assets/understanding-llm/attention.png)

#### Weight Calculation Process

At first, the model calculates a similarity Scores by computing **the dot product of the current word's Q vector with the K vectors of all words in the sentence**, to get the Attention Score. 

`Attention Score = Q (current word) · K (all words)`

This score represents the similarity or relevance between the current word and every word in the sequence.

After that, the attention scores are transformed by **the Softmax function** into a probability distribution **between 0 and 1**. These are the Attention Weights, and they sum up to 1.
Weighted Sum: The model uses these weights to perform **a weighted sum of the V vectors of all words**, resulting in a final Context Vector. This vector contains aggregated information from all relevant words for the current word and is crucial for the model's contextual understanding.

### Feed Forward Network
The feed-forward network is a simple **two-layer or multi-layer "traditional" neural network**, similar to what we discussed earlier. Its core role is to perform independent and non-linear feature transformation and information refinement on the attention output for each position (i.e., each Token). After the self-attention mechanism captures global relationships between words and aggregates contextual information, the feed-forward network conducts a deeper level of "local fine-tuning" and "information distillation" for each Token's representation. It uses non-linear transformations to convert the abstract information obtained from the attention layer into richer, more useful feature representations. You can think of the self-attention mechanism as capturing "global relationships," packaging all relevant information for each word. The feed-forward network then "locally processes" this packaged information for each word, further enhancing its semantic representation. It indeed performs deeper "extraction" and "transformation" of information, but this extraction occurs after the attention mechanism has already aggregated global contextual information and is applied independently to each Token.

![softmax](assets/understanding-llm/feed_forward.png)

### Add & Norm
Add & Norm is a structure that helps solve a typical deep learning problem called the **vanishing gradient problem**. The main issue is that after the signal propagates through multiple layers, the changes to the weights become extremely small, which causes learning to become very slow. Hence, adding this **Add & Norm** step provides "shortcuts" that allow the gradient to bypass one or more layers, preventing it from decaying. You can see that all the `Multi-head Attention` and `Feed Forward Network` in the architecture diagram have this structure.

![forward neural network](assets/understanding-llm/add_norm.png)

## How LLM "talks": LLM Inference Mechanism
With a grasp of these components, understanding inference becomes straightforward: The input text is converted into vectors via the word embedding layer, then fed into the Transformer's decoder (or a pure decoder architecture). Within each multi-head self-attention layer, the input vectors are transformed into Query (Q), Key (K), and Value (V) vectors using trained weight matrices as described in the previous session. Multiple "heads" then independently calculate attention scores, determining dynamic weights based on the relationships between these Q and K vectors across the entire input sequence. These dynamic weights are then used to create a weighted sum of the V vectors. This process, repeated across successive layers of self-attention, Add & Norm, and Feed Forward, ultimately generates a **Context Vector** rich in contextual information.

After that, the context will be passed into a **Linear Layer**, that will transfer the context to a vector, the size of the vector is same as the number of total `tokens` of the model. Each value in this resulting vector called `logits`, corresponds to a specific word (or token) in the vocabulary, representing its initial, unnormalized score or "likelihood" before being converted into probabilities. By the way, the model typically contains 30,000 to 200,000 tokens. 

Finally, the model passes raw scores (logits) into a **Softmax function**, which converts them to a probability distribution (with values between 0 and 1), where all values sum to 1. Each word in the vocabulary now possesses a specific probability, indicating its likelihood of being the next word. Then, based on parameters like `temperature` and `top-P`, the model selects a word accordingly. This completes the generation of **one token**.

![softmax](assets/understanding-llm/softmax.png)

This process repeats, with the newly selected token being added to the input sequence, until the model generates a pre-defined stop token or reaches its maximum token limit.

## Acquiring Intelligence: Large Language Model Training Mechanism
We talked about how, during inference, the model has the ability to convert the input sequence into three vectors. The conversion is done by using the initial input to dot product three different weight matrices W(Q), W(K), and W(V). You can think of these three matrices as the LLM's "knowledge," which is learned through an iterative training process, much like a student attending school every day. 

### The beginning of training
At the beginning of training, all model parameters (including the W(Q), W(K), W(V) matrices, and all weights and biases in the linear layers and feed-forward networks) are randomly initialized, meaning the model is completely "clueless" and its predictive ability is far from its eventual generative prowess. At this stage, you can think the LLM is just a baby, with no ability to do anything meaningful.

### Training Data and "Labels": The Learning Material
LLM training is a form of **unsupervised learning**, more accurately termed **self-supervised learning**. This means it doesn't require human-annotated "labels."
**Input**: A sequence of text (e.g., "The sun rises in the east and sets in the west.")
**"Labels"**: The model's objective is to predict the next word. So, for each word in the input sequence, its "correct" next word is simply the word that actually follows it in the original text.
**Example 1**: "The sun rises in the east, and" – The target is to predict "sets."
**Example 2**: "The sun rises in the east, and sets in the" – The target is to predict "west."
This self-supervised approach is one of the most remarkable aspects of LLM training, allowing the model to learn without explicit human guidance. For this step, the LLM is like a hard-working student, trying to read all the books they have, over and over again.

### Forward Propagation and Error Calculation.
The model receives a piece of text (e.g., "The sun rises in the east, and"), and then, following the steps we discussed earlier (word embeddings, Transformer layers, Q/K/V calculations, attention, feed-forward network, linear layer, Softmax), it predicts the probability distribution for the next word.
In the early stages of training, with its randomly initialized parameters, the model's predicted next word is typically very wrong or entirely irrelevant. A Loss Function (commonly cross-entropy loss) then calculates the "distance" or "mismatch" between the model's predicted probability distribution and the true next word's probability distribution, quantifying the model's error.
This step is like a quiz, helping the model identify what it understands well and where it has misconceptions.

### Backpropagation and Optimizer: Adjusting Parameters
This is the most crucial and magical step in the training process. Backpropagation is an algorithm that, based on the error calculated by the loss function, "traces" back through the model's structure, layer by layer, to determine how much each parameter (including every value in the WQ,WK,WV matrices) contributed to that error.
This "contribution degree" is called the Gradient. The gradient tells the model: to reduce the loss, should a particular parameter increase or decrease, and by how much? With the gradient information for each parameter, an Optimizer (e.g., Adam, SGD) then uses these gradients to update the model's parameters. The goal of this adjustment is to bring the model's predictions closer to reality, thereby continuously reducing the loss function value. 

LLM student tries to summarize it's mistake, do reflection, and aim for doing right in the next quiz.

### Iterative Loop: Continuous Learning
The "forward propagation -> loss calculation -> backpropagation -> parameter update" is an Iterative process. The model repeatedly goes through this cycle:
- Reads a small batch of training data.
- Makes predictions, calculates loss.
- Updates all parameters.

This loop is executed millions, billions, or even trillions of times over massive amounts of text data. As training progresses, the model's loss gradually decreases, its predictive ability becomes more accurate, and those randomly initialized WQ,WK,WV matrices gradually learn how to effectively extract and represent complex patterns in language.
LLM student tries to repeat the process for learnign different subjects. Ultimately, when training is complete, the model acquires the powerful language understanding and generation capabilities we observe today. This process requires immense computational resources and time.

## Conclusion: From Raw Data to Intelligent Parameters 💡
LLM training is an iterative process of trial and error and continuous learning. Through large-scale self-supervised learning, forward propagation for prediction, loss functions for quantifying errors, backpropagation for tracing error sources, and optimizers for adjusting parameters, the model transforms randomly initialized parameters (including the W(Q), W(K), W(V) matrices) into optimized values that enable it to understand and generate text highly similar to human language. This is all made possible by an intricate combination of mathematics and computation.
