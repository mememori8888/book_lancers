from .base_scraper import Scraper

class YodobashiScraper(Scraper):
    def __init__(self):
        super().__init__("ヨドバシカメラ")
        self.base_url = "https://www.yodobashi.com/?word={}"

    def scrape(self, driver, isbn):
        """
        指定されたISBNでヨドバシ.comをスクレイピングし、アクセス状況を判定します。
        """
        print(f"--- {self.name}のアクセスチェックを開始します ---")
        url = self.base_url.format(isbn)
        
        status, details = self._check_access(driver, url)

        print(f"--- {self.name}のアクセスチェックが完了しました ---")

        return {
            "site": self.name,
            "isbn": isbn,
            "status": status,
            "details": details
        }

