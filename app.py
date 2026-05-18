from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Energy and Carbon Data (Research-backed approximations)
HARDWARE = {
    "NVIDIA_H100": {"tdp": 700, "perf_factor": 1.5},
    "NVIDIA_A100": {"tdp": 400, "perf_factor": 1.0},
    "NVIDIA_T4": {"tdp": 70, "perf_factor": 0.3},
    "CPU_GENERIC": {"tdp": 150, "perf_factor": 0.05}
}

class SimInput(BaseModel):
    model_size: float  # Billions of params
    hardware: str
    utilization: float # 0.0 to 1.0
    grid_intensity: float # gCO2/kWh

@app.post("/calculate")
async def calculate(data: SimInput):
    hw = HARDWARE.get(data.hardware, HARDWARE["NVIDIA_A100"])
    
    # Calculate Latency (simplified: bigger models are slower)
    latency_ms = (data.model_size / hw["perf_factor"]) * 10
    
    # Energy = (Power Draw * Time) * PUE (Power Usage Effectiveness)
    pue = 1.67 
    current_draw_kw = (hw["tdp"] * data.utilization * pue) / 1000
    
    # Carbon = Energy * Grid Intensity
    carbon_per_hour = current_draw_kw * data.grid_carbon_intensity
    
    return {
        "wattage": round(hw["tdp"] * data.utilization, 2),
        "latency": round(latency_ms, 2),
        "carbon_gh": round(carbon_per_hour, 2),
        "heat_level": data.utilization * (data.model_size / 175)
    }

app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
