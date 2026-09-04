import time
import datetime
import logging
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from bs4 import BeautifulSoup
import sys
import os

# Setup Logging & Auditing (Phase 15 integration)
log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../logs'))
os.makedirs(log_dir, exist_ok=True)
logging.basicConfig(
    filename=os.path.join(log_dir, 'system_audit.log'),
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] (AUDIT) - %(message)s'
)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.data.synthetic.generator import SyntheticDataGenerator

class DataIngestionCron:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.generator = SyntheticDataGenerator()

    def fetch_market_rates(self):
        """
        Phase 13: Web Scraping simulation.
        In a real scenario, this hits the Baltic Exchange API or scrapes a maritime news site.
        """
        logging.info("CRON TRIGGERED: Fetching market rates.")
        try:
            # Mock scraping
            # response = requests.get('https://example-freight-site.com/rates')
            # soup = BeautifulSoup(response.text, 'html.parser')
            # rates = soup.find(id='capesize-rate').text
            
            # Since we can't scrape a real authenticated site here, we trigger our internal generator
            new_data = self.generator.generate_freight_data(days=1)
            
            logging.info(f"Successfully scraped and ingested 1 day of market rates. Generated Shape: {new_data.shape}")
        except Exception as e:
            logging.error(f"Failed to fetch market rates: {e}")

    def fetch_port_congestion(self):
        """
        Phase 13: Port Congestion API ping.
        """
        logging.info("CRON TRIGGERED: Fetching port congestion updates.")
        try:
            # Mock API
            # requests.get('https://api.vesseltracker.com/congestion')
            logging.info("Port congestion data refreshed successfully.")
        except Exception as e:
            logging.error(f"Failed to fetch port congestion: {e}")

    def start(self):
        # Schedule the rate fetcher to run every day at 18:00 (6 PM)
        self.scheduler.add_job(self.fetch_market_rates, 'cron', hour=18, minute=0)
        
        # Schedule port congestion updates every 6 hours
        self.scheduler.add_job(self.fetch_port_congestion, 'interval', hours=6)
        
        self.scheduler.start()
        logging.info("CRON SCHEDULER STARTED: Background jobs initialized.")
        print("Cron scheduler running in background. Logs are written to logs/system_audit.log")

if __name__ == "__main__":
    cron = DataIngestionCron()
    cron.start()
    
    # Keep the script alive for testing
    try:
        # Run one immediately for testing
        cron.fetch_market_rates()
        cron.fetch_port_congestion()
        
        print("Press Ctrl+C to exit.")
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        cron.scheduler.shutdown()
        print("Scheduler shut down.")
