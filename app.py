from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI()

# Research-based energy profiles
HARDWARE = {
    "NVIDIA_H100": {"tdp": 700, "perf": 1.8},
    "NVIDIA_A100": {"tdp": 400, "perf": 1.0},
    "NVIDIA_T4": {"tdp": 70, "perf": 0.3}
}

class SimInput(BaseModel):
    model_size: float
    hardware: str
    grid_intensity: float

@app.post("/calculate")
async def calculate(data: SimInput):
    hw = HARDWARE.get(data.hardware, HARDWARE["NVIDIA_A100"])
    
    # Logic: Larger models consume more per inference
    # Carbon = (TDP * PUE * Grid Intensity) / 1000
    pue = 1.6 # Data center overhead
    wattage = hw["tdp"] * (data.model_size / 175 + 0.1)
    carbon = (wattage * pue * data.grid_intensity) / 1000000 # kg/h
    
    return {
        "wattage": round(wattage, 2),
        "carbon": round(carbon * 1000, 2), # Convert to grams
        "heat": min(wattage / 700, 1.0)
    }

# Serve the visualizer
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
