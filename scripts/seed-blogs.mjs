// Blog seed script — run with: node scripts/seed-blogs.mjs
// Requires SANITY_API_TOKEN in your environment or .env.local

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "dtiuhif4",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // must have write access
  useCdn: false,
});

const blogs = [
  {
    _type: "blog",
    title: "Building a Neural Network from Scratch with Python and NumPy",
    slug: { _type: "slug", current: "neural-network-from-scratch-python-numpy" },
    publishedAt: "2026-07-15T10:00:00Z",
    readTime: "12 min read",
    tags: ["deep-learning", "python", "neural-networks"],
    excerpt:
      "A step-by-step walkthrough of implementing a fully connected neural network using only NumPy — covering forward propagation, backpropagation, and gradient descent without any ML framework.",
    body: [
      {
        _type: "block",
        _key: "intro1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Understanding the math behind neural networks is the single most important skill a machine learning engineer can develop. In this post, we build a fully connected feedforward neural network using only NumPy — no PyTorch, no TensorFlow.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h1",
        style: "h2",
        children: [{ _type: "span", _key: "s2", text: "Why NumPy Only?" }],
      },
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s3",
            text: "When you use a framework, the backpropagation step is abstracted away. Building from scratch forces you to deeply understand how gradients flow through each layer — this intuition is invaluable when debugging real models.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2",
        style: "h2",
        children: [{ _type: "span", _key: "s4", text: "Architecture" }],
      },
      {
        _type: "block",
        _key: "p2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s5",
            text: "Our network has: an input layer, two hidden layers with ReLU activations, and an output layer with a softmax activation for multi-class classification. The loss function used is cross-entropy.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h3",
        style: "h2",
        children: [{ _type: "span", _key: "s6", text: "Forward Pass" }],
      },
      {
        _type: "block",
        _key: "p3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s7",
            text: "For each layer l, compute Z[l] = W[l] @ A[l-1] + b[l], then A[l] = activation(Z[l]). The ReLU function simply clips negative values to zero, which introduces the non-linearity the network needs to learn complex patterns.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h4",
        style: "h2",
        children: [{ _type: "span", _key: "s8", text: "Backpropagation" }],
      },
      {
        _type: "block",
        _key: "p4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s9",
            text: "The chain rule is applied in reverse: we compute dL/dZ for each layer, then dL/dW and dL/db for parameter updates. The key insight is that gradients flow backward proportionally to the weight magnitudes — which is why weight initialization matters so much.",
          },
        ],
      },
      {
        _type: "block",
        _key: "p5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s10",
            text: "By the end of this tutorial you will have a working classifier trained on the MNIST digit dataset achieving ~95% accuracy — built entirely from 200 lines of pure NumPy.",
          },
        ],
      },
    ],
  },
  {
    _type: "blog",
    title: "Exploratory Data Analysis: Techniques Every Data Scientist Must Know",
    slug: { _type: "slug", current: "eda-techniques-data-scientist" },
    publishedAt: "2026-06-28T08:00:00Z",
    readTime: "9 min read",
    tags: ["data-science", "eda", "pandas", "visualization"],
    excerpt:
      "EDA is not just plotting histograms. This guide walks through distribution analysis, correlation matrices, outlier detection, and feature interaction heatmaps using Pandas and Seaborn.",
    body: [
      {
        _type: "block",
        _key: "intro1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Exploratory Data Analysis (EDA) is the most underrated phase of any machine learning pipeline. Rushing past it is the number-one reason models fail silently in production. This guide covers the techniques that separate good data scientists from great ones.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h1",
        style: "h2",
        children: [{ _type: "span", _key: "s2", text: "1. Distribution Analysis" }],
      },
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s3",
            text: "Before modeling, check whether each feature is normally distributed, skewed, or multimodal. Use df.describe() as a starting point, then plot KDE curves overlaid on histograms. Skewed distributions often benefit from log or Box-Cox transformations.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2",
        style: "h2",
        children: [{ _type: "span", _key: "s4", text: "2. Correlation & Multicollinearity" }],
      },
      {
        _type: "block",
        _key: "p2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s5",
            text: "Pearson correlation captures linear relationships, but Spearman rank correlation is more robust for non-linear patterns. A heatmap of the correlation matrix instantly reveals which features move together — a key signal for feature selection and avoiding multicollinearity in regression models.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h3",
        style: "h2",
        children: [{ _type: "span", _key: "s6", text: "3. Outlier Detection" }],
      },
      {
        _type: "block",
        _key: "p3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s7",
            text: "The IQR method (flagging values beyond 1.5×IQR from Q1/Q3) is a simple and interpretable starting point. For high-dimensional data, consider Isolation Forest or Local Outlier Factor — these models score each point by how isolated it is from its neighbors.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h4",
        style: "h2",
        children: [{ _type: "span", _key: "s8", text: "4. Feature Interaction" }],
      },
      {
        _type: "block",
        _key: "p4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s9",
            text: "Pair plots (sns.pairplot) reveal interaction effects that individual distributions miss. Facet grids stratified by target class are especially useful for classification: you want features that separate classes cleanly.",
          },
        ],
      },
    ],
  },
  {
    _type: "blog",
    title: "Transformer Architecture Explained: Attention Is All You Need — Simplified",
    slug: { _type: "slug", current: "transformer-architecture-attention-explained" },
    publishedAt: "2026-05-10T09:00:00Z",
    readTime: "15 min read",
    tags: ["deep-learning", "transformers", "nlp", "attention"],
    excerpt:
      "The Transformer paper revolutionized NLP and then AI entirely. This post breaks down self-attention, multi-head attention, positional encoding, and the encoder-decoder architecture with clear diagrams and intuition.",
    body: [
      {
        _type: "block",
        _key: "intro1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "In 2017, Vaswani et al. published 'Attention Is All You Need' — a paper that eliminated recurrence entirely from sequence modeling. The resulting Transformer architecture is now the backbone of GPT, BERT, T5, and every other modern large language model. Let's understand it from first principles.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h1",
        style: "h2",
        children: [{ _type: "span", _key: "s2", text: "The Problem with RNNs" }],
      },
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s3",
            text: "Recurrent Neural Networks process sequences step by step. This creates two critical bottlenecks: (1) they cannot be parallelized during training, making them slow; (2) they struggle to retain information across long sequences due to vanishing gradients. Transformers solve both problems simultaneously.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2",
        style: "h2",
        children: [{ _type: "span", _key: "s4", text: "Self-Attention: The Core Idea" }],
      },
      {
        _type: "block",
        _key: "p2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s5",
            text: "Self-attention asks: 'for each word in a sentence, which other words should I pay attention to?' For every token, we compute three vectors — Query (Q), Key (K), and Value (V) — by multiplying the input embedding with learned weight matrices. Attention scores are computed as softmax(QKᵀ / √d_k) × V.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h3",
        style: "h2",
        children: [{ _type: "span", _key: "s6", text: "Multi-Head Attention" }],
      },
      {
        _type: "block",
        _key: "p3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s7",
            text: "Instead of one attention function, Transformers run h parallel attention heads, each with its own Q, K, V projections. This allows the model to attend to information from different representation subspaces simultaneously — capturing both syntactic and semantic relationships.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h4",
        style: "h2",
        children: [{ _type: "span", _key: "s8", text: "Positional Encoding" }],
      },
      {
        _type: "block",
        _key: "p4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s9",
            text: "Since there is no recurrence or convolution, the model has no notion of word order. Positional encodings — sine and cosine functions of different frequencies — are added directly to the input embeddings, allowing the model to reason about sequence position.",
          },
        ],
      },
      {
        _type: "block",
        _key: "p5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s10",
            text: "The full encoder stack consists of N identical layers, each with multi-head attention followed by a feed-forward network, with residual connections and layer normalization around each sub-layer. This elegant design made Transformers the default architecture for virtually every modern AI system.",
          },
        ],
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding 3 blog posts to Sanity...\n");

  for (const blog of blogs) {
    try {
      const result = await client.create(blog);
      console.log(`✅ Created: "${blog.title}" (id: ${result._id})`);
    } catch (err) {
      console.error(`❌ Failed: "${blog.title}"`, err.message);
    }
  }

  console.log("\nDone!");
}

seed();
