import argparse
import re
from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options

# Import all scrapers
from scrapers.yodobashi_scraper import YodobashiScraper
from scrapers.rakuten_scraper import RakutenScraper
from scrapers.kinokuniya_ec_scraper import KinokuniyaEcScraper
from scrapers.ehon_scraper import EhonScraper
from scrapers.maruzen_junkudo_ec_scraper import MaruzenJunkudoEcScraper
from scrapers.kosho_scraper import KoshoScraper
from scrapers.maruzen_junkudo_store_scraper import MaruzenJunkudoStoreScraper
from scrapers.kinokuniya_store_scraper import KinokuniyaStoreScraper
from scrapers.sanseido_store_scraper import SanseidoStoreScraper

def get_isbn_from_issue_body(body):
    """Extracts ISBN from the issue body markdown."""
    match = re.search(r"### Product Code \(JAN/ISBN\)\s*\n\s*(\d+)", body)
    if match:
        return match.group(1)
    return None

def create_report_table(results):
    """Formats the scraping results into a markdown table."""
    header = "| サイト名 | ステータス | 詳細 |\n|---|---|---|\n"
    body = ""
    for res in results:
        body += f"| {res['site']} | {res['status']} | {res['details']} |\n"
    return header + body

def main():
    parser = argparse.ArgumentParser(description="Run scrapers to test site accessibility.")
    parser.add_argument("--isbn", required=True, help="The ISBN to search for, extracted from the issue body.")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode.")
    args = parser.parse_args()

    issue_body = args.isbn
    isbn = get_isbn_from_issue_body(issue_body)

    if not isbn:
        print("Could not find ISBN in the issue body.")
        return

    print(f"Found ISBN: {isbn}. Starting scraping process...")

    chrome_options = Options()
    if args.headless:
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("window-size=1920x1080")


    # Selenium 4.6.0以降、SeleniumManagerが同梱されたため、
    # webdriver-managerは不要になり、よりシンプルな記述でWebDriverを初期化できます。
    try:
        driver = webdriver.Chrome(options=chrome_options)
    except Exception as e:
        print(f"Failed to initialize WebDriver: {e}")
        # GitHub Actions環境では、追加のデバッグ情報が役立つ場合があります。
        print("Attempting to locate chromedriver...")
        import shutil
        chromedriver_path = shutil.which("chromedriver")
        print(f"Chromedriver path: {chromedriver_path}")
        return


    scrapers = [
        YodobashiScraper(),
        RakutenScraper(),
        KinokuniyaEcScraper(),
        EhonScraper(),
        MaruzenJunkudoEcScraper(),
        KoshoScraper(),
        MaruzenJunkudoStoreScraper(),
        KinokuniyaStoreScraper(),
        SanseidoStoreScraper(),
    ]

    results = []
    for scraper in scrapers:
        try:
            result = scraper.scrape(driver, isbn)
            results.append(result)
        except Exception as e:
            print(f"An error occurred while running scraper for {scraper.name}: {e}")
            results.append({"site": scraper.name, "isbn": isbn, "status": "実行エラー", "details": str(e)})

    driver.quit()

    report = create_report_table(results)
    print(report)

if __name__ == "__main__":
    main()
