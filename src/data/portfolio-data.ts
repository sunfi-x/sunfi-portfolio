/**
 * Static portfolio data for the AI assistant context.
 * This is the fallback/base data — live Sanity data is layered on top at request time.
 * Update this file to add new content the AI should know about.
 */

export const STATIC_PROFILE = {
  name: "Khondoker Sazzad Sunfi",
  tagline: "Data Science · Machine Learning · Artificial Intelligence",
  location: "Bangladesh",
  email: "sunfisazzad@gmail.com",
  bio: "Passionate about building intelligent systems that solve real-world problems. Focused on the intersection of data science, machine learning, and software engineering.",
  isAvailable: true,
  github: "https://github.com/sunfisazzad",
  linkedin: "https://linkedin.com/in/sunfisazzad",
  portfolio: "https://sunfi-portfolio.vercel.app",
};

export const STATIC_SKILLS = [
  {
    category: "AI / Machine Learning",
    items: [
      "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras",
      "Hugging Face Transformers", "LangChain", "OpenCV", "YOLO",
      "XGBoost", "LightGBM", "CatBoost",
    ],
  },
  {
    category: "Data Science",
    items: [
      "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly",
      "SQL", "PostgreSQL", "MongoDB", "Jupyter", "Apache Spark",
      "Power BI", "Tableau",
    ],
  },
  {
    category: "Full-Stack & Backend",
    items: [
      "Next.js", "React", "TypeScript", "FastAPI", "Node.js",
      "REST API", "GraphQL", "Sanity CMS", "Tailwind CSS",
    ],
  },
  {
    category: "DevOps & Cloud",
    items: [
      "Docker", "Git", "GitHub Actions", "Vercel", "Linux",
      "Jupyter Lab", "Google Cloud",
    ],
  },
];

export const STATIC_PROJECTS = [
  {
    title: "UIU Lost & Found V3",
    category: "AI Application",
    shortDescription:
      "Smart campus lost & found platform using FastAPI, React, and Gemini AI with automated ID scanning, OTP handovers, and AI-powered item verification quizzes.",
    techStack: ["FastAPI", "React", "Gemini AI", "SQLModel", "Python"],
    isFeatured: true,
  },
  {
    title: "PCOS ML Prediction Audit",
    category: "Data Science / Research",
    shortDescription:
      "Investigated data leakage in clinical ML models for PCOS prediction. Showed that pre-splitting SMOTE inflates F1-score by 9% and proposed correct validation pipelines.",
    techStack: ["Python", "Scikit-learn", "Pandas", "SMOTE", "XGBoost"],
    isFeatured: true,
  },
  {
    title: "Bangladesh DS Job Market Analyzer",
    category: "Data Engineering",
    shortDescription:
      "End-to-end scraping pipeline targeting LinkedIn job postings in Bangladesh. Used regex entity extraction and Pandas to build skill-demand frequency profiles for Data Science roles.",
    techStack: ["Python", "Scrapy", "Pandas", "Regex", "Matplotlib"],
    isFeatured: true,
  },
  {
    title: "Scalable ML Pipeline",
    category: "MLOps",
    shortDescription:
      "Designed a high-throughput ML pipeline handling 10,000 predictions/second using FastAPI for ingestion, Redis as broker, and Celery workers running GPU-based batch inference.",
    techStack: ["FastAPI", "Redis", "Celery", "PyTorch", "Docker"],
    isFeatured: false,
  },
];

export const STATIC_PAPERS = [
  {
    title: "Data Leakage in Clinical Machine Learning: A PCOS Case Study",
    conference: "Under Review",
    year: 2026,
    abstract:
      "Demonstrates how pre-splitting oversampling (SMOTE) artificially inflates accuracy metrics in clinical ML. Proposes stricter pipeline validation to ensure reproducible, trustworthy results.",
  },
];

export const STATIC_CONTACT = {
  email: "sunfisazzad@gmail.com",
  location: "Bangladesh",
  isAvailable: true,
  availabilityMessage: "Open to freelance, research collaboration, and full-time opportunities.",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/sunfisazzad" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/sunfisazzad" },
  ],
};

export const QUICK_PROMPTS = [
  { label: "Who is Sunfi?", prompt: "Tell me about Khondoker Sazzad Sunfi — who he is, his background, and what he specializes in." },
  { label: "Top ML Projects", prompt: "What are Sunfi's top machine learning and data science projects?" },
  { label: "Research & Papers", prompt: "Tell me about Sunfi's research papers and academic work." },
  { label: "How to Contact", prompt: "How can I contact Sunfi or hire him? What opportunities is he open to?" },
  { label: "Tech Skills", prompt: "What programming languages, frameworks, and tools does Sunfi know?" },
];
