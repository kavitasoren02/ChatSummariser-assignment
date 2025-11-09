# Use a stable Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install PostgreSQL dev libs for psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc build-essential && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files
COPY . .

# Expose port
EXPOSE 8000

# Start FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
