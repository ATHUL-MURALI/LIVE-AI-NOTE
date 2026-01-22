from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Page, PageSchema, Base

router = APIRouter()

Base.metadata.create_all(bind=engine)


# DB Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- SAVE PAGE ----------------

@router.post("/save")
def save_page(data: PageSchema, db: Session = Depends(get_db)):

    # delete old page
    db.query(Page).delete()

    new_page = Page(text=data.text)

    db.add(new_page)
    db.commit()
    db.refresh(new_page)

    return {"message": "Saved successfully"}


# ---------------- GET PAGE ----------------

@router.get("/get")
def get_page(db: Session = Depends(get_db)):

    page = db.query(Page).first()

    if not page:
        return {"text": ""}

    return {"text": page.text}
