# Use a stable Python image
FROM python:3.11-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create app directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc build-essential && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirement.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirement.txt

# Copy the app code
COPY . .

# Expose the port Render expects
EXPOSE 8000

# Command to run your app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
