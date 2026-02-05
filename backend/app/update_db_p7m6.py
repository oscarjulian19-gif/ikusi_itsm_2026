from app.db.session import engine, Base
from app.models.models import Ticket, TicketPause
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_tickets_table():
    logger.info("Dropping 'tickets' and 'ticket_pauses' to apply schema changes...")
    try:
        TicketPause.__table__.drop(engine, checkfirst=True)
        Ticket.__table__.drop(engine, checkfirst=True)
        # Re-create
        logger.info("Re-creating tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Success! Schema updated.")
    except Exception as e:
        logger.error(f"Error updating schema: {e}")

if __name__ == "__main__":
    reset_tickets_table()
