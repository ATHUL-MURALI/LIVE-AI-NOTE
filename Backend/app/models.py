from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Text
from pydantic import BaseModel

Base = declarative_base()


class Page(Base):
    __tablename__ = "page"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)


# Request Schema
class PageSchema(BaseModel):
    text: str
