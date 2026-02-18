export const STATIC_COURSES = [
    // ── Web Development ──
    { id: 'bWACo_pvKxg', dur: 840, title: 'HTML & CSS Full Course', category: 'Web Development', summary: 'A complete 14-hour guide to building websites from scratch with HTML and CSS.', icon: '🌐' },
    { id: 'H3XIJYEPdus', dur: 930, title: 'JavaScript Full Course', category: 'Web Development', summary: 'A thorough 15.5-hour JavaScript course covering fundamentals, DOM manipulation, async programming, and ES6+ features.', icon: '🟨' },
    { id: 'M9O5AjEFzKw', dur: 3000, title: 'React - The Complete Course', category: 'Web Development', summary: 'A massive 50-hour React course covering hooks, context, Redux, Next.js, testing, and production-ready apps.', icon: '⚛️' },
    { id: 'ZvZ7gvcmPmI', dur: 61, title: 'TypeScript Crash Course', category: 'Web Development', summary: 'Master TypeScript basics in one hour — types, interfaces, classes, and integration.', icon: '🖥️' },
    { id: 'zeCDuo74uzA', dur: 210, title: 'TypeScript Full Course', category: 'Web Development', summary: 'A 3.5-hour deep dive into TypeScript covering advanced types, generics, decorators, and real-world projects.', icon: '📘' },
    { id: '6_wK_Ud8--0', dur: 48, title: 'Jetpack Compose', category: 'Mobile Development', summary: 'Build modern Android UIs with Jetpack Compose — declarative layouts, state management, and Material Design 3.', icon: '📱' },
    { id: 'Kt2E8nblvXU', dur: 98, title: 'Vue.js Full Course', category: 'Web Development', summary: 'Learn Vue.js from the ground up — Options API, Composition API, Vue Router, and Pinia.', icon: '💚' },
    { id: 'CpbRAWgFBRQ', dur: 60, title: 'Blazor Fundamentals', category: 'Web Development', summary: "Build interactive web UIs using C# with Microsoft's Blazor framework.", icon: '🖥️' },
    { id: '-qfEOE4vtxE', dur: 240, title: 'Bootstrap 5 Full Course', category: 'Web Development', summary: 'Learn to build responsive websites quickly using Bootstrap 5. Grid system, components, and utilities.', icon: '🖥️' },
    // ── Programming ──
    { id: '8jLOx1hD3_o', dur: 1867, title: 'C++ Tutorial for Beginners', category: 'Programming', summary: 'A complete introduction to C++ — syntax, memory management, pointers, and OOP.', icon: '⌨️' },
    { id: 'BpPEoZW5IiY', dur: 839, title: 'Rust Programming Course', category: 'Programming', summary: 'A comprehensive 14-hour Rust course covering ownership, borrowing, lifetimes, and systems programming.', icon: '🦀' },
    { id: '1o0c-zD3iFU', dur: 248, title: 'Oracle SQL Full Course', category: 'Databases', summary: 'A 4-hour Oracle SQL course covering queries, joins, subqueries, PL/SQL, and database administration.', icon: '🗄️' },
    { id: 'YS4e4q9oBaU', dur: 390, title: 'Go Programming (Golang) Course', category: 'Programming', summary: 'A comprehensive Go course including syntax, concurrency, and real-world projects.', icon: '🐹' },
    // ── Computer Science ──
    { id: '8mAITcNt710', dur: 1560, title: 'Harvard CS50: Intro to CS', category: 'Computer Science', summary: "Harvard's famous intro to CS — C, Python, SQL, algorithms, and data structures.", icon: '🎓' },
    { id: 'o0XbHvKxw7Y', dur: 1113, title: 'Django for Everybody', category: 'Web Development', summary: 'An 18.5-hour Django course covering models, views, templates, forms, authentication, and deployment.', icon: '🐍' },
    // ── Science & Maths ──
    { id: '6OV3tmt9uhs', dur: 2068, title: 'General Chemistry Full Course', category: 'Science & Maths', summary: 'University-level course covering atoms, stoichiometry, thermodynamics, kinetics, and equilibrium.', icon: '🧪' },
    { id: 'G9JxuWk7BDA', dur: 212, title: 'Discrete Mathematics', category: 'Science & Maths', summary: 'Math behind CS: logic, set theory, combinatorics, graph theory, and proofs.', icon: '📐' },
    // ── Data Science ──
    { id: 'gWvwu7qLjJs', dur: 1377, title: 'TensorFlow Full Course', category: 'Data Science', summary: '22+ hour TensorFlow course — neural networks, CNNs, RNNs, transfer learning, and deployment.', icon: '🧠' },
    { id: 'V_xro1bcAuA', dur: 72, title: 'Machine Learning Roadmap 2025', category: 'Data Science', summary: 'Step-by-step guide to becoming an ML Engineer — math, Python, neural networks, and MLOps.', icon: '🤖' },
    { id: 'oXlwWbU8l2o', dur: 221, title: 'OpenCV Full Course', category: 'Data Science', summary: 'Computer vision with OpenCV and Python — image processing, object detection, face recognition.', icon: '👁️' },
    { id: 'QtiM87MV27w', dur: 69, title: 'ASP.NET MVC App Tutorial', category: 'Web Development', summary: 'Build a complete ASP.NET MVC web application from scratch with C#, Entity Framework, and authentication.', icon: '🖥️' },
    { id: 'CMEWVn1uZpQ', dur: 218, title: 'Python for Data Science', category: 'Data Science', summary: 'Python libraries for data analysis — Pandas, NumPy, Matplotlib, and Seaborn.', icon: '🐍' },
    // ── DevOps ──
    { id: '6WatcfENsOU', dur: 141, title: 'Linux Crash Course', category: 'DevOps', summary: 'Fast-paced Linux intro — command line, file system, permissions, processes, and tools.', icon: '🛠️' },
    { id: 'un6ZyFkqFKo', dur: 78, title: 'Cloud Computing Essentials', category: 'DevOps', summary: 'Cloud computing building blocks, serverless architectures, and deployment strategies.', icon: '☁️' },
    { id: 'Wf2eSG3owoA', dur: 360, title: 'Docker & Kubernetes Full Course', category: 'DevOps', summary: 'Complete guide to containerization with Docker and orchestration with Kubernetes.', icon: '🐳' },
    { id: 'a_SthPXtV6c', dur: 2, title: 'Docker in 100 Seconds', category: 'DevOps', summary: 'Docker containerization basics — images and consistent app shipping.', icon: '🐳' },
    // ── Databases ──
    { id: 'SpfIwlAYaKk', dur: 173, title: 'PostgreSQL Crash Course', category: 'Databases', summary: 'Rapid PostgreSQL intro — SQL queries, database design, and JSONB features.', icon: '🗄️' },
    { id: 'XCsS_NVAa1g', dur: 42, title: 'Redis Crash Course', category: 'Databases', summary: 'Redis in-memory key-value store — caching, pub/sub, and data persistence.', icon: '⚡' },
    // ── Mobile Development ──
    { id: '-VC3hIEL7eQ', dur: 237, title: 'Swift for Beginners', category: 'Mobile Development', summary: "A 4-hour Swift course covering syntax, optionals, closures, protocols, and iOS app development with SwiftUI.", icon: '📱' },
    { id: 'VPvVD8t02U8', dur: 2199, title: 'Flutter Course for Beginners', category: 'Mobile Development', summary: "Cross-platform mobile apps with Google's Flutter and Dart.", icon: '📱' },
    { id: '9UKCv9T_rIo', dur: 115, title: 'React Native & Expo Router', category: 'Mobile Development', summary: 'Build a full-featured meditation app using React Native and Expo Router.', icon: '📱' },
    // ── Software Engineering ──
    { id: '5rNk7m_zlAg', dur: 762, title: 'Spring Boot Tutorial - Ian Cooper', category: 'Programming', summary: 'Complete Spring Boot course — building REST APIs, dependency injection, and modern Java application development.', icon: '🍃' },
    { id: 'blKkRoZPxLc', dur: 170, title: 'Advanced Software Concepts', category: 'Software Engineering', summary: 'Advanced programming paradigms and architectural patterns for scalable systems.', icon: '🧩' },
    { id: 'mAFoROnOfHs', dur: 148, title: 'Git & GitHub Full Course', category: 'Software Engineering', summary: 'Complete Git and GitHub guide — commits, branching, merging, and pull requests.', icon: '🔀' },
    // ── Cybersecurity ──
    { id: 'ug8W0sFiVJo', dur: 215, title: 'Kali Linux Full Course', category: 'Cybersecurity', summary: '3h 35m guide to Kali Linux — penetration testing, tools, scanning, and ethical hacking.', icon: '🐉' },
    { id: 'fgdpvwEWJ9M', dur: 225, title: 'Firebase Full Course', category: 'Databases', summary: 'A 3.75-hour Firebase course covering Firestore, Authentication, Cloud Functions, Storage, and hosting.', icon: '🔥' },
    // ── Backend Development ──
    { id: '5VUjP1wMqoE', dur: 174, title: 'Spring Boot & PostgreSQL API', category: 'Backend Development', summary: 'Build a RESTful API with Java Spring Boot, PostgreSQL, and JWT security.', icon: '☕' },
    // ── Game Development ──
    { id: '6UlU_FsicK8', dur: 660, title: 'Unreal Engine 5 C++ Tutorial', category: 'Game Development', summary: 'Start game dev with Unreal Engine 5 and C++. Engine interface and scripting.', icon: '🎮' },
    // ── Productivity ──
    { id: 'DosHnyq78xY', dur: 73, title: 'Intro to MCP Servers', category: 'Productivity', summary: 'Bridge your terminal and AI workflow using MCP servers for developer productivity.', icon: '🤖' },
];
