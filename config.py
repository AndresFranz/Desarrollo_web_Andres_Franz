import os

class Config:
    SECRET_KEY = "s3cr3t_k3y"

    URL = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "uploads")
