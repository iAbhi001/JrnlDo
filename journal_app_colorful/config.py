class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'postgresql://username:password@<RDS_ENDPOINT>/dbname'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
