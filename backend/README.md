requirements.txt 
``` bash
pip freeze | xargs pip uninstall -y

.venv\Scripts\activate
pip install -r backend/requirements.txt

```


OPTIONAL STEP BETWEEM:
``` bash
pip install pipreqs (optional)
```


Running Formatters:
``` bash
cd backend
black .
```