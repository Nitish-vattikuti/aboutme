# src/data/generate_qa.py
import json
import os

qa_list = []

def generate_alternatives(q, keywords):
    alts = [q.lower().replace("?", "").strip()]
    
    # 1. Start-word rephrasing
    lower_q = q.lower()
    if lower_q.startswith("what is"):
        subject = q[7:].replace("?", "").strip()
        alts.append(f"tell me about {subject.lower()}")
        alts.append(f"explain {subject.lower()}")
    elif lower_q.startswith("where is"):
        subject = q[8:].replace("?", "").strip()
        alts.append(f"location of {subject.lower()}")
        alts.append(f"where can i find {subject.lower()}")
        alts.append(f"where is {subject.lower()}")
    elif lower_q.startswith("how do you"):
        subject = q[10:].replace("?", "").strip()
        alts.append(f"how to {subject.lower()}")
        alts.append(f"method for {subject.lower()}")
    elif lower_q.startswith("are you"):
        subject = q[7:].replace("?", "").strip()
        alts.append(f"is nitish {subject.lower()}")
    elif lower_q.startswith("do you"):
        subject = q[6:].replace("?", "").strip()
        alts.append(f"does nitish {subject.lower()}")
        
    # 2. Add keyword combinations
    if len(keywords) >= 2:
        alts.append(" ".join(keywords[:3]).lower())
    if len(keywords) >= 1:
        alts.append(f"about {keywords[0].lower()}")
        
    # Deduplicate and clean
    return list(set([a.strip() for a in alts if a.strip()]))

# ==================== 1. PERSONAL & INTRO (IDs 1-20) ====================
personal_questions = [
    ("Hi", ["hi", "hello", "hey", "yo"], "Hello! I'm Nitish's AI assistant. Feel free to ask me anything about my education, DRDO and Vantiris internships, ServiceNow certifications, or my 6 engineering projects!"),
    ("Hello", ["hello", "hi", "hey"], "Hello! I'm Nitish's AI assistant. Feel free to ask me anything about my education, DRDO and Vantiris internships, ServiceNow certifications, or my 6 engineering projects!"),
    ("Hey", ["hey", "hi", "hello"], "Hello! I'm Nitish's AI assistant. Feel free to ask me anything about my education, DRDO and Vantiris internships, ServiceNow certifications, or my 6 engineering projects!"),
    ("How many questions are you trained on?", ["trained", "questions", "count", "number"], "I am trained on exactly {count} specific questions and answers covering my education, work experience, certifications, and project details."),
    ("How many questions do you know?", ["know", "questions", "limit", "database"], "My offline database contains exactly {count} specific questions covering my engineering profile, projects, and skills."),
    ("What is your name?", ["name", "who"], "My name is Nitish Vattikuti."),
    ("Tell me about yourself.", ["about", "profile", "who"], "I'm a BTech Computer Science Engineering student at MVGR College of Engineering, a Technical Intern at DRDO CABS, and a Software Engineering Intern at Vantiris Technologies LLP. I also hold ServiceNow CSA and CAD certifications."),
    ("What do you do?", ["do", "occupation", "role"], "I am a Software Developer and Intern specializing in C++/Qt applications, web architectures, computer vision, and ServiceNow application development."),
    ("Where are you located?", ["location", "live", "city", "where"], "I am based in Visakhapatnam, Andhra Pradesh, India."),
    ("What is your phone number?", ["phone", "mobile", "contact", "call"], "You can call or reach me at +91 8885251896."),
    ("What is your email address?", ["email", "mail", "contact"], "My email is 1896nitishvattikuti@gmail.com."),
    ("Are you currently open to work?", ["work", "hire", "job", "opportunity"], "Yes, I am open to internships, projects, and collaborative software developer opportunities, particularly in web development or ServiceNow application development."),
    ("Where is your home town?", ["hometown", "native", "born"], "My home town is Visakhapatnam, Andhra Pradesh, India."),
    ("What are your primary areas of interest?", ["interest", "domain", "passion"], "My primary domains are computer vision, infrastructure monitoring, responsive web architectures, and cloud solutions on ServiceNow."),
    ("Do you do freelance work?", ["freelance", "contract", "gig"], "Yes, I am available for freelance projects and consulting roles in web development, ServiceNow config, or python-based scripting."),
    ("What is your LinkedIn profile link?", ["linkedin", "social"], "My LinkedIn is linkedin.com/in/nitish-vattikuti-6bba85280."),
    ("What is your GitHub profile link?", ["github", "code"], "My GitHub is github.com/Nitish-vattikuti."),
    ("How can I download your resume?", ["resume", "cv", "download"], "You can download my resume directly using my [Google Drive Link](https://drive.google.com/file/d/1YWxkSYy0Uc1yHMIZVNFOItWxh7xBzqnR/view?usp=sharing)."),
    ("Are you a student or a professional?", ["student", "professional", "status"], "I am currently both: a pre-final year BTech Computer Science student at MVGR College of Engineering, a Technical Intern at DRDO CABS, and a Software Engineering Intern at Vantiris Technologies LLP."),
    ("What is your portfolio URL?", ["portfolio", "website", "url"], "My portfolio is hosted on GitHub at https://nitish-vattikuti.github.io/My-Portfolio/."),
    ("What drives your engineering philosophy?", ["philosophy", "think", "engineering"], "I believe in building practical, high-performance, and decentralized solutions that solve real-world problems while respecting hardware boundaries (like SWaP and data privacy)."),
    ("How do you approach a new software problem?", ["approach", "solve", "method"], "I start by fully understanding user requirements, analyzing hardware or network boundaries, creating modular designs, executing clean code, and performing continuous build and performance testing."),
    ("What are your career goals?", ["goals", "future", "career"], "I aim to establish myself as a senior software engineer specialized in full-stack web platforms, machine learning automation, and ServiceNow enterprise architectures."),
    ("What makes you stand out as a developer?", ["standout", "unique", "skills"], "I combine strong core CS foundations (BTech) with professional ServiceNow developer credentials (CAD/CSA) and hands-on internship experience at DRDO CABS (C++/Qt) and Vantiris (web scaling)."),
    ("How do I contact you?", ["contact", "reach", "message"], "You can reach me via email at 1896nitishvattikuti@gmail.com or by phone at +91 8885251896. You can also view my LinkedIn or GitHub.")
]

