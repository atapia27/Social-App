Install requirements.txt

```bash
pip freeze | xargs pip uninstall -y

.venv\Scripts\activate
pip install -r backend/requirements.txt
```

Run
```bash
uvicorn backend.main:app --reload
```