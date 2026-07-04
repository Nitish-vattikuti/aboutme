// api/_data/portfolio.js

export const portfolioKnowledge = {
    uavsimulation: `
PROJECT: Autonomous UAV SIL Simulation

TYPE:
Avionics guidance and 3D path planning Software-in-the-Loop (SIL) simulation.

SUMMARY:
A dual-process simulation platform running dynamic Sense-and-Avoid (SAA) UAV guidance using Weighted A* and RRT* algorithms to compute trajectories. Telemetry is streamed over sockets.

PROBLEM:
Testing UAV guidance directly on edge flight computers is hardware-risky and slow. The system emulates CPU loads and evaluates flight path calculations under strict Size, Weight, and Power (SWaP) constraints.

SYSTEM DESIGN:
- 3D flight path visualizer
- Weighted A* and RRT* trajectory planners
- Dual-process TCP/IP socket link
- Synthetic CPU stress testing (psutil)

TECH STACK:
Python, Socket Programming, Docker, Weighted A*, RRT*, psutil.

ENGINEERING FOCUS:
- trajectory planning latency (< 80ms)
- dual-process decoupling
- network desync mitigation
- SWaP hardware boundary compliance
`,

    spectrafuse: `
PROJECT: SpectraFuse

TYPE:
Multi-spectral image fusion and target tracking surveillance platform.

SUMMARY:
SpectraFuse fuses Visible, Near-Infrared (NIR), and Thermal Infrared (TIR) aerial surveillance camera feeds into a single high-fidelity composite feed. Local object detection (COCO-SSD) runs in-browser.

PROBLEM:
Sensitive military and surveillance assets need local processing (100% data isolation) with zero server overhead, while still achieving high-accuracy detection and fusion metrics (PSNR, SSIM).

SYSTEM DESIGN:
- multi-spectral image channel alignment
- pixel-level mathematical transforms (DWT, PCA, IHS)
- client-side TensorFlow.js (COCO-SSD) model
- real-time performance quality diagnostics (PSNR/SSIM)

TECH STACK:
TensorFlow.js, COCO-SSD, HTML5 Canvas API, Zustand, PCA, DWT, IHS, PSNR/SSIM.

ENGINEERING FOCUS:
- data isolation (100% local browser)
- real-time frame alignment
- pixel-level transform math
- client-side GPU model execution
`,

    virtualmouse: `
PROJECT: AI Virtual Mouse

TYPE:
Contactless hand gesture control system.

SUMMARY:
AI Virtual Mouse is a computer vision application that allows users to control their computer mouse cursor and trigger clicks using hand gestures in front of a standard webcam.

TECH STACK:
Python, OpenCV, MediaPipe, PyAutoGUI, NumPy.
`,

    infrasight: `
PROJECT: InfraSight

TYPE:
IT infrastructure monitoring and anomaly prediction platform.

SUMMARY:
InfraSight is an AI-powered system designed to predict IT failures by monitoring server telemetry and using machine learning models to detect anomalies.

TECH STACK:
Python, Scikit-Learn, FastAPI, InfluxDB, Pandas, NumPy.
`,

    healthcareportal: `
PROJECT: Smart Healthcare Portal

TYPE:
Web-based patient guidance and doctor locator portal.

SUMMARY:
Smart Healthcare Portal is a browser-based medical assistant guiding patients from symptom logging to home remedies and doctor geolocations.

TECH STACK:
HTML5, CSS3, JavaScript (ES6), Bootstrap, Leaflet.js.
`,

    numberplate: `
PROJECT: Number Plate Detection

TYPE:
CCTV-integrated vehicle logging system.

SUMMARY:
Number Plate Detection is a deep learning computer vision pipeline that automatically detects vehicle license plates in video streams and extracts the alphanumeric text.

TECH STACK:
Python, TensorFlow, Keras, OpenCV, SQLite, NumPy.
`,

    background: `
PROFILE: Nitish Vattikuti

ROLE:
Computer Science Engineering Student & Software Developer.

BACKGROUND:
Pursuing BTech in Computer Science and Engineering at MVGR College of Engineering, Vizianagaram, Andhra Pradesh, India. Expected graduation: May 2027. CGPA: 7.59.
Coursework includes: Data Structures & Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS), Computer Networks, OOP (C++/Java), AI-ML.

EXPERIENCE:
Software Engineering Intern at Vantiris Technologies LLP (Remote, India, Feb 2026 – Present).
Worked on:
- Web Optimization & Scaling: Deploying responsive architectures for logistics platforms (APET Logistics, Marine Commercial Ltd) to Netlify.
- UI/UX Redesign: Overhauling legacy HTML clients into modern cross-device responsive layouts.
- Technical Workflows: Leveraging Git/GitHub workflows to coordinate feature releases.
- Project Architecture: Creating engineering lifecycle documentation.

SKILLS:
- Languages: Python, SQL, Java, C/C++ (OOP)
- Frameworks & Libraries: NumPy, OpenCV, TensorFlow.js, HTML, CSS, JavaScript, Zustand
- Tools & Systems: ServiceNow (CSA/CAD certified), Linux, Docker, MySQL, PowerBI, Figma, MS Office 365

CERTIFICATIONS:
- ServiceNow Certified System Administrator (CSA) - 2026
- ServiceNow Certified Application Developer (CAD) - 2026
- HTML, CSS, and Generative AI: Speed Up Your Process (LinkedIn) - 2024
- Python Essentials (Cisco Networking Academy) - 2025
`,

    collaborations: `
OPEN TO WORK & COLLABORATIONS

CURRENT STATUS:
Working as Software Engineering Intern at Vantiris Technologies. Open to projects, collaboration, ServiceNow application development (CSA/CAD), and web developer opportunities.
`
};