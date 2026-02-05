from abc import ABC, abstractmethod

class Scraper(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def scrape(self, driver, isbn):
        """
        Scrapes the website for the given ISBN using the provided webdriver.
        Returns a dictionary with the scraping result.
        """
        pass
