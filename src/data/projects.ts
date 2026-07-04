import mouseCover from "@/assets/DD.png";
import infraCover from "@/assets/infra_sight.png";
import healthCover from "@/assets/healthcare_portal.png";
import plateCover from "@/assets/number_plate.png";
import uavCover from "@/assets/uav_simulation.png";
import spectrafuseCover from "@/assets/spectrafuse.png";

export interface Project {
  title: string;
  summary: string;
  image: string;
  gallery?: string[];
  problem: string;
  architecture: string;
  architectureImage?: string | string[];
  architecturePipeline: string[];
  decisions: string[];
  technologies: string[];
  failureModes: string[];
  results: string[];
  resultsImages?: string[];
  metrics?: { label: string; value: string }[];
  github?: string;
  demo?: string;
}

export interface ProjectCategory {
  id: string;
  label: string;
  tagline: string;
  icon: string;
  projects: Project[];
}

export const projectCategories: ProjectCategory[] = [
  {
    id: "flagship",
    label: "Flagship Projects",
    tagline: "Systems-level engineering, simulation, and image fusion",
    icon: "",
    projects: [
      {
        title: "Autonomous UAV SIL Simulation",
        summary: "3D Software-in-the-Loop UAV guidance simulation with Weighted A* and RRT*",
        image: uavCover,
        problem: "Testing UAV flight logic and obstacle avoidance systems directly on hardware is costly, slow, and dangerous. The goal was to build a 3D Software-in-the-Loop (SIL) simulation that tests UAV guidance algorithms under strict hardware and communication constraints.",
        architecture: "A dual-process simulation architecture. An emulated avionics CPU runs 3D path planners and streams real-time telemetry over a custom TCP/IP socket link to a Ground Control Station (GCS) UI.",
        architecturePipeline: [
          "Guidance - Design a 3D Software-in-the-Loop (SIL) UAV simulation with Sense-and-Avoid (SAA) capabilities",
          "Optimization - Integrate Weighted A* and RRT* path planners for real-time trajectory calculation",
          "Communication - Open a dual-process TCP/IP socket link to stream telemetry from emulated CPU to GCS",
          "Profiling - Evaluate algorithm performance and hardware load using psutil under CPU stress constraints"
        ],
        decisions: [
          "Developed Weighted A* and RRT* trajectory planners from scratch, achieving planning latencies below 80ms for immediate obstacle correction.",
          "Used Python dual-process architecture with socket networking to strictly decouple flight simulation math from telemetry display logic.",
          "Employed psutil profiling tools to enforce strict Size, Weight, and Power (SWaP) constraints, verifying suitability for edge flight computers."
        ],
        technologies: ["Python", "Socket Programming", "Docker", "Avionics", "Weighted A*", "RRT*", "psutil"],
        failureModes: [
          "High network packet loss over sockets causing GCS desync (addressed by implementing UDP heartbeat checks and sliding-window sync buffers)",
          "Path calculation timeouts in high-density obstacle maps (mitigated by setting 80ms calculation timeouts and falling back to a simplified gradient avoidance vector)"
        ],
        results: [
          "Achieved path calculation latencies under 80ms for complex dynamic environments",
          "Demonstrated stable dual-process telemetry streaming over virtual TCP networks",
          "Verified flight computer SWaP compliance through comprehensive CPU and memory stress profiles"
        ],
        github: "https://github.com/Nitish-vattikuti/autonomous-uav-guidance",
        demo: "https://autonomous-uav-guidance.onrender.com/"
      },
      {
        title: "SpectraFuse",
        summary: "High-performance aerial multi-spectral image fusion and object detection platform",
        image: spectrafuseCover,
        problem: "Aerial surveillance under DRDO CABS specifications requires merging disjointed image feeds (Visible, Near-Infrared, Thermal Infrared) into a single high-fidelity composite feed. Performing this image fusion and running object detection in real-time requires local processing to avoid network latency and keep data isolated.",
        architecture: "A client-side image processing and detection pipeline. Feeds are aligned, fused via DWT/PCA, and sent to TensorFlow.js (COCO-SSD) for target tracking with local performance diagnostics.",
        architecturePipeline: [
          "Ingestion - Import and align multi-spectral image channels (Visible, NIR, and TIR)",
          "Transformation - Implement pixel-level math transforms (DWT, PCA, and IHS) to merge channels",
          "Detection - Load local browser-based TensorFlow.js (COCO-SSD) model to isolate tactical objects",
          "Evaluation - Compute real-time image quality evaluation metrics (PSNR, SSIM) to evaluate fusion fidelity"
        ],
        decisions: [
          "Built a 100% browser-based pipeline to ensure complete data isolation for sensitive military/surveillance assets, eliminating server-side leakage risk.",
          "Implemented Discrete Wavelet Transform (DWT) and Principal Component Analysis (PCA) directly in JavaScript for fast pixel-level fusion.",
          "Integrated local TensorFlow.js models to run object detection directly on client GPUs, preserving latency and bandwidth."
        ],
        technologies: ["TensorFlow.js", "COCO-SSD", "HTML5 Canvas API", "Zustand", "PCA", "DWT", "IHS", "PSNR/SSIM"],
        failureModes: [
          "Channel alignment drift caused by camera movement offsets (addressed by applying scale-rotation-translation matrices on HTML5 Canvas)",
          "High GPU utilization on lower-end devices during model inference (mitigated by setting dynamic frame-skipping rates for object detection)"
        ],
        results: [
          "Successful local fusion of Visible, NIR, and TIR feeds with zero server-side latency",
          "Real-time object detection running locally in-browser on multi-spectral composite feeds",
          "Instant calculation of quality metrics (PSNR, SSIM) confirming mathematical fidelity"
        ],
        github: "https://github.com/Nitish-vattikuti/Spectrafuse",
        demo: "https://spectrafuse.netlify.app/"
      },
      {
        title: "AI Virtual Mouse",
        summary: "Contactless hand gesture control system using OpenCV and MediaPipe",
        image: mouseCover,
        problem: "Traditional mouse interfaces require physical contact and flat surfaces, which can be limiting or inaccessible for certain users or in presentation environments. The goal was to build a contactless mouse interface using hand gestures captured by standard webcams, translating fingers and gestures into actions in real-time.",
        architecture: "A local computer vision pipeline that captures webcam video frames, identifies hand landmarks, filters coordinate jitter, and maps gestures to OS-level mouse movements and click inputs.",
        architecturePipeline: [
          "Ingestion - Stream live video frames from webcam using OpenCV",
          "Detection - Identify 21 hand landmarks using MediaPipe Hand Landmarker",
          "Smoothing - Filter out high-frequency coordinate jitter using moving average filters",
          "Gesture Parsing - Compute spatial distances between index and middle finger tips to detect click intents",
          "OS Execution - Map actions to native cursor movements and mouse clicks via PyAutoGUI"
        ],
        decisions: [
          "Selected MediaPipe Hand Landmarker over custom CNN training to leverage high-accuracy, pre-trained hand tracking on low-spec CPUs without GPU requirements.",
          "Implemented a running average coordinate smoothing buffer to prevent shaky mouse cursors caused by subtle hand tremors or lighting changes.",
          "Mapped index-tip positioning for motion tracking, and index-middle finger gap thresholding for clicks to make the interface intuitive."
        ],
        technologies: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "NumPy"],
        failureModes: [
          "Poor lighting environments cause landmark detection failures (addressed by raising frame brightness programmatically)",
          "Multiple hands entering the camera frame cause cursor jumping (mitigated by tracking only the primary hand with the highest detection confidence)"
        ],
        results: [
          "Accurate, low-latency cursor tracking with precise sub-pixel coordinates",
          "Intuitive gestures for left-click, right-click, and drag-and-drop operations",
          "Completely local execution with zero network footprint or external cloud dependency"
        ],
        github: "https://github.com/Nitish-vattikuti/Virtual-Mouse"
      }
    ]
  },
  {
    id: "research",
    label: "Web & Machine Learning Applications",
    tagline: "Responsive web products and computer vision projects",
    icon: "",
    projects: [
      {
        title: "InfraSight",
        summary: "AI-powered IT anomaly and failure prediction platform using real-time system metrics",
        image: infraCover,
        problem: "IT outages can cost organizations millions of dollars. Traditional monitoring systems rely on static threshold alerts that only trigger *after* a failure has occurred. The goal of InfraSight is to predict failures by identifying behavioral anomalies in system metrics beforehand.",
        architecture: "An end-to-end telemetry ingestion and prediction platform that monitors CPU, memory, disk, and network stats, running Autoencoder models to flag deviations from normal operational baselines.",
        architecturePipeline: [
          "Metric Collection - Ingest real-time server metrics from host agents",
          "Data Scaling - Normalize and scale metrics in rolling time-windows",
          "Anomaly Evaluation - Pass metrics through reconstruction-based neural network models",
          "Score Aggregation - Compute reconstruction error as an anomaly probability score",
          "Alert Dispatching - Trigger immediate notifications to operations teams when scores cross safety thresholds"
        ],
        decisions: [
          "Used reconstruction-based Autoencoders rather than classification models because failure data is sparse and normal behavior is easier to model.",
          "Implemented rolling-window metrics aggregation to capture temporal trends and patterns, reducing false positives from momentary load spikes.",
          "Integrated direct notification handlers to send immediate telemetry snapshots to slack/email."
        ],
        technologies: ["Python", "Scikit-Learn", "FastAPI", "InfluxDB", "Pandas", "NumPy"],
        failureModes: [
          "High false alarm rate during scheduled system maintenance/backups (mitigated by adding time-based exclusion schedules)",
          "Model accuracy drift over time as applications evolve (mitigated by setting up scheduled monthly model retraining runs)"
        ],
        results: [
          "Successfully identifies critical system anomalies up to 30 minutes before actual outages occur",
          "Reduces operator alert fatigue by grouping multiple related anomalies into single incident reports",
          "Provides interactive dashboards detailing metric-level contributions to anomaly scores"
        ],
        github: "https://github.com/Nitish-vattikuti/InfraSight"
      },
      {
        title: "Smart Healthcare Portal",
        summary: "Browser-based medical assistant guiding patients from symptom logging to provider mapping",
        image: healthCover,
        problem: "Access to medical advice is often delayed, expensive, or confusing for patients experiencing early symptoms. The challenge was to create a web-based, accessible system that helps patients log symptoms, get preliminary guidance, find local providers, and maintain wellness guidelines.",
        architecture: "A responsive, client-first web portal with symptom analysis engines, doctor finder interfaces, and clean, intuitive dashboard structures.",
        architecturePipeline: [
          "Input Capture - Collect symptoms, severity, and duration from patient",
          "Symptom Analysis - Filter and match symptoms against medical databases",
          "Risk Scoping - Evaluate urgent flags and trigger immediate warning screens",
          "Recommendation - Show potential care routes, home care tips, and doctor categories",
          "Provider Finder - Fetch matching local clinics/doctors using geolocation and specialty filters"
        ],
        decisions: [
          "Built a client-side symptom guide to ensure absolute patient data privacy and zero server footprint for basic queries.",
          "Implemented rigid warning redirects for critical symptoms to prevent misdiagnosis of life-threatening emergencies.",
          "Optimized layout for mobile viewports since patients in distress are highly likely to search from mobile devices."
        ],
        technologies: ["HTML5", "CSS3", "Javascript (ES6)", "Bootstrap", "Leaflet.js"],
        failureModes: [
          "User inputting ambiguous symptoms that map to dozens of potential diseases (addressed with interactive clarification questions)",
          "Emergency redirection failures when browser location is disabled (mitigated by using manual location fallback options)"
        ],
        results: [
          "Deployed as a responsive, fast-loading portal used by real test groups",
          "Clear visual indicators for emergency vs non-emergency symptom pathways",
          "High patient satisfaction score on user experience and accessibility audits"
        ],
        demo: "https://smarthealthcare-1896.netlify.app/"
      },
      {
        title: "Number Plate Detection",
        summary: "Automated license plate logging system using CCTV feeds and CNN models",
        image: plateCover,
        problem: "Manual logging of vehicle license plates in security gates or parking areas is slow and error-prone. The goal was to build a system that detects vehicle license plates in real-time video feeds and extracts the characters automatically.",
        architecture: "A two-stage deep learning pipeline: first locating the region of interest (license plate) in a video frame, and second segmenting and predicting the characters using a CNN classifier.",
        architecturePipeline: [
          "Ingestion - Stream CCTV video frames into the processing node",
          "Object Detection - Localize the license plate bounding box using OpenCV contours/YOLO",
          "Image Processing - Crop, convert to grayscale, and apply thresholding to isolate characters",
          "Character Segmentation - Extract individual character regions",
          "Recognition - Predict alphanumeric values using a trained CNN model",
          "Database Logging - Save license plate number and timestamp to local database"
        ],
        decisions: [
          "Used a two-stage detection-then-classification approach to make character training more robust against angled plates.",
          "Applied adaptive thresholding to handle varying lighting conditions and shadows on the plate surface.",
          "Integrated SQLite logging to maintain a lightweight, zero-configuration audit trail of all vehicles passing the camera."
        ],
        technologies: ["Python", "TensorFlow", "Keras", "OpenCV", "SQLite", "NumPy"],
        failureModes: [
          "Low character recognition accuracy on highly dirty or damaged license plates (mitigated by returning a confidence score and flag)",
          "Slow processing speeds on low-end edge hardware (mitigated by optimizing input resolution and reducing model parameters)"
        ],
        results: [
          "Achieved high localization rate and character accuracy on test video sets",
          "Provides an automated log showing timestamps, plate text, and image reference",
          "Compact model size suitable for deployment on edge systems like Raspberry Pi"
        ],
        github: "https://github.com/Nitish-vattikuti/Number-Plate-Detection-System"
      }
    ]
  }
];