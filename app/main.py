# https://www.youtube.com/watch?v=0sOvCWFmrtA&t=31862s

from .routers import user, budget, auth, category, transaction
from fastapi import FastAPI

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(budget.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(category.router)
app.include_router(transaction.router)
