# https://youtu.be/0sOvCWFmrtA?si=zAdy7lJ9D6pdud_D&t=23570

from . import models
from .database import engine
from .routers import user, budget
import time
from fastapi import FastAPI
import psycopg2
from psycopg2.extras import RealDictCursor

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# database connection
while True:
    try:
        connection = psycopg2.connect(
            host="localhost",
            database="budget-webapp",
            user="postgres",
            password="password",
            cursor_factory=RealDictCursor,
        )
        cursor = connection.cursor()
        print("Database connection was successful.")
        break
    except Exception as error:
        print("Database connection failed.")
        print(error)
        time.sleep(1)


app.include_router(budget.router)
app.include_router(user.router)