from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import engine
from models import Base
from routes import router

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="backend_api_for_r,_a_web_application_built_with_react_as_the_frontend_and_fastapi_as_the_backend,_utilizing_sqlalchemy_for_database_operations. API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to backend_api_for_r,_a_web_application_built_with_react_as_the_frontend_and_fastapi_as_the_backend,_utilizing_sqlalchemy_for_database_operations. API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend_api_for_r,_a_web_application_built_with_react_as_the_frontend_and_fastapi_as_the_backend,_utilizing_sqlalchemy_for_database_operations."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)