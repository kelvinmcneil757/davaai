from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import pandas as pd
import io
import json
import os
from openai import OpenAI
from dotenv import load_dotenv
from analysis import generate_summary
from routers.ai import router as ai_router

load_dotenv()

app = FastAPI(
    title="Dava AI API",
    description="Backend API for Dava AI - Data Analysis and Storytelling Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_API_BASE")
)

# Include routers
app.include_router(ai_router, prefix="/ai", tags=["ai"])

def analyze_file(file_content: bytes, filename: str) -> dict:
    try:
        # Read the file content
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_content))
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(file_content))
        else:
            raise ValueError("Unsupported file format")

        # Basic analysis
        stats = {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
            "missing_values": df.isnull().sum().to_dict(),
            "data_types": df.dtypes.astype(str).to_dict()
        }
        
        return stats
    except Exception as e:
        print(f"Error analyzing file {filename}: {str(e)}")
        raise

@app.post("/analyze")
async def analyze_files(
    files: List[UploadFile] = File(...),
    description: str = Form(...)
):
    try:
        # Process files
        data_summary = []
        for file in files:
            content = await file.read()
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.StringIO(content.decode('utf-8')))
            elif file.filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(io.BytesIO(content))
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.filename}")
            
            # Generate summary for each file
            summary = generate_summary(f"Analyze this data and provide insights: {df.to_string()}", {"description": description})
            data_summary.append(summary)
        
        return {"summary": "\n\n".join(data_summary)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to Dava AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 