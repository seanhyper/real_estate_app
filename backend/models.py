from sqlalchemy import Column, Integer, String, Float
from database.db_connection import Base
import sqlite3


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


def create_tables():
    connection = sqlite3.connect('real_estate.db')
    cursor = connection.cursor()

    # Create Users table
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )''')

    # Create Projects table
    cursor.execute('''CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_name TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')

    connection.commit()
    connection.close()


if __name__ == '__main__':
    create_tables()
