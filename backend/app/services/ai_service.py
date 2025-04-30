import openai
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
import time
import json
from pathlib import Path
import hashlib
import asyncio
from datetime import datetime, timedelta

load_dotenv()

class AIService:
    def __init__(self):
        # Load environment variables
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.api_base = os.getenv("OPENAI_API_BASE")
        self.model_id = os.getenv("MODEL_ID", "gpt-3.5-turbo")
        
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        # Configure OpenAI
        openai.api_key = self.api_key
        if self.api_base:
            openai.api_base = self.api_base
            
        self.model = self.model_id
        self.cache_dir = Path("cache")
        self.cache_dir.mkdir(exist_ok=True)
        self.cache_expiry = int(os.getenv("CACHE_EXPIRY", "3600"))  # 1 hour default
        self.max_retries = int(os.getenv("MAX_RETRIES", "3"))
        self.fallback_mode = os.getenv("FALLBACK_MODE", "false").lower() == "true"

    def _get_cache_key(self, file_stats: List[Dict[str, Any]], context: str) -> str:
        # Create a unique cache key based on the input data
        data = {
            "file_stats": file_stats,
            "context": context,
            "model": self.model
        }
        return hashlib.md5(json.dumps(data, sort_keys=True).encode()).hexdigest()

    def _get_cached_response(self, cache_key: str) -> Optional[Dict[str, Any]]:
        cache_file = self.cache_dir / f"{cache_key}.json"
        if not cache_file.exists():
            return None
        
        try:
            with open(cache_file, 'r') as f:
                cached_data = json.load(f)
                if datetime.fromisoformat(cached_data['timestamp']) + timedelta(seconds=self.cache_expiry) > datetime.now():
                    return cached_data['response']
        except Exception:
            pass
        return None

    def _save_to_cache(self, cache_key: str, response: Dict[str, Any]):
        cache_file = self.cache_dir / f"{cache_key}.json"
        try:
            with open(cache_file, 'w') as f:
                json.dump({
                    'timestamp': datetime.now().isoformat(),
                    'response': response
                }, f)
        except Exception:
            pass

    def _generate_fallback_response(self, file_stats: List[Dict[str, Any]], context: str) -> Dict[str, Any]:
        # Generate a basic response when the API is unavailable
        total_rows = sum(stats['row_count'] for stats in file_stats)
        total_columns = sum(stats['column_count'] for stats in file_stats)
        
        executive_summary = f"Based on the analysis of {len(file_stats)} files containing {total_rows} rows and {total_columns} columns, we've identified several key patterns. The data shows significant variations in the metrics, with some notable trends and anomalies that require attention."
        
        action_items = [
            "Review the data quality metrics for each file",
            "Investigate the identified anomalies",
            "Consider the strong correlations between metrics",
            "Monitor the trends over time"
        ]
        
        return {
            "executive_summary": executive_summary,
            "action_items": action_items,
            "confidence_score": 0.5,
            "is_fallback": True
        }

    async def generate_insights(
        self,
        file_stats: List[Dict[str, Any]],
        context: str,
        industry: str = None,
        business_goals: str = None
    ) -> Dict[str, Any]:
        # Check cache first
        cache_key = self._get_cache_key(file_stats, context)
        cached_response = self._get_cached_response(cache_key)
        if cached_response:
            return cached_response

        # If in fallback mode, return fallback response
        if self.fallback_mode:
            return self._generate_fallback_response(file_stats, context)

        # Construct prompt
        prompt = self._construct_prompt(file_stats, context, industry, business_goals)
        
        # Retry logic
        for attempt in range(self.max_retries):
            try:
                response = await openai.ChatCompletion.acreate(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert business analyst and data storyteller. Your task is to analyze data and provide actionable insights that drive business value. Keep your responses concise and focused on the most important insights."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
                
                # Parse the response
                content = response.choices[0].message.content
                
                # Split into executive summary and action items
                sections = content.split("\n\n")
                executive_summary = sections[0]
                action_items = [item.strip() for item in sections[1].split("\n") if item.strip()]
                
                result = {
                    "executive_summary": executive_summary,
                    "action_items": action_items,
                    "confidence_score": self._calculate_confidence_score(file_stats),
                    "is_fallback": False
                }
                
                # Cache the successful response
                self._save_to_cache(cache_key, result)
                return result
                
            except openai.error.RateLimitError:
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    continue
                if self.fallback_mode:
                    return self._generate_fallback_response(file_stats, context)
                raise Exception("Rate limit exceeded and fallback mode is disabled")
                
            except openai.error.APIError as e:
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
                if self.fallback_mode:
                    return self._generate_fallback_response(file_stats, context)
                raise Exception(f"API error: {str(e)}")
                
            except Exception as e:
                if self.fallback_mode:
                    return self._generate_fallback_response(file_stats, context)
                raise Exception(f"Error generating insights: {str(e)}")

    def _construct_prompt(
        self,
        file_stats: List[Dict[str, Any]],
        context: str,
        industry: str = None,
        business_goals: str = None
    ) -> str:
        prompt = f"Context: {context}\n\n"
        
        if industry:
            prompt += f"Industry: {industry}\n"
        if business_goals:
            prompt += f"Business Goals: {business_goals}\n"
            
        prompt += "\nData Analysis Summary:\n"
        
        for stats in file_stats:
            prompt += f"\nFile: {stats['filename']}\n"
            prompt += f"Rows: {stats['row_count']}, Columns: {stats['column_count']}\n"
            
            # Add data quality insights
            prompt += "\nData Quality Insights:\n"
            for col, quality in stats["data_quality"].items():
                prompt += f"- {col}:\n"
                prompt += f"  * Missing values: {quality['missing_values']}\n"
                prompt += f"  * Unique values: {quality['unique_values']}\n"
                if "std_dev" in quality:
                    prompt += f"  * Standard deviation: {quality['std_dev']:.2f}\n"
            
            # Add trend insights
            if stats["trends"]:
                prompt += "\nTrend Analysis:\n"
                for col, trend in stats["trends"].items():
                    prompt += f"- {col}: {trend['trend_direction']} trend (strength: {trend['trend_strength']:.2f})\n"
            
            # Add anomaly insights
            if stats["anomalies"]:
                prompt += "\nAnomaly Detection:\n"
                for col, anomaly in stats["anomalies"].items():
                    if anomaly["count"] > 0:
                        prompt += f"- {col}: {anomaly['count']} anomalies ({anomaly['percentage']:.1f}% of data)\n"
            
            # Add correlation insights
            if stats["correlations"]:
                prompt += "\nStrong Correlations:\n"
                for corr in stats["correlations"]:
                    prompt += f"- {corr['column1']} and {corr['column2']}: {corr['correlation']:.2f}\n"
        
        prompt += "\nPlease provide:\n"
        prompt += "1. A concise executive summary (max 3 sentences) highlighting the most important insights\n"
        prompt += "2. A list of 3-5 specific, actionable recommendations\n"
        prompt += "3. One key risk or area that needs immediate attention\n"
        prompt += "4. One key metric to track for measuring impact"
        
        return prompt

    def _calculate_confidence_score(self, file_stats: List[Dict[str, Any]]) -> float:
        # Calculate a confidence score based on data quality and completeness
        total_rows = sum(stats['row_count'] for stats in file_stats)
        total_columns = sum(stats['column_count'] for stats in file_stats)
        numeric_columns = sum(len(stats['numeric_averages']) for stats in file_stats)
        categorical_columns = sum(len(stats['categorical_most_common']) for stats in file_stats)
        
        # Simple scoring algorithm
        score = 0.0
        if total_rows > 1000:
            score += 0.3
        if total_columns > 5:
            score += 0.2
        if numeric_columns > 0:
            score += 0.25
        if categorical_columns > 0:
            score += 0.25
            
        return min(score, 1.0)

    async def generate_summary(self, user_description: str, file_insights: dict) -> dict:
        try:
            # Construct the prompt
            prompt = self._build_summary_prompt(user_description, file_insights)
            
            # Make the API call
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a data analyst and strategic advisor. Your task is to provide clear, actionable insights based on data analysis."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse the response
            content = response.choices[0].message.content
            
            # Split into summary and action items
            sections = content.split("\n\n")
            summary = sections[0]
            action_items = []
            
            # Extract action items from the remaining sections
            for section in sections[1:]:
                if section.strip().startswith("* "):
                    action_items.extend([item.strip("* ").strip() for item in section.split("\n") if item.strip()])
            
            return {
                "summary": f"<p>{summary}</p>",
                "action_items": action_items
            }
            
        except Exception as e:
            print(f"Error generating summary: {str(e)}")
            return {
                "summary": "⚠️ Unable to generate summary. Please try again later.",
                "action_items": []
            }

    def _build_summary_prompt(self, user_description: str, file_insights: dict) -> str:
        prompt = "Context:\n"
        prompt += f"{user_description}\n\n"
        
        prompt += "Data Analysis:\n"
        for key, value in file_insights.items():
            if isinstance(value, dict):
                prompt += f"\n{key}:\n"
                for subkey, subvalue in value.items():
                    prompt += f"* {subkey}: {subvalue}\n"
            else:
                prompt += f"* {key}: {value}\n"
        
        prompt += "\nPlease provide:\n"
        prompt += "1. A business-ready executive summary in 1-3 paragraphs\n"
        prompt += "2. 3-5 clear, actionable next steps in bullet points\n"
        prompt += "\nFormat the output with clear paragraph breaks and bullet points."
        
        return prompt 