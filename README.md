# Budgeter
This application serves as a minimalist way to keep track of your finances through different categories, with a set monthly budget.

## Usage

### Backend
```python
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```
The backend server should start on `http://127.0.0.1:8000`

### Frontend
```
npm install
npm run dev
```
