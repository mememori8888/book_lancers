import time
from .base_scraper import Scraper

class KoshoScraper(Scraper):
    def __init__(self):
        super().__init__("日本の古本屋")
        self.base_url = "https://www.kosho.or.jp/products/list.php?mode=search&search_word={}"

    def scrape(self, driver, isbn):
        """
        指定されたISBNで日本の古本屋をスクレイピングし、アクセス耐性をテストします。
        5回連続でアクセスを試行し、結果を返します。
        """
        print(f"--- {self.name}のアクセス耐性チェックを開始します ---")
        url = self.base_url.format(isbn)
        success_count = 0
        errors = []

        for i in range(5):
            try:
                print(f"試行 {i+1}/5: {url} にアクセスします...")
                driver.get(url)
                time.sleep(2)

                if "日本の古本屋" in driver.title:
                    print(f"試行 {i+1}: アクセス成功。タイトル: {driver.title}")
                    success_count += 1
                else:
                    error_message = f"試行 {i+1}: アクセスに失敗しました。予期しないページタイトルです: {driver.title}"
                    print(error_message)
                    errors.append(error_message)

            except Exception as e:
                error_message = f"試行 {i+1}: 例外が発生しました: {e}"
                print(error_message)
                errors.append(error_message)
                driver.refresh()

            time.sleep(3)

        print(f"--- {self.name}のアクセス耐性チェックが完了しました ---")

        if success_count == 5:
            status = "成功"
            details = f"5回全てのアクセスに成功しました。"
        else:
            status = "失敗または不安定"
            details = f"{success_count}/5 回のアクセスに成功しました。エラー詳細: {', '.join(errors)}"

        return {
            "site": self.name,
            "isbn": isbn,
            "status": status,
            "details": details
        }
