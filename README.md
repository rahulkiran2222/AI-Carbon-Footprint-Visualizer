# 🌍 AI Carbon Footprint Visualizer
### *Real-time 3D Simulation of Compute Entropy & Environmental Impact*

[![Hugging Face Space](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Live%20Demo-yellow)](https://huggingface.co/spaces/RahulGK/AI-Carbon-Footprint-Visualizer)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/Framework-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Graphics](https://img.shields.io/badge/Graphics-Three.js-black.svg)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Overview
The **AI Carbon Footprint Visualizer** is a high-end research tool designed to make the environmental cost of AI visible. While Large Language Models (LLMs) continue to scale, their physical footprint—energy, heat, and carbon—is often ignored. 

This project provides an interactive **3D kinetic engine** that transforms abstract compute data into a visual "Neural Core," allowing developers to simulate how model size and hardware choice affect our planet in real-time.

---

## 🚀 Key Features
*   **3D Neural Core:** A reactive icosahedron that changes scale and color based on carbon intensity.
*   **Real-time Physics:** A particle system simulating energy flow into the GPU cluster.
*   **Hardware Profiling:** Toggle between NVIDIA H100, A100, and T4 to see efficiency differences.
*   **Scaling Simulation:** Observe the exponential power draw as model parameters increase from 1B to 175B (GPT-3 scale).
*   **Carbon Intensity Tracking:** Adjust the grid "dirtiness" (gCO2/kWh) based on global regional data.

---

## 🛠 Tech Stack
- **Backend:** Python, FastAPI (Energy Physics Engine)
- **Frontend:** Three.js (WebGL Visuals), Tailwind CSS (UI Layer)
- **Deployment:** Docker, Hugging Face Spaces

---

## 🧪 The Science Behind the Visuals

The system calculates the **Carbon Footprint ($C$)** using the following logic:


C = \left( \frac{TDP \times Utilization \times PUE}{1000} \right) \times Intensity
TDP (Thermal Design Power): The peak power draw of the selected GPU.

PUE (Power Usage Effectiveness): Fixed at 1.6 to account for data center cooling overhead.

Grid Intensity: Regional carbon cost per kilowatt-hour.

🏗 Project Structure
code
Text
├── app.py              # FastAPI Backend (Mathematical Logic)
├── Dockerfile          # Container configuration
├── requirements.txt    # Python dependencies
└── static/             
    ├── index.html      # 3D Render & UI Overlay
    └── script.js       # Three.js Particle Engine
🛣 Future Roadmap

Live Grid API: Integration with real-time global energy maps.

Multi-GPU Clusters: Visualizing the impact of training 1,000+ GPU nodes.

Expanded Hardware: Adding support for AMD Instinct and Google TPU profiles.

Mobile Optimization: AR-view support for the Energy Core.
💻 Local Setup
Clone the repository:

code
Bash
git clone https://github.com/RahulGK/AI-Carbon-Visualizer.git
cd AI-Carbon-Visualizer
Install dependencies:

code
Bash
pip install -r requirements.txt
Launch the visualizer:

code
Bash
python app.py
Visit http://localhost:7860 in your browser.

👤 Author
Rahul Kiran G.
AI Developer & Researcher

"Making the invisible costs of Artificial Intelligence visible for a sustainable future."
Developed for the Hugging Face Open Science community.
