from sqlalchemy import Column, Integer, String, Float
from database.db_connection import Base


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key = True, index = True)
    seller_id = Column(Integer)
    house_price = Column(Float)
    current_offer = Column(Float)
    cost_of_searching = Column(Float)
    team_id = Column(Integer)


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key = True, index = True)
    highest_offer = Column(Float)
