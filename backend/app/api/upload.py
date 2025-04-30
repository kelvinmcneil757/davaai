from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List, Optional
from ..services.file_analyzer import FileAnalyzer
from ..services.ai_service import AIService
from ..schemas.upload import UploadResponse, FileStats
import asyncio
from datetime import datetime

router = APIRouter()
ai_service = AIService()

async def validate_file(file: UploadFile):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file.filename}. Only CSV and Excel files are supported."
        )
    
    # Check file size (max 10MB)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB in bytes
        raise HTTPException(
            status_code=400,
            detail=f"File {file.filename} is too large. Maximum size is 10MB."
        )
    
    # Reset file pointer
    await file.seek(0)
    return file

@router.post("/upload", response_model=UploadResponse)
async def upload_files(
    files: List[UploadFile] = File(...),
    context: str = Form(..., max_length=2000),
    industry: Optional[str] = Form(None, max_length=100),
    business_goals: Optional[str] = Form(None, max_length=500)
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
    
    # Validate all files
    validated_files = await asyncio.gather(*[validate_file(file) for file in files])
    
    # Analyze each file
    file_stats = []
    for file in validated_files:
        try:
            stats = await FileAnalyzer.analyze_file(file)
            file_stats.append(stats)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing file {file.filename}: {str(e)}"
            )
    
    try:
        # Generate AI insights
        insights = await ai_service.generate_insights(
            file_stats=file_stats,
            context=context,
            industry=industry,
            business_goals=business_goals
        )
        
        return UploadResponse(
            executive_summary=insights["executive_summary"],
            action_items=insights["action_items"],
            file_stats=[FileStats(**stats) for stats in file_stats],
            confidence_score=insights["confidence_score"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating insights: {str(e)}"
        ) 