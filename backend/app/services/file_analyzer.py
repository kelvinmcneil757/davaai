import pandas as pd
import numpy as np
from typing import List, Dict, Any
from fastapi import UploadFile
import io
from datetime import datetime

class FileAnalyzer:
    @staticmethod
    async def analyze_file(file: UploadFile) -> Dict[str, Any]:
        # Read file content
        content = await file.read()
        
        # Determine file type and read accordingly
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise ValueError("Unsupported file format")
        
        # Basic stats
        stats = {
            "filename": file.filename,
            "row_count": len(df),
            "column_count": len(df.columns),
            "numeric_averages": {},
            "categorical_most_common": {},
            "data_quality": {},
            "trends": {},
            "correlations": {},
            "anomalies": {},
            "metadata": {
                "uploaded_at": datetime.now().isoformat(),
                "file_size": len(content),
                "columns": list(df.columns)
            }
        }
        
        # Analyze numeric columns
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
        for col in numeric_cols:
            stats["numeric_averages"][col] = df[col].mean()
            stats["data_quality"][col] = {
                "missing_values": df[col].isnull().sum(),
                "unique_values": df[col].nunique(),
                "std_dev": df[col].std(),
                "min": df[col].min(),
                "max": df[col].max()
            }
            
            # Detect trends
            if len(df) > 1:
                stats["trends"][col] = {
                    "trend_direction": "up" if df[col].iloc[-1] > df[col].iloc[0] else "down",
                    "trend_strength": abs(df[col].pct_change().mean())
                }
            
            # Detect anomalies using IQR method
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            anomalies = df[(df[col] < lower_bound) | (df[col] > upper_bound)][col]
            stats["anomalies"][col] = {
                "count": len(anomalies),
                "percentage": (len(anomalies) / len(df)) * 100
            }
        
        # Analyze categorical columns
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns
        for col in categorical_cols:
            most_common = df[col].value_counts().head(3).to_dict()
            stats["categorical_most_common"][col] = list(most_common.keys())
            stats["data_quality"][col] = {
                "missing_values": df[col].isnull().sum(),
                "unique_values": df[col].nunique(),
                "most_common_percentage": (df[col].value_counts().iloc[0] / len(df)) * 100
            }
        
        # Calculate correlations between numeric columns
        if len(numeric_cols) > 1:
            corr_matrix = df[numeric_cols].corr()
            high_correlations = []
            for i in range(len(numeric_cols)):
                for j in range(i+1, len(numeric_cols)):
                    corr = corr_matrix.iloc[i, j]
                    if abs(corr) > 0.7:  # Strong correlation threshold
                        high_correlations.append({
                            "column1": numeric_cols[i],
                            "column2": numeric_cols[j],
                            "correlation": corr
                        })
            stats["correlations"] = high_correlations
        
        return stats

    @staticmethod
    def generate_ai_prompt(file_stats: List[Dict[str, Any]], context: str) -> str:
        prompt = f"Context: {context}\n\n"
        prompt += "Data Analysis Summary:\n"
        
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
        prompt += "1. A compelling executive summary that highlights key insights and opportunities\n"
        prompt += "2. A list of specific, actionable recommendations that can drive business value\n"
        prompt += "3. Identify any potential risks or areas that need immediate attention\n"
        prompt += "4. Suggest metrics to track for measuring the impact of these recommendations"
        
        return prompt 