
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ApartOS + StayLocal API",
    description="Apartment management and booking platform",
    version="1.0.0"
)

# Allow React frontend to communicate with the API
origins = [
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {
        "message": "Welcome to ApartOS API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ApartOS Backend"
    }


@app.get("/api/apartments")
def get_apartments():
    return [
        {
            "id": 1,
            "name": "Sea View Apartment",
            "location": "Demre, Antalya",
            "price": 2500,
            "capacity": 4
        },
        {
            "id": 2,
            "name": "Garden Suite",
            "location": "Kas, Antalya",
            "price": 3200,
            "capacity": 3
        }
    ]


@app.get("/api/reservations")
def get_reservations():
    return []
