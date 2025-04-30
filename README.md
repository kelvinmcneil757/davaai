# Dava AI - Data Analysis & Storytelling Platform

## Overview

Dava AI transforms raw business data into actionable insights by combining advanced AI technology with business context. Our platform helps organizations make data-driven decisions more effectively and efficiently.

**(Da)ta + (Va)lue = Story**

## Features

- **Multi-Format Support**: Upload CSV and Excel files for analysis
- **Context-Aware Analysis**: Provide business context for more relevant insights
- **Executive Summaries**: Get clear, concise summaries of your data
- **Action Items**: Receive specific, actionable recommendations
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React

### Backend
- FastAPI
- Python 3.13
- OpenAI API
- Pandas

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.13+
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables
Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_api_key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL_ID=gpt-3.5-turbo
```

## Project Structure

```
davaai/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── analyze/
│   │   │   ├── labs/
│   │   │   └── page.tsx
│   │   └── components/
│   └── public/
├── backend/
│   ├── main.py
│   ├── ai_service.py
│   └── analysis.py
└── docs/
    ├── BUSINESS_REQUIREMENTS.md
    ├── TECHNICAL_DOCUMENTATION.md
    └── screenshots/
```

## Documentation

- [Business Requirements](docs/BUSINESS_REQUIREMENTS.md)
- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)
- [Screenshots Documentation](docs/screenshots/INDEX.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT API
- Next.js team for the amazing framework
- FastAPI team for the efficient backend framework 