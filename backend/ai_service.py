import os
from openai import OpenAI
from typing import Dict, Optional
from dotenv import load_dotenv

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