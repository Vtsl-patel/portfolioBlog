import type { PortfolioData } from "@/types/portfolio";

/** Source of truth for content; keep wording faithful to the resume. Use **bold** for key phrases. */
export const portfolioData: PortfolioData = {
  profile: {
    name: "Vatsal Patel",
    role: "Software Engineer",
    company: "DevRev",
    headline: "Software Engineer • Frontend Systems",
    summary:
      "I build scalable frontend platforms and customer portals at DevRev, focused on Next.js, React, TypeScript, internationalization and testing across high-traffic products.",
    email: "work.vatsal.patel@gmail.com",
    location: "Ahmedabad, India",
    status: "Open to Software Engineer & Frontend Engineer opportunities",
    education: "IIIT Nagpur • B.Tech CSE (8.25 CGPA)",
    quote: { text: "Winter is coming.", source: "House Stark, Game of Thrones" },
    constellation: ["TypeScript", "React.js", "Next.js", "Microfrontends", "Node.js", "MongoDB", "Playwright", "Datadog"],
    about: [
      "I am a Software Engineer at DevRev, where I work on frontend web platforms, customer portals, and internationalization.",
      "I joined DevRev as an intern in September 2024 and moved into a full-time Member of Technical Staff role in June 2025. Since then I have built and launched customer portal features supporting 15 languages, serving 100K+ weekly users across 50+ organizations.",
      "I graduated with a B.Tech in Computer Science and Engineering from IIIT Nagpur (CGPA: 8.25). I am an avid problem solver with 1,000+ algorithmic problems solved across LeetCode, Codeforces, and CodeChef (3★ rated)."
    ],
    stats: [
      { label: "Weekly Active Users", value: "100K+", icon: "users" },
      { label: "Languages Supported", value: "15", icon: "globe" },
      { label: "Organizations Served", value: "50+", icon: "building" },
      { label: "Problems Solved", value: "1,000+", icon: "brain" }
    ],
    socials: [
      { id: "github", label: "GitHub", url: "https://github.com/Vtsl-patel", icon: "github", featured: true },
      { id: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/vatsal-patel-678640232/", icon: "linkedin", featured: true },
      { id: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/vtsl_patel/", icon: "leetcode", featured: true },
      { id: "codeforces", label: "Codeforces", url: "https://codeforces.com/profile/vatsal_patel", icon: "codeforces" },
      { id: "codechef", label: "CodeChef", url: "https://www.codechef.com/users/vatsal_patel", icon: "codechef" }
    ]
  },
  skills: [
    { category: "Languages", icon: "code", skills: ["JavaScript", "TypeScript", "C++", "C", "Python"] },
    { category: "Frontend", icon: "layout", skills: ["React.js", "Next.js", "HTML", "CSS", "i18next"] },
    {
      category: "Backend & Databases",
      icon: "server",
      skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Mongoose", "SQL"]
    },
    { category: "Testing & CI/CD", icon: "check", skills: ["Cypress", "Playwright", "Jest", "CircleCI"] },
    {
      category: "Architecture",
      icon: "cpu",
      skills: ["Microfrontends", "Reusable Hooks", "Raw Design System (RDS)", "Internationalization (i18n)"]
    },
    {
      category: "Observability & Tools",
      icon: "wrench",
      skills: ["Datadog", "BigQuery", "Git", "GitHub", "Postman", "Appwrite", "Cloudinary"]
    }
  ],
  experiences: [
    {
      id: "devrev-mts",
      company: "DevRev",
      role: "Member of Technical Staff",
      duration: "June 2025 — Present",
      startDate: "2025-06-01",
      type: "Full-Time",
      technologies: ["Next.js", "React.js", "TypeScript", "i18next", "Cypress", "Datadog", "E2E Testing"],
      highlights: [
        "Built and launched a multilingual customer portal supporting **15 languages** using Next.js, React.js, and i18next, implementing localized routing, URL-based locale management, and fallback handling. Enabled regional expansion associated with **$1.3M in incremental revenue** across a platform serving **50+ organizations** and **100K+ weekly users**.",
        "Engineered configurable cookie consent with local-storage persistence and **consent-aware Datadog tracking**, disabling tracking when consent was off. Owned implementation and Cypress E2E coverage across user- and admin-facing workflows, making the feature available to **100% of customer organizations**.",
        "Designed and delivered self-service portal configuration covering **20+ settings across 5+ sections**. Built reusable components, grouped settings, live preview, per-language publishing, and validation, reducing configuration time from hours to **under 10 minutes**.",
        "Increased ticket-list E2E test coverage from **0% to 100%**, resolving **10+ critical defects** across pagination, grouping, filtering, and sorting. Established scheduled regression runs that detected **5 critical bugs** before release.",
        "Implemented Datadog dashboards and threshold-based 4xx/5xx alerts across **10 APIs within 1 service**, routing notifications to code-owner Slack channels and email to accelerate diagnosis and resolution of API failures **within 30 minutes**.",
        "Investigated PLuG–customer portal integration issues, tracing and resolving approximately **10 defects across 3 workflows**: multilingual support, privacy controls, and login."
      ]
    },
    {
      id: "devrev-intern",
      company: "DevRev",
      role: "Member of Technical Staff Intern",
      duration: "September 2024 — June 2025",
      startDate: "2024-09-01",
      endDate: "2025-06-01",
      type: "Internship",
      technologies: ["React.js", "TypeScript", "Microfrontends", "Reusable Hooks", "Raw Design System (RDS)"],
      highlights: [
        "Completed migration of the **remaining 80% of customer portal hooks and components** to support microfrontend architecture, encapsulating business logic in **reusable hooks** to improve modularity, maintainability, and organization-level customization.",
        "Refactored React.js and TypeScript components to adopt **Raw Design System (RDS)** components, promoting consistent UI patterns and reducing duplicated presentation logic."
      ]
    }
  ],
  education: [
    {
      institution: "Indian Institute of Information Technology, Nagpur",
      degree: "B.Tech. in Computer Science and Engineering",
      duration: "2021 — 2025",
      grade: "CGPA: 8.25"
    }
  ],
  projects: [
    {
      id: "expense-tracker",
      title: "ExpenseTracker",
      icon: "wallet",
      description:
        "A local-first, offline-capable expense tracker with category budgets, spending reports and cross-device sync.",
      highlights: [
        "Built a **local-first, offline-ready** app: expenses are saved instantly on-device and synced when the connection returns, with remote changes merged on tab focus using **deletion tombstones** for non-destructive conflict resolution.",
        "Integrated **Google Drive backup** through OAuth 2.0 with the scoped `drive.file` permission, session-scoped tokens and a silent background token refresh.",
        "Decoupled UI from state and side effects using **Redux Toolkit** slices and custom hooks (`useAuth`, `useLedger`), keeping the root component a pure layout view."
      ],
      techStack: ["React 19", "TypeScript", "Redux Toolkit", "Tailwind CSS v4", "Vite", "Google Drive API"],
      githubUrl: "https://github.com/Vtsl-patel/ExpenseTracker"
    },
    {
      id: "chessify",
      title: "Chessify",
      icon: "gamepad",
      description:
        "A responsive local two-player chess app modelled on the Chess.com look and feel, with a rules engine written from scratch.",
      highlights: [
        "Implemented a **chess rules engine with no chess libraries**: legal-move validation by simulating moves on a virtual board (pins and king safety), **castling** with full transit-square checks, and **en passant**.",
        "Supported **click-to-move and drag-and-drop**, board flipping, last-move and check highlighting, and keyboard shortcuts via dedicated custom hooks.",
        "Managed game state with a **`useReducer` store** featuring move-history replay and per-player clocks."
      ],
      techStack: ["React 19", "TypeScript", "Vite", "Tailwind CSS"],
      githubUrl: "https://github.com/Vtsl-patel/Chess"
    },
    {
      id: "blog-app",
      title: "BlogApp",
      icon: "code",
      description:
        "A full-stack blog application with user authentication and post creation, editing, and retrieval.",
      highlights: [
        "Built a full-stack blog application with user authentication and post creation, editing, and retrieval, using **Appwrite for authentication and database operations**.",
        "Implemented **Redux Toolkit** for centralized state management, **React Router** for client-side navigation, and **React Hook Form** for form state and validation."
      ],
      techStack: ["React.js", "Redux Toolkit", "React Router", "React Hook Form", "Appwrite"],
      githubUrl: "https://github.com/Vtsl-patel/blogApp"
    },
    {
      id: "video-backend",
      title: "Video Backend",
      icon: "database",
      description:
        "RESTful backend services for a video-sharing platform covering authentication, media upload, and metadata management.",
      highlights: [
        "Developed **RESTful APIs** for a video-sharing platform, implementing server-side request handling and MongoDB-backed user and video metadata management.",
        "Implemented **JWT-based authentication** and **bcrypt** password hashing to support authenticated access and secure password storage.",
        "Integrated **Multer** for multipart file-upload handling and **Cloudinary** for media storage and delivery, connecting upload workflows with backend services."
      ],
      techStack: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Multer", "Bcrypt", "Cloudinary"],
      githubUrl: "https://github.com/Vtsl-patel/videoBackend"
    }
  ],
  achievements: [
    {
      id: "sih-2023",
      title: "Smart India Hackathon (SIH) 2023 — Finalist",
      category: "National Hackathon",
      icon: "trophy",
      description:
        "Developed a data analysis and visualization website to help identify factors contributing to school dropout rates across Gujarat."
    },
    {
      id: "competitive-programming",
      title: "Competitive Programming",
      category: "Problem Solving",
      icon: "code",
      description:
        "Solved 1,000+ problems across LeetCode, CodeChef, and Codeforces; achieved a 3-star CodeChef rating.",
      links: [
        { label: "LeetCode", url: "https://leetcode.com/u/vtsl_patel/" },
        { label: "CodeChef (3★)", url: "https://www.codechef.com/users/vatsal_patel" },
        { label: "Codeforces", url: "https://codeforces.com/profile/vatsal_patel" }
      ]
    }
  ],
  recommendations: [
    {
      id: "ayush-banerjee",
      name: "Ayush Banerjee",
      headline: "Startup Partnerships, Mesa School | ISB",
      relationship: "Worked with Vatsal on the same team",
      date: "2026-10-17",
      text: [
        "Aggressive builder & problem solver. Additionally, very good at going door to door of every internal team to get his dependencies met.",
        "Built the entire customer portal offering of DevRev including multi language capabilities, AI deflection on ticket creation, test coverage & reliability systems. His ownership of multi language roped in ~$1.3 mn."
      ]
    },
    {
      id: "ayush-pandya",
      name: "Ayush Pandya",
      headline: "Member of Technical Staff @Devrev",
      relationship: "Worked with Vatsal on the same team",
      date: "2026-10-17",
      text: [
        "I’ve enjoyed working with Vatsal Patel at DevRev. What I appreciate most is that Vatsal’s attention doesn’t end when the code is written. He cares about deployment, observability, and how the product performs in practice. He’s a thoughtful, dependable engineer who takes responsibility for the full journey from implementation to production. I’d gladly recommend him to any team that values that kind of follow-through."
      ]
    },
    {
      id: "yash-mantri",
      name: "Yash Mantri",
      headline: "Engineering @ DevRev | ReactJS, React Native, Typescript, Javascript and NextJS | Ex- Navi, AJIO",
      relationship: "Worked with Vatsal on different teams",
      date: "2026-10-19",
      text: [
        "I had the opportunity to work with Vatsal on multiple initiatives. He is a collaborative and dependable engineer who takes ownership of his work and works well with the team to solve problems.",
        "I really enjoyed working with him and appreciate his technical expertise, collaborative mindset, and commitment to delivering quality work. I’d be happy to recommend him!"
      ]
    }
  ]
};
