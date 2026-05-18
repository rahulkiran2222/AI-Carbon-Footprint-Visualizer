FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Ensure the static folder permissions
RUN chmod -R 777 /code/static

CMD ["python", "app.py"]
