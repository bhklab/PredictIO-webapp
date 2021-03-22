import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from decouple import config

user = config('DB_USER')
pwd = config('DB_PASS')
host = config('DB_HOST')
db_name = config('DB_NAME')

engine = sqlalchemy.create_engine(f'mysql+mysqlconnector://{user}:{pwd}@{host}/{db_name}', echo=True)

Base = declarative_base()
class Individual(Base):
    __tablename__ = 'signature_individual'
    
    signature = sqlalchemy.Column(sqlalchemy.String, primary_key=True)
    outcome = sqlalchemy.Column(sqlalchemy.String, primary_key=True)
    model = sqlalchemy.Column(sqlalchemy.String, primary_key=True)
    study = sqlalchemy.Column(sqlalchemy.String, primary_key=True)
    primary_tissue = sqlalchemy.Column(sqlalchemy.String, primary_key=True)
    sequencing = sqlalchemy.Column(sqlalchemy.String)
    n = sqlalchemy.Column(sqlalchemy.Integer)
    effect_size = sqlalchemy.Column(sqlalchemy.Float)
    se = sqlalchemy.Column(sqlalchemy.Float)
    ci95_low = sqlalchemy.Column(sqlalchemy.Float)
    ci95_high = sqlalchemy.Column(sqlalchemy.Float)
    pval = sqlalchemy.Column(sqlalchemy.Float)

Base.metadata.create_all(engine)

# Create a session
Session = sqlalchemy.orm.sessionmaker()
Session.configure(bind=engine)
session = Session()

individuals = session.query(Individual).limit(10).all()