for idx, (q, keywords, a) in enumerate(personal_questions, 1):
    qa_list.append({
        "id": idx,
        "category": "personal",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 2. EDUCATION (IDs 21-45) ====================
education_questions = [
    ("Tell me about your education.", ["education", "academic", "studies", "college", "school"], "I am pursuing a Bachelor of Technology (BTech) in Computer Science and Engineering at MVGR College of Engineering, Vizianagaram. I have a current CGPA of 7.59 and expect to graduate in May 2027."),
    ("Where do you study?", ["college", "mvgr", "study"], "I pursue my education at MVGR College of Engineering, located in Vizianagaram, Andhra Pradesh, India."),
    ("What is your degree?", ["degree", "btech", "course"], "I am pursuing a Bachelor of Technology (BTech) in Computer Science and Engineering."),
    ("What is your expected graduation date?", ["graduation", "graduate", "year"], "I am expected to graduate in May 2027."),
    ("What is your current CGPA?", ["cgpa", "grades", "percentage"], "My current cumulative GPA is 7.59."),
    ("What subjects did you study in college?", ["subjects", "coursework", "classes"], "My relevant coursework includes Data Structures & Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Computer Networks, OOP (C++/Java), and AI-ML."),
    ("Have you taken a course on Data Structures?", ["dsa", "data structures", "algorithms"], "Yes, DSA is a core subject in my BTech program. I study stacks, queues, trees, graphs, and search/sort algorithm complexities."),
    ("Did you study Operating Systems?", ["os", "operating systems"], "Yes, I studied OS, covering processes, threads, synchronization, memory management, and file systems."),
    ("Have you studied Database Management?", ["dbms", "database", "sql"], "Yes, my coursework covers DBMS concepts, ER modeling, SQL querying, transaction safety, and indexing."),
    ("Have you studied Computer Networks?", ["networks", "routing", "tcp"], "Yes, I studied Computer Networks, focusing on the TCP/IP stack, routing protocols, sockets, and network security."),
    ("What is your proficiency in Object-Oriented Programming?", ["oop", "c++", "java"], "I am highly proficient in OOP, which I studied through C++ and Java, covering inheritance, polymorphism, encapsulation, and abstraction."),
    ("Did you study Artificial Intelligence and Machine Learning?", ["ai", "ml", "learning"], "Yes, I took coursework in AI-ML, studying supervised/unsupervised algorithms, neural networks, and model evaluations."),
    ("Where is MVGR College located?", ["mvgr", "vizianagaram", "location"], "MVGR College of Engineering is located in Vizianagaram, Andhra Pradesh, India."),
    ("What is the full name of MVGR College?", ["mvgr", "college", "full name"], "MVGR stands for Maharaj Vijayaram Gajapathi Raj College of Engineering."),
    ("Is MVGR an accredited college?", ["accredited", "rating", "mvgr"], "Yes, MVGR College of Engineering is a reputed autonomous institution accredited with an 'A' grade by NAAC."),
    ("What division or department are you in?", ["department", "branch", "cse"], "I am in the Department of Computer Science and Engineering (CSE)."),
    ("Are you learning about cloud computing in college?", ["cloud", "aws", "azure"], "Yes, my CSE coursework covers cloud service models, virtualization, and distributed systems, which I supplement with my ServiceNow CSA/CAD cloud expertise."),
    ("How long is your BTech program?", ["btech", "duration", "years"], "The BTech program is a standard 4-year undergraduate degree."),
    ("What year of study are you in?", ["year", "semester", "current"], "I am currently in my pre-final (3rd) year of my BTech program."),
    ("Do you have any academic backlogs?", ["backlogs", "failed", "exams"], "No, I have a clean academic record with zero active backlogs and a CGPA of 7.59."),
    ("Did you study system design in college?", ["design", "architecture", "system"], "Yes, I studied System Analysis and Design, covering UML diagrams, modular architecture, and software development life cycles (SDLC)."),
    ("What is your college CGPA scale?", ["scale", "gpa", "cgpa"], "My CGPA is on a standard scale of 10.0, where I hold a 7.59."),
    ("What programming languages did you learn in college?", ["languages", "java", "c++"], "I formally learned C, C++, Java, Python, and SQL through my university curriculum."),
    ("Do you participate in extra-curricular activities in college?", ["extracurricular", "activities", "clubs"], "Yes, I participate in technical clubs, hackathons, and development forums within MVGR College."),
    ("What is your college's official website?", ["mvgr", "website"], "MVGR College's official portal is www.mvgrce.edu.in."),
    ("How does college coursework help your development projects?", ["coursework", "theory", "practice"], "Theoretical concepts like DSA help me optimize A* search algorithms in my UAV project, and DBMS theories guide my database designs in MySQL.")
]

for idx, (q, keywords, a) in enumerate(education_questions, 21):
    qa_list.append({
        "id": idx,
        "category": "education",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 3. INTERNSHIP / EXPERIENCE (IDs 46-75) ====================
experience_questions = [
    ("Tell me about your work experience.", ["experience", "work", "job", "internship"], "I have two internship experiences: first, as a Technical Intern at DRDO – Centre for Airborne Systems (CABS) since July 2026, focusing on C++ and Qt-based GUI software development; and second, as a Software Engineering Intern at Vantiris Technologies LLP since February 2026, working on web optimization, scaling, and UI/UX redesigns."),
    ("Where do you work?", ["work", "job", "internship"], "I am currently working as a Technical Intern at DRDO – Centre for Airborne Systems (CABS) in Bengaluru, and as a Software Engineering Intern at Vantiris Technologies LLP."),
    ("What is Vantiris Technologies?", ["vantiris", "company"], "Vantiris Technologies LLP is a software development and consulting company based in India."),
    ("What is your role at Vantiris?", ["role", "job", "intern"], "My role is Software Engineering Intern, focusing on front-end web platforms and project lifecycle documentation."),
    ("When did you start your internship at Vantiris?", ["start", "timeline", "date"], "I started my internship at Vantiris Technologies in February 2026."),
    ("Is your internship remote or on-site?", ["remote", "office", "onsite"], "My internship at Vantiris Technologies is fully remote."),
    ("What are your key responsibilities at Vantiris?", ["responsibilities", "tasks", "duties"], "My key responsibilities include web optimization and scaling on Netlify, UI/UX redesigns from raw HTML, Git/GitHub collaborative workflows, and creating lifecycle architecture documentation."),
    ("What logistics platforms did you work on at Vantiris?", ["logistics", "platforms", "apet"], "I developed and optimized responsive web architectures for logistics platforms like APET Logistics and Marine Commercial Ltd."),
    ("What is APET Logistics?", ["apet", "logistics", "project"], "APET Logistics is one of the international logistics platforms I worked on during my internship, focus areas included performance tuning and responsive layouts."),
    ("What is Marine Commercial Ltd?", ["marine", "commercial", "project"], "Marine Commercial Ltd is a commercial maritime logistics client platform that I optimized and deployed to Netlify during my internship."),
    ("How did you optimize web performance at Vantiris?", ["optimization", "performance", "scaling"], "I minimized asset payloads, restructured DOM trees, applied code optimization guidelines, and configured optimized Netlify environments for faster rendering."),
    ("What does your UI/UX redesign work involve?", ["ui", "ux", "redesign"], "I overhaul legacy, raw HTML client applications into modern responsive layouts that scale smoothly across desktop, tablet, and mobile devices."),
    ("How do you collaborate with other developers at Vantiris?", ["collaborate", "git", "team"], "We coordinate features through strict Git/GitHub branching models, pull request reviews, and weekly technical synchronization meetings."),
    ("What version control tools do you use at work?", ["git", "github", "vcs"], "I use Git and GitHub extensively for codebase version control, code review, and CI/CD triggers."),
    ("Did you write technical documentation at Vantiris?", ["documentation", "lifecycle", "architecture"], "Yes, I documented comprehensive project lifecycles, backend logic, and architectural trade-offs to establish long-term engineering guidelines."),
    ("Is this your first professional developer role?", ["first", "experience", "past"], "No, I started as a Software Engineering Intern at Vantiris Technologies LLP in February 2026, and later joined DRDO – Centre for Airborne Systems (CABS) as a Technical Intern in July 2026."),
    ("What hosting environments did you deploy to during your internship?", ["netlify", "hosting", "deploy"], "I configured and deployed responsive client platforms to optimized Netlify hosting environments."),
    ("What frontend technologies do you use at Vantiris?", ["frontend", "tech", "html"], "I work primarily with HTML, CSS, JavaScript, and responsive layouts to modernize legacy codebases."),
    ("How long is your Vantiris internship?", ["duration", "length", "long"], "My internship is ongoing; I started in February 2026 and continue to contribute to their frontend projects."),
    ("What engineering workflows did you establish?", ["workflows", "methodology", "guidelines"], "I helped establish long-term documentation guidelines and standard Git pull request routines for feature releases."),
    ("How does this internship impact your software development skills?", ["skills", "impact", "learning"], "It has taught me how to work on production codebases, manage legacy transformations, write professional documentation, and work under deadlines."),
    ("Who are the clients for the platforms you built?", ["clients", "companies"], "The primary clients include maritime and transport entities, notably APET Logistics and Marine Commercial Ltd."),
    ("Do you attend weekly sync meetings at Vantiris?", ["sync", "meetings", "weekly"], "Yes, I participate in weekly syncs to coordinate codebase changes, review sprint goals, and solve technical hurdles."),
    ("What is the business model of Vantiris?", ["vantiris", "business", "services"], "Vantiris Technologies is an LLP focused on engineering consulting, custom software creation, and enterprise web solutions."),
    ("Have you worked on backend code at Vantiris?", ["backend", "database", "node"], "My primary work is on frontend architectures, layouts, and system documentation, though I coordinate closely with backend engineers."),
    ("How do you handle legacy code modernization?", ["legacy", "modernize", "html"], "I extract the core functionalities of old HTML sites, design a responsive CSS layout, and re-implement them with clean modular structures."),
    ("What was your biggest success at Vantiris?", ["success", "achievement"], "Successfully modernizing and deploying Marine Commercial Ltd and APET Logistics platforms to Netlify with improved performance metrics."),
    ("Do you write unit tests at Vantiris?", ["tests", "testing", "quality"], "Yes, testing and visual QA are part of my workflow to ensure multi-viewport compatibility before pushing to production."),
    ("How do you manage merge conflicts in Git?", ["merge", "conflict", "git"], "I resolve conflicts by pulling the latest dev branch, rebasing or merging carefully, and running tests locally to verify compilation."),
    ("Is Vantiris located in Visakhapatnam?", ["location", "office", "remote"], "Vantiris is based in India, but I work remote from Visakhapatnam."),
    ("How can I check the work you did at Vantiris?", ["check", "see", "verify"], "The resulting platforms (APET Logistics, Marine Commercial) are deployed on Netlify. You can view my role details and code integration highlights on my resume."),
    ("Tell me about your DRDO CABS internship.", ["drdo", "cabs", "airborne"], "I am a Technical Intern at DRDO – Centre for Airborne Systems (CABS) in Bengaluru since July 2026. I contribute to a C++ and Qt-based software application that processes and structures machine-generated data into a human-readable format. I also work with Go2Monitor for data monitoring and analysis."),
    ("What are your key responsibilities at DRDO?", ["responsibilities", "drdo", "cabs"], "My responsibilities at DRDO CABS include contributing to the development of a C++ and Qt-based application, building GUI components in Qt, implementing core data-processing logic, and using Go2Monitor as part of the analysis workflow."),
    ("What is DRDO – Centre for Airborne Systems?", ["cabs", "drdo", "what is"], "CABS is a premier laboratory of the Defence Research and Development Organisation (DRDO) located in Bengaluru, specializing in Airborne Surveillance Systems, AEW&C, and related engineering systems."),
    ("What technologies do you use at DRDO CABS?", ["technologies", "drdo", "c++", "qt"], "I work primarily with C++ for application logic and Qt for GUI development, and use Go2Monitor for data monitoring, visualization, and analysis."),
    ("What does Go2Monitor do in your DRDO workflow?", ["go2monitor", "workflow", "drdo"], "Go2Monitor is integrated into our workflow for data monitoring, visualization, and analysis, helping process and interpret machine-generated data.")
]

for idx, (q, keywords, a) in enumerate(experience_questions, 46):
    qa_list.append({
        "id": idx,
        "category": "experience",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 4. SERVICENOW CSA & CAD (IDs 76-105) ====================
servicenow_questions = [
    ("Tell me about your ServiceNow skills.", ["servicenow", "skills", "csa", "cad"], "I am certified as both a ServiceNow Certified System Administrator (CSA) and a ServiceNow Certified Application Developer (CAD) in 2026. I write scripts, design scoped apps, and build workflows."),
    ("Are you ServiceNow certified?", ["servicenow", "certified", "csa"], "Yes, I am certified as a ServiceNow Certified System Administrator (CSA) and a ServiceNow Certified Application Developer (CAD)."),
    ("What does ServiceNow CSA stand for?", ["csa", "system administrator"], "ServiceNow CSA stands for Certified System Administrator. It proves proficiency in configuring and managing a ServiceNow instance."),
    ("What does ServiceNow CAD stand for?", ["cad", "developer", "application"], "ServiceNow CAD stands for Certified Application Developer. It validates skills in designing, building, and deploying custom ServiceNow applications."),
    ("When did you get your ServiceNow certifications?", ["year", "date", "certified"], "I obtained both my CSA and CAD certifications in 2026."),
    ("Is there a verification link for your ServiceNow CSA certification?", ["csa link", "csa certificate"], "Yes, you can verify it directly via my [Credly Badge](https://www.credly.com/badges/2fce68b9-e952-4883-a242-48b70cc234a3/public_url)."),
    ("Is there a verification link for your ServiceNow CAD certification?", ["cad link", "cad certificate"], "Yes, you can verify it directly via my [Credly Badge](https://www.credly.com/badges/2cc3c040-1b14-4b83-8cb7-63efd0e5532b/public_url)."),
    ("What skills do you have as a ServiceNow Administrator?", ["admin", "configuration", "skills"], "I can configure lists, forms, UI policies, business rules, client scripts, flow designers, user roles, security access, and notifications."),
    ("What skills do you have as a ServiceNow Developer?", ["developer", "scripting", "api"], "I can design custom tables, write Client Scripts, Business Rules, UI Actions, Script Includes, utilize Flow Designer, configure IntegrationHub, and build custom portal widgets."),
    ("Why did you decide to learn ServiceNow?", ["why", "reason", "interest"], "ServiceNow is a dominant enterprise cloud platform. Having CSA/CAD skills allows me to develop scalable, secure, and automated business workflows on a modern PaaS infrastructure."),
    ("Have you written scripts in ServiceNow?", ["scripting", "javascript", "includes"], "Yes, I write JavaScript client-side (Client Scripts, UI Policies) and server-side (Business Rules, Script Includes, UI Actions) in ServiceNow."),
    ("What is Flow Designer in ServiceNow?", ["flow designer", "automation"], "Flow Designer is a ServiceNow interface that enables process automation by creating sequences of actions (flows) without writing complex scripts."),
    ("What is a ServiceNow Business Rule?", ["business rule", "server script"], "A Business Rule is a server-side JavaScript that runs when a record is displayed, inserted, updated, or deleted."),
    ("What is a ServiceNow Client Script?", ["client script", "client side"], "A Client Script is client-side JavaScript that runs in the browser when a form loads, changes, or submits to handle dynamic UI alterations."),
    ("What is a ServiceNow Script Include?", ["script include", "reusable"], "A Script Include is a reusable server-side JavaScript library that defines classes or functions, often called from Client Scripts via GlideAjax."),
    ("What is GlideRecord in ServiceNow?", ["gliderecord", "database"], "GlideRecord is the ServiceNow database class used for database operations (Create, Read, Update, Delete) instead of direct SQL queries."),
    ("What is GlideSystem in ServiceNow?", ["glidesystem", "gs"], "GlideSystem (referenced as 'gs') is a server-side API providing system information, user properties, logging, and date-time utilities."),
    ("What is GlideAjax in ServiceNow?", ["glideajax", "ajax"], "GlideAjax is a client-side API that enables Client Scripts to query the server asynchronously by calling Script Includes and receiving responses."),
    ("What is a UI Policy in ServiceNow?", ["ui policy", "rules"], "A UI Policy is a client-side configuration that dynamically changes form fields (Read-Only, Mandatory, Visible) based on conditions, without writing code."),
    ("What is a UI Action in ServiceNow?", ["ui action", "button"], "A UI Action is a configuration that creates buttons, links, or context menus on forms or lists, executing client-side or server-side scripts."),
    ("Have you worked on ServiceNow IntegrationHub?", ["integrationhub", "rest", "api"], "Yes, I configure IntegrationHub spokes to connect ServiceNow instances to external third-party systems using REST or SOAP APIs."),
    ("What is an Update Set in ServiceNow?", ["update set", "deployment"], "An Update Set is a group of configuration changes that can be tracked, exported, and imported into another ServiceNow instance for deployment."),
    ("What is ServiceNow ITSM?", ["itsm", "it service"], "ITSM stands for IT Service Management, covering core modules like Incident, Problem, Change, and Request Management which I configure."),
    ("What is ServiceNow ITOM?", ["itom", "operations"], "ITOM is IT Operations Management, covering Discovery, Service Mapping, and Event Management to automate operational environments."),
    ("How do you handle security in ServiceNow?", ["security", "acl", "access"], "I configure Access Control Lists (ACLs), roles, groups, and context-specific rules to enforce strict data governance and user permissions."),
    ("What is the difference between a UI Policy and a Client Script?", ["difference", "policy", "client script"], "UI Policies are declarative rules for field visibility/mandatoriness, whereas Client Scripts allow full JavaScript coding for complex client-side validations."),
    ("What is a ServiceNow Record Producer?", ["record producer", "portal"], "A Record Producer is a user-friendly catalog item that allows users to create records (like incidents or facilities requests) directly from the Service Portal."),
    ("Have you built custom applications on ServiceNow?", ["custom app", "scoped"], "Yes, utilizing my CAD training, I build custom scoped applications with unique tables, scripts, and security controls isolated from global configurations."),
    ("What ServiceNow releases are you familiar with?", ["release", "washington", "xanadu"], "I am trained and certified on modern releases, including Washington DC and Xanadu, understanding their latest feature sets."),
    ("How does ServiceNow fit into your general software development?", ["fit", "paas", "enterprise"], "ServiceNow gives me enterprise-grade PaaS experience, complementing my custom full-stack development skills (Python/JS/Docker) with cloud business logic workflow tools."),
    ("Where is your ServiceNow icon sourced from?", ["icon", "servicenow.png"], "My portfolio uses a custom ServiceNow PNG icon ('servicenow.png') stored locally in 'src/assets/' and configured to render without dark-mode color inverting.")
]

for idx, (q, keywords, a) in enumerate(servicenow_questions, 76):
    qa_list.append({
        "id": idx,
        "category": "servicenow",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 5. PROJECT: UAV SIMULATION (IDs 106-140) ====================
uav_questions = [
    ("What is the UAV simulation project?", ["uav", "simulation", "drone"], "The Autonomous UAV SIL Simulation is an avionics guidance and 3D path planning Software-in-the-Loop (SIL) simulation that tests flight guidance under strict hardware constraints."),
    ("What does SIL stand for in the UAV project?", ["sil", "software in the loop"], "SIL stands for Software-in-the-Loop. It means testing the flight guidance software within an emulated environment on a computer before deployment on hardware."),
    ("What programming language was used for the UAV simulation?", ["python", "language", "uav"], "The core simulation and path planning logic were built using Python."),
    ("What path planning algorithms did you use in the UAV project?", ["algorithms", "a*", "rrt*"], "I optimized the 3D trajectory path planning using Weighted A* and Rapidly-exploring Random Trees Star (RRT*)."),
    ("Why did you use Weighted A* in the UAV project?", ["weighted a*", "a star"], "Weighted A* introduces a heuristic weight to accelerate path-finding searches, making it faster than standard A* while maintaining near-optimal routes suitable for real-time guidance."),
    ("Why did you use RRT* in the UAV project?", ["rrt*", "random trees"], "RRT* is an incremental sampling-based algorithm that asymptotically converges to an optimal path, enabling the UAV to navigate through complex, high-dimensional obstacle layouts."),
    ("What is the planning latency of your UAV guidance system?", ["latency", "speed", "ms"], "The trajectory path planning latency was optimized to compile in under 80 milliseconds (<= 80ms)."),
    ("How does the telemetry stream work in the UAV project?", ["telemetry", "sockets", "stream"], "Real-time telemetry (position, yaw, pitch, roll) is streamed between processes using a dual-process TCP/IP socket connection."),
    ("Why did you use TCP/IP sockets for the UAV project?", ["tcp", "sockets", "networking"], "Sockets provide low-overhead, bi-directional, and real-time process communication, simulating communication between a flight controller and a ground station."),
    ("What is the role of psutil in the UAV simulation?", ["psutil", "cpu", "performance"], "I used psutil to monitor and log CPU utilization, memory footprints, and execution statistics during trajectory calculations."),
    ("What does SWaP stand for in avionics?", ["swap", "hardware"], "SWaP stands for Size, Weight, and Power. These are the physical and electrical constraints that avionics systems must satisfy on a real UAV."),
    ("How did you simulate CPU stress in the UAV project?", ["stress", "cpu load", "synthetic"], "I generated synthetic CPU workloads to analyze planning algorithm stability and execution times under depleted hardware resources."),
    ("What does SAA stand for in your UAV project?", ["saa", "sense and avoid"], "SAA stands for Sense-and-Avoid, which is the system's ability to detect dynamic obstacles in the flight path and replan the trajectory to prevent collisions."),
    ("How is the 3D trajectory visualized in the UAV project?", ["visualizer", "3d", "gcs"], "It streams coordinates via sockets to a Web Ground Control Station (GCS) containing a 3D canvas path visualizer."),
    ("Did you use Docker for the UAV project?", ["docker", "container"], "Yes, I containerized the Python simulation processes in Docker to ensure environment reproducibility and clean dependency packaging."),
    ("What is the significance of dual-process decoupling in the UAV project?", ["decoupling", "processes"], "By decoupling the trajectory planning process from the visualization/logging process, a visual lag does not block or crash the safety-critical guidance calculations."),
    ("Is there a GitHub link for the UAV simulation?", ["github", "repository", "source"], "Yes, the source code is on GitHub at https://github.com/Nitish-vattikuti/autonomous-uav-guidance."),
    ("Where is the live demo for the UAV guidance project?", ["live", "render", "demo"], "You can access the live demo running on Render at https://autonomous-uav-guidance.onrender.com/."),
    ("What triggers dynamic replanning in the UAV project?", ["replanning", "obstacles"], "When the simulated sensors detect an obstacle intersecting the active trajectory, the Weighted A* planner is re-triggered to compute an alternate route."),
    ("What mathematical libraries did you use in the UAV project?", ["numpy", "scipy", "math"], "I used NumPy for fast vector matrices calculations, coordinate rotations, and Euclidean distance evaluations."),
    ("What was the main problem you solved with the UAV simulation?", ["problem", "solved", "purpose"], "Direct testing on flight hardware is risky and slow. This simulation provides a safe, reproducible environment to stress-test guidance software before loading it onto edge flight computers."),
    ("How did you optimize the trajectory generation time?", ["optimization", "speedup"], "I optimized mathematical loops in Python using NumPy operations and adjusted the heuristic weights of the A* algorithm to prune search paths early."),
    ("What is a GCS in the context of your UAV project?", ["gcs", "ground control"], "GCS stands for Ground Control Station, which serves as the monitoring hub displaying telemetry, altitude, speed, and 3D flight paths."),
    ("Can the UAV simulation run offline?", ["offline", "local"], "Yes, the Docker containers and Python scripts run fully locally on a laptop without requiring an active internet connection."),
    ("What coordinates system is used in the UAV simulation?", ["coordinates", "3d", "xyz"], "The system maps coordinates onto a 3D Cartesian grid (X, Y, Z representing East, North, and Altitude)."),
    ("How does the UAV simulation project handle wind or perturbations?", ["wind", "perturbations", "noise"], "We inject synthetic noise vectors into the socket telemetry stream to evaluate how the guidance loops correct for flight path drift."),
    ("What are the key folders in the UAV project GitHub?", ["folders", "github"], "The GitHub repository contains the core trajectory engine, visualization web templates, Docker configuration, and profiling scripts."),
    ("Is the UAV project suitable for multi-rotor drones?", ["multirotor", "drones"], "Yes, the path planning algorithms are configured for 3D navigation, making them applicable to both quadcopters and fixed-wing UAVs."),
    ("How is psutil installed in the UAV project?", ["install", "psutil"], "It is installed via standard Python package management (pip install psutil) and is bundled inside the project's Dockerfile."),
    ("Does the UAV simulation use ROS?", ["ros", "robotic"], "No, it utilizes custom TCP/IP socket connections to keep the system lightweight and avoid the overhead of a full ROS setup."),
    ("What is the average CPU load of the UAV planner?", ["cpu load", "profile"], "Under normal planning conditions, the CPU footprint remains under 12% on a standard emulated core, spikes occur during dynamic obstacle replanning."),
    ("How do you compile the UAV guidance code?", ["compile", "run"], "You can run the python scripts directly or launch the containers using 'docker-compose up'."),
    ("Did you write a report on the UAV simulation project?", ["report", "paper"], "Yes, I wrote detailed technical documentation covering the algorithm comparisons (A* vs RRT*) and SWaP boundary test logs."),
    ("What is the difference between A* and RRT* in your findings?", ["difference", "comparison"], "A* is highly efficient for grid-based pathfinding, while RRT* is superior in high-dimensional continuous spaces, though it takes longer to converge."),
    ("Who supervised your UAV simulation project?", ["supervisor", "college"], "It was built as an academic portfolio project demonstrating computer science principles applied to avionics engineering.")
]

for idx, (q, keywords, a) in enumerate(uav_questions, 106):
    qa_list.append({
        "id": idx,
        "category": "uavsimulation",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 6. PROJECT: SPECTRAFUSE (IDs 141-175) ====================
spectrafuse_questions = [
    ("What is SpectraFuse?", ["spectrafuse", "image fusion", "project"], "SpectraFuse is a high-performance multi-spectral image fusion and target tracking platform that merges Visible, NIR, and TIR aerial imagery in-browser."),
    ("What imagery bands or channels does SpectraFuse merge?", ["bands", "channels", "images"], "SpectraFuse fuses three channels: Visible (color details), Near-Infrared (NIR, vegetation/haze penetration), and Thermal Infrared (TIR, heat signatures)."),
    ("Why did you build SpectraFuse?", ["why", "purpose", "problem"], "I built it to emulate DRDO CABS aerial surveillance specs. Fusing multi-spectral feeds allows operators to detect hidden targets (heat signatures) under poor visibility (fog/night) in a single unified video feed."),
    ("What does DWT stand for in SpectraFuse?", ["dwt", "wavelet"], "DWT stands for Discrete Wavelet Transform. It decomposes images into high and low-frequency components for pixel-level feature fusion."),
    ("What does PCA stand for in SpectraFuse?", ["pca", "components"], "PCA stands for Principal Component Analysis. It reduces dimensionality and extracts the most significant structural variance for image fusion."),
    ("What does IHS stand for in SpectraFuse?", ["ihs", "saturation"], "IHS stands for Intensity-Hue-Saturation. It converts RGB colors to intensity, hue, and saturation, allowing fusion of thermal details into the intensity channel while preserving colors."),
    ("How does SpectraFuse perform object detection?", ["detection", "object", "coco-ssd"], "SpectraFuse runs in-browser object detection using TensorFlow.js with the pre-trained COCO-SSD model."),
    ("What is the COCO-SSD model in SpectraFuse?", ["coco-ssd", "tensorflow"], "COCO-SSD is a Single Shot MultiBox Detector model trained on the COCO dataset, optimized to detect and locate 80 classes of everyday objects in real-time."),
    ("How does SpectraFuse ensure data isolation?", ["isolation", "privacy", "secure"], "By running 100% locally in the user's browser via TensorFlow.js and HTML5 Canvas API. No image data is sent to external servers, which is crucial for classified defense data."),
    ("What image quality metrics are implemented in SpectraFuse?", ["metrics", "quality", "psnr"], "It calculates Peak Signal-to-Noise Ratio (PSNR) and Structural Similarity Index (SSIM) in real-time to measure the mathematical quality of the fused composite image."),
    ("What is PSNR in SpectraFuse?", ["psnr", "noise"], "PSNR measures the ratio between the maximum possible power of a signal and the power of corrupting noise, evaluating how much detail was lost during image fusion."),
    ("What is SSIM in SpectraFuse?", ["ssim", "similarity"], "SSIM is a perceptual metric that quantifies the structural similarity between two images, assessing how closely the fused output resembles the input sources."),
    ("What is the tech stack of SpectraFuse?", ["stack", "technologies", "libraries"], "The tech stack includes TensorFlow.js, COCO-SSD, HTML5 Canvas API, Zustand, TailwindCSS, and JavaScript transform math (PCA, DWT, IHS)."),
    ("Where is SpectraFuse deployed?", ["deployment", "hosted", "netlify"], "SpectraFuse is deployed on Netlify."),
    ("What is the Netlify link for SpectraFuse?", ["netlify link", "live link"], "You can access the live SpectraFuse platform at https://spectrafuse.netlify.app/."),
    ("Is there a GitHub link for SpectraFuse?", ["github", "repository"], "Yes, the repository is on GitHub at https://github.com/Nitish-vattikuti/Spectrafuse."),
    ("How do you handle real-time frame alignment in SpectraFuse?", ["alignment", "frames", "registration"], "I implement canvas coordinate mapping and pixel transformations to align the shapes and scales of Visible, NIR, and TIR frames before executing math fusion."),
    ("What are the advantages of local browser processing in SpectraFuse?", ["browser", "advantages", "client"], "It provides absolute data security (100% data isolation), zero server hosting costs, and runs client-side GPU acceleration using WebGL through TensorFlow.js."),
    ("What is DRDO CABS?", ["drdo", "cabs", "defense"], "DRDO CABS is the Center for Airborne Systems under India's Defence Research and Development Organisation, which researches airborne surveillance technologies that inspired this project."),
    ("How is color preserved during thermal fusion in SpectraFuse?", ["color", "thermal", "fusion"], "By using the IHS transform, I extract the color channels (Hue and Saturation) from the visible feed and replace the Intensity channel with the fused thermal features before converting back to RGB."),
    ("What is the average processing frame rate of SpectraFuse?", ["fps", "frame rate", "speed"], "On standard modern browsers with GPU support, it maintains smooth frame rates (15-30 FPS) for image transforms and object detection."),
    ("Can SpectraFuse run on mobile devices?", ["mobile", "phone", "responsive"], "Yes, it is responsive and can run on mobile web browsers, leveraging mobile WebGL accelerators for TensorFlow.js."),
    ("What classes of objects can SpectraFuse detect?", ["detect", "classes", "objects"], "It detects humans, vehicles, bags, tools, and 80 other common classes defined in the COCO dataset."),
    ("How is state managed in SpectraFuse?", ["zustand", "state"], "I use Zustand for lightweight, high-performance state management to track video feed statuses, active transforms, and bounding boxes."),
    ("How do you import TensorFlow.js in SpectraFuse?", ["import", "tensorflow"], "It is loaded via npm dependencies and compiled by Vite into the client bundle."),
    ("Can SpectraFuse fuse video files?", ["video", "files"], "Yes, it supports fusing real-time webcams, simulated camera inputs, or pre-uploaded multi-spectral video files."),
    ("What is the mathematical complexity of DWT in SpectraFuse?", ["dwt math", "wavelet transform"], "The discrete wavelet transform decomposes the pixel grid using Haar wavelets, requiring O(N) operations per frame, optimized via typed arrays in JavaScript."),
    ("Did you write custom shaders for SpectraFuse?", ["shaders", "webgl"], "The transform math runs on CPU using optimized JS loops, while TensorFlow.js model detection runs on WebGL shaders automatically."),
    ("How do you calculate SSIM in JavaScript?", ["ssim math", "calculation"], "I compute local means, variances, and covariances of the pixel intensities in the canvas context buffer to evaluate structural similarity."),
    ("What is the role of HTML5 Canvas in SpectraFuse?", ["canvas", "html5"], "HTML5 Canvas acts as the high-speed render buffer, allowing frame manipulation, pixel-level array processing, and dynamic drawing of detection bounding boxes."),
    ("How is the user interface designed in SpectraFuse?", ["ui", "interface", "design"], "It is built with a dark cinematic theme, featuring video preview screens, real-time metrics graphs (PSNR/SSIM), and configuration panels for transform weights."),
    ("Can I use my own image datasets in SpectraFuse?", ["dataset", "upload"], "Yes, you can upload your own multi-spectral image sets through the interface to test the PCA and DWT transforms."),
    ("Does SpectraFuse require a backend database?", ["database", "backend"], "No, SpectraFuse is a serverless, static SPA that runs entirely on the client, eliminating database security risks."),
    ("What is the size of the SpectraFuse bundle?", ["size", "bundle", "kb"], "The compiled production bundle is optimized under 140 KB (excluding the external model weights loaded dynamically)."),
    ("How did you test SpectraFuse?", ["test", "verification"], "I verified the transforms using standardized aerial imaging datasets (Visible/NIR/TIR) and checked that PSNR/SSIM scores aligned with expected mathematical fusion values.")
]

for idx, (q, keywords, a) in enumerate(spectrafuse_questions, 141):
    qa_list.append({
        "id": idx,
        "category": "spectrafuse",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 7. OTHER PROJECTS (IDs 176-200) ====================
other_projects_questions = [
    ("Tell me about your software projects.", ["projects", "software", "build", "portfolio"], "I have built 6 core engineering projects, led by my dual flagships: the Autonomous UAV SIL Simulation (3D path planning with Weighted A* and RRT*) and SpectraFuse (multi-spectral image fusion and object detection in-browser). My other projects include AI Virtual Mouse, InfraSight, Smart Healthcare, and Number Plate Detection."),
    ("What is the AI Virtual Mouse project?", ["virtual mouse", "gesture", "mouse"], "The AI Virtual Mouse is a computer vision application that enables contactless hand gesture controls using standard webcams."),
    ("What technologies did you use for the Virtual Mouse?", ["mouse tech", "opencv", "mediapipe"], "It is built with Python, OpenCV, MediaPipe, NumPy, and PyAutoGUI."),
    ("How does the Virtual Mouse track hands?", ["mediapipe", "hand tracking"], "It uses MediaPipe's hand landmark detection model to extract 21 3D hand coordinates in real-time."),
    ("How do you trigger a click in the Virtual Mouse?", ["click", "gestures"], "Clicks are triggered by measuring the distance between specific finger landmarks (e.g. index and middle finger tips pinching or closing together)."),
    ("What is PyAutoGUI used for in the Virtual Mouse?", ["pyautogui", "cursor"], "PyAutoGUI is a Python library used to programmatically move the desktop cursor and trigger left/right click events based on gesture coordinates."),
    ("What is the InfraSight project?", ["infrasight", "monitoring", "anomaly"], "InfraSight is an AI-powered IT infrastructure monitoring and anomaly prediction platform designed to forecast server telemetry failures."),
    ("What technologies did you use for InfraSight?", ["infrasight tech", "fastapi", "scikit-learn"], "It is built with Python, Scikit-Learn (ML models), FastAPI, InfluxDB (time-series data), Pandas, and NumPy."),
    ("How does InfraSight predict failures?", ["predict", "failures", "models"], "It processes real-time server telemetry metrics (CPU, memory, disk I/O) using machine learning anomaly detection models (like Autoencoders or Isolation Forests) to flag patterns preceding failures."),
    ("Why did you use InfluxDB in InfraSight?", ["influxdb", "database"], "InfluxDB is a time-series database optimized for high-write workloads of server telemetry metrics gathered over chronological intervals."),
    ("What is the Smart Healthcare Portal project?", ["healthcare portal", "medical", "doctor"], "The Smart Healthcare Portal is a browser-based medical assistant guiding patients from symptom logging to home remedies and doctor locating."),
    ("What technologies did you use for the Healthcare Portal?", ["healthcare tech", "leaflet", "bootstrap"], "It is built using HTML5, CSS3, JavaScript (ES6), Bootstrap, and Leaflet.js maps."),
    ("What is Leaflet.js used for in the Healthcare Portal?", ["leaflet", "map", "location"], "Leaflet.js is a lightweight open-source JavaScript library used to render interactive maps displaying doctor clinic geolocations relative to the patient."),
    ("What is the Number Plate Detection project?", ["number plate", "license", "cctv"], "It is a deep learning computer vision pipeline that automatically detects vehicle license plates in video streams and extracts the alphanumeric text."),
    ("What technologies did you use for Number Plate Detection?", ["plate tech", "tensorflow", "keras"], "It is built with Python, TensorFlow, Keras (CNN models), OpenCV (image parsing), SQLite, and NumPy."),
    ("How does the Number Plate Detection extract text?", ["ocr", "text extraction", "cnn"], "It uses a Convolutional Neural Network (CNN) classifier to segment character blocks and perform Optical Character Recognition (OCR) on the license plate area."),
    ("Where are vehicle logs stored in the Number Plate Detection project?", ["sqlite", "logs"], "Vehicle license numbers, timestamps, and confidence scores are stored in a local SQLite database."),
    ("How many projects are featured on your portfolio?", ["total projects", "number projects", "list"], "My portfolio features 6 projects: Autonomous UAV SIL Simulation, SpectraFuse, AI Virtual Mouse, InfraSight, Smart Healthcare Portal, and Number Plate Detection."),
    ("Which of your projects use Computer Vision?", ["computer vision", "cv projects"], "Four of my projects utilize Computer Vision: SpectraFuse (aerial feeds), AI Virtual Mouse (hand gestures), Number Plate Detection (CCTV feeds), and the UAV SIL simulation (visual trajectories)."),
    ("Which of your projects use Machine Learning?", ["ml projects", "machine learning"], "My ML/DL projects include SpectraFuse (COCO-SSD), InfraSight (anomaly prediction), and Number Plate Detection (CNN classifier)."),
    ("Are your projects open source?", ["open source", "repositories"], "Yes, my project codebases are hosted as open-source repositories on my GitHub profile (github.com/Nitish-vattikuti)."),
    ("How do I run the AI Virtual Mouse locally?", ["run mouse", "setup"], "Clone my repository, install OpenCV and MediaPipe via pip, and run the main python script to access your webcam."),
    ("Is the Smart Healthcare Portal deployed?", ["healthcare deploy", "netlify"], "Yes, the Smart Healthcare Portal is hosted on Netlify at https://smarthealthcare-1896.netlify.app/."),
    ("What is the database of the Number Plate Detection project?", ["sqlite", "database"], "It uses a local SQLite database which stores logs of license numbers, detection times, and camera IDs."),
    ("How does InfraSight communicate telemetry?", ["fastapi", "api"], "FastAPI endpoints ingest telemetry streams from monitoring agents and feed them into the pandas/numpy analytical pipeline."),
    ("Which is your most complex project?", ["complex", "flagship"], "The Autonomous UAV SIL Simulation and SpectraFuse are my dual flagship projects due to their advanced algorithms, math transforms, and real-time processing constraints.")
]

for idx, (q, keywords, a) in enumerate(other_projects_questions, 176):
    qa_list.append({
        "id": idx,
        "category": "otherprojects",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 8. SKILLS & TOOLS (IDs 201-220) ====================
skills_questions = [
    ("What programming languages do you know?", ["languages", "programming", "code"], "My programming languages include Python, SQL, Java, and C/C++ (OOP)."),
    ("Are you proficient in Python?", ["python", "scripts"], "Yes, Python is my primary programming language. I use it for computer vision (OpenCV), machine learning (TensorFlow/Keras), path planning (A*/RRT*), and scripting."),
    ("What is your experience with Java?", ["java", "oop"], "I studied Java through my university coursework and use it to implement OOP design patterns and backend database integrations."),
    ("What is your experience with C/C++?", ["c++", "c", "oop"], "I am proficient in C/C++ and use them to write high-performance algorithmic structures, understanding memory management and OOP layouts."),
    ("What is your experience with SQL and databases?", ["sql", "mysql", "databases"], "I write relational queries, design schemas, and utilize databases like MySQL, SQLite, and InfluxDB (time-series)."),
    ("What web technologies do you use?", ["web", "frontend", "html"], "I use HTML5, CSS3, JavaScript (ES6), React, TailwindCSS, and Zustand."),
    ("Do you know how to use Docker?", ["docker", "containers"], "Yes, I use Docker to containerize applications, configure microservices, and ensure cross-platform environment consistency."),
    ("Do you know Linux?", ["linux", "unix", "terminal"], "Yes, I am comfortable working in Linux environments, utilizing the terminal, writing bash scripts, and managing files."),
    ("What version control systems do you use?", ["git", "github", "version control"], "I use Git and GitHub for tracking changes, code reviews, and managing repository releases."),
    ("What is your experience with OpenCV?", ["opencv", "computer vision"], "I use OpenCV for image processing, color masking, filtering, webcam capture, and key-point operations in my computer vision projects (Virtual Mouse, Number Plate Detection)."),
    ("What is your experience with NumPy?", ["numpy", "arrays"], "I use NumPy extensively for multi-dimensional array calculations, vector mathematics, and computational optimizations in Python."),
    ("What is your experience with TensorFlow?", ["tensorflow", "keras", "deep learning"], "I use TensorFlow and Keras for deep learning models (CNN license plate character extraction) and TensorFlow.js for in-browser client-side object detection (SpectraFuse)."),
    ("What is Zustand?", ["zustand", "state management"], "Zustand is a lightweight, fast, and hook-based state management library for React, which I use to manage UI states without standard redux overhead."),
    ("Do you know how to use Figma?", ["figma", "ui/ux", "design"], "Yes, I use Figma to design user interface mockups, wireframes, and responsive layouts before writing code."),
    ("What is PowerBI used for?", ["powerbi", "bi", "analytics"], "I use PowerBI for data visualization, creating business intelligence dashboards, and analyzing performance metrics."),
    ("Do you know Microsoft Office 365?", ["office", "excel", "word"], "Yes, I am proficient in MS Office 365, including Excel (formulas, charts), Word (documentation), and PowerPoint."),
    ("What is your database of choice for time-series data?", ["influxdb", "timeseries"], "I use InfluxDB due to its optimization for logging high-frequency telemetry metrics in real-time."),
    ("What CSS framework do you prefer?", ["tailwind", "css", "bootstrap"], "I am comfortable with both TailwindCSS (utility-first, clean design systems) and Bootstrap (rapid modular structuring)."),
    ("What is your experience with responsive web design?", ["responsive", "media queries", "viewport"], "I specialize in building multi-viewport responsive grids that adjust cleanly across desktop, tablet, and mobile displays, which I apply at my Vantiris internship."),
    ("How do you manage dependencies in Python?", ["pip", "requirements.txt", "dependencies"], "I use pip and maintain structured requirements.txt files or virtual environments to isolate packages.")
]

for idx, (q, keywords, a) in enumerate(skills_questions, 201):
    qa_list.append({
        "id": idx,
        "category": "skills",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

portfolio_questions = [
    ("How was this portfolio website built?", ["built", "portfolio", "technologies"], "This portfolio is built using React + Vite + TypeScript, styled with TailwindCSS and custom CSS, and uses React Three Fiber (Three.js) for the interactive 3D rotating drone."),
    ("What is the purpose of the 3D rotating drone?", ["drone", "wireframe", "3d", "gimbal", "propeller"], "The rotating 3D drone represents my core interest and technical work in Autonomous UAV SIL Simulation. It displays my active skills structurally mapped on a wireframe quadcopter (landing skids, motors, camera gimbal, and fuselage) with spinning propellers and dynamic particle thrust."),
    ("What font styles are used in this portfolio?", ["font", "typography", "playfair"], "The portfolio uses Playfair Display (a display serif font) for major section headings and rotating hero names, and Inter (sans-serif) for body copies and descriptive content."),
    ("Where is this portfolio hosted?", ["hosting", "github pages", "vercel"], "The portfolio is structured for Vercel Serverless deployments and GitHub Pages static hosting."),
    ("How is the chatbot implemented in the portfolio?", ["chatbot", "chat", "ai"], "The chatbot uses a hybrid design: an online RAG pipeline (Vercel Serverless / Supabase Edge Functions with Groq Llama models) and a fully offline client-side fuzzy matcher running locally in the browser."),
    ("Why did you choose React + Vite for the portfolio?", ["vite", "react"], "React allows modular component structuring (like separate sections for experience, projects, and chat), and Vite provides fast Hot Module Replacement (HMR) and optimized build bundling."),
    ("Is the portfolio optimized for mobile viewports?", ["mobile", "responsive", "viewport"], "Yes, all grid structures, timelines, navigation bars, and the 3D canvas are optimized for fluid scaling on smaller mobile screens."),
    ("What makes this portfolio design unique?", ["unique", "design", "aesthetics"], "It features a premium dark theme, glassmorphic card boundaries, interactive 3D elements, custom typography alignment, and a rate-limited secure AI chat assistant."),
    ("How does the chatbot work offline?", ["offline", "fallback"], "If the server is unreachable or API keys are missing, the client-side fallback uses a Jaccard token-matching search to query my 200+ Q&A dataset locally and return the exact answer."),
    ("Who designed the icons on this portfolio?", ["icons", "lucide"], "Most icons are rendered using Lucide-React, supplemented by a custom ServiceNow logo asset."),
    ("Can I clone your portfolio repository?", ["clone", "code"], "Yes, you can clone my portfolio repository under the MIT license from github.com/Nitish-vattikuti/PORTFOLIO."),
    ("Does the portfolio support dark mode?", ["dark", "theme"], "Yes, it is styled with a default dark cinematic theme, featuring charcoal backgrounds, primary green highlights, and soft mesh glow effects."),
    ("How long does it take to load this portfolio?", ["speed", "loading", "optimized"], "The site is optimized with compressed images and code-split chunks, loading in under 1 second on standard networks."),
    ("How do I update the projects list on this portfolio?", ["update", "projects.ts"], "You can update the projects list by editing 'src/data/projects.ts' to add or modify project cards in the array."),
    ("What is the sitemap of your portfolio?", ["sitemap", "robots.txt"], "The site includes a public sitemap.xml and robots.txt file in the '/public' folder to guide search engines for proper SEO indexes.")
]

for idx, (q, keywords, a) in enumerate(portfolio_questions, 221):
    qa_list.append({
        "id": idx,
        "category": "portfolio",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# ==================== 10. CERTIFICATIONS (IDs 236-260) ====================
certifications_questions = [
    ("What certifications do you hold?", ["certifications", "credentials", "list"], "I hold 8 professional certifications: ServiceNow CSA and CAD, Wiser Technology Quantum Fundamentals, Microsoft Career Essentials in Generative AI, LinkedIn HTML/CSS & Generative AI, HackerRank Frontend Developer (React) and Software Engineer, and edX Further Mathematics from Imperial College London."),
    ("Tell me about your ServiceNow CSA certification.", ["csa", "system administrator", "verification"], "I am a ServiceNow Certified System Administrator (CSA), credential ID 2fce68b9-e952-4883-a242-48b70cc234a3. Verified link: [Credly Badge](https://www.credly.com/badges/2fce68b9-e952-4883-a242-48b70cc234a3/public_url)."),
    ("Tell me about your ServiceNow CAD certification.", ["cad", "developer", "verification"], "I am a ServiceNow Certified Application Developer (CAD), credential ID 2cc3c040-1b14-4b83-8cb7-63efd0e5532b. Verified link: [Credly Badge](https://www.credly.com/badges/2cc3c040-1b14-4b83-8cb7-63efd0e5532b/public_url)."),
    ("Do you have any mathematics certifications?", ["math", "mathematics", "edx"], "Yes, I hold an edX Verified Certificate for A-level Further Mathematics for Year 13 from Imperial College London (Credential ID ccd9b21dbcb64ca580d41abb7ed5e485). Verification: [edX Certificate](https://courses.edx.org/certificates/ccd9b21dbcb64ca580d41abb7ed5e485)."),
    ("What quantum computing certifications do you have?", ["quantum", "wiser"], "I hold the Quantum Fundamentals certification from Wiser Technology (Credential ID B6FE12DD)."),
    ("Do you have any HackerRank certifications?", ["hackerrank", "skills"], "Yes, I hold HackerRank certifications for Frontend Developer (React) (ID: f17a39c89954) and Software Engineer (ID: e889d0ab5422). Verification links: [React Developer Certificate](https://www.hackerrank.com/certificates/f17a39c89954) and [Software Engineer Certificate](https://www.hackerrank.com/certificates/e889d0ab5422)."),
    ("Do you have any AI certifications?", ["generative ai", "microsoft", "linkedin"], "Yes, I hold the Microsoft Career Essentials in Generative AI (ID: 48b5ea58357af437537df50baafb1d36b843c2d2621223bb8a14cc812bd8e039) and the LinkedIn HTML, CSS, and Generative AI certificate (ID: 47595de874c194ed924727e1132c6b47a79ee957631dcd92724ca8c55139aba8).")
]

for idx, (q, keywords, a) in enumerate(certifications_questions, 236):
    qa_list.append({
        "id": idx,
        "category": "certifications",
        "question": q,
        "keywords": keywords,
        "alternatives": generate_alternatives(q, keywords),
        "answer": a
    })

# Replace placeholders with dynamic count
total_count = len(qa_list)
for item in qa_list:
    item["answer"] = item["answer"].replace("{count}", str(total_count))

# Write the final JSON file
target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "qa_dataset.json"))
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(qa_list, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(qa_list)} QA pairs at: {target_path}")

# Also copy to vercel serverless function and supabase edge function directories
import shutil
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
paths_to_copy = [
    os.path.join(base_dir, "api", "_data", "qa_dataset.json"),
    os.path.join(base_dir, "supabase", "functions", "chat", "qa_dataset.json")
]
for p in paths_to_copy:
    try:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        shutil.copy(target_path, p)
        print(f"Copied QA dataset to: {p}")
    except Exception as e:
        print(f"Error copying to {p}: {e}")


