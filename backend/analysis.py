import os
from openai import OpenAI
from typing import Dict, List, Optional
from dotenv import load_dotenv

def build_prompt(user_description: str, file_insights: dict) -> str:
    """
    Build a structured prompt for the OpenAI API.
    
    Args:
        user_description (str): User's description of the business context
        file_insights (dict): Dictionary of insights from each file
        
    Returns:
        str: Formatted prompt string
    """
    prompt = f"""
You are a data analyst and strategic advisor.

Business Context:
{user_description}

Data Insights:
"""
    for file, stats in file_insights.items():
        prompt += f"\nFrom file '{file}':\n"
        for k, v in stats.items():
            prompt += f" - {k}: {v}\n"

    prompt += "\nPlease provide:\n"
    prompt += "- A clear executive summary (1–3 paragraphs)\n"
    prompt += "- A list of 3–5 actionable recommendations based on the data and context"

    return prompt

def generate_summary(prompt: str, context: Optional[Dict] = None) -> str:
    """
    Generate a summary using OpenAI's API.
    
    Args:
        prompt (str): The prompt to send to OpenAI
        context (Dict, optional): Additional context for the prompt
        
    Returns:
        str: Contains the generated summary
    """
    try:
        # Load environment variables
        load_dotenv()
        
        # Get API key and base URL
        api_key = os.getenv("OPENAI_API_KEY")
        api_base = os.getenv("OPENAI_API_BASE")
        
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        # Initialize client
        client = OpenAI(
            api_key=api_key,
            base_url=api_base
        )
        
        # Make the API call
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL_ID", "gpt-3.5-turbo"),
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes data and provides insights."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content
    except ValueError as ve:
        print(f"Configuration error: {str(ve)}")
        raise
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise

def generate_summary_from_user_description(user_description: str, file_insights: dict) -> dict:
    """
    Generate an executive summary and action items based on user description and file insights.
    
    Args:
        user_description (str): User's description of the data context
        file_insights (dict): Structured insights from the uploaded files
        
    Returns:
        dict: Contains 'summary' and 'action_items' keys
    """
    # Build the prompt
    prompt = build_prompt(user_description, file_insights)
    
    try:
        # Generate the summary
        summary = generate_summary(prompt)
        
        # Split into summary and action items
        parts = summary.split("Action Items:")  # Updated to match new prompt format
        if len(parts) != 2:
            raise ValueError("Unexpected response format from OpenAI")
            
        summary = parts[0].replace("Executive Summary:", "").strip()
        action_items = [
            item.strip().lstrip("1234567890.- ")
            for item in parts[1].strip().split("\n")
            if item.strip()
        ]
        
        return {
            "summary": summary,
            "action_items": action_items
        }
        
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return {
            "summary": "Error generating summary. Please try again.",
            "action_items": ["Review the input data", "Check API configuration", "Retry the analysis"]
        } 