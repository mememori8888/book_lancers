from abc import ABC, abstractmethod
import time

class Scraper(ABC):
    def __init__(self, name):
        self.name = name
        self.base_url = ""

    def _check_access(self, driver, url):
        """
        指定されたURLにアクセスし、ステータスコードとページ内容からアクセス状況を判定する共通メソッド。
        """
        try:
            print(f"アクセス試行: {url}")
            driver.get(url)
            time.sleep(3)  # ページの読み込みと動的コンテンツの描画を待つ

            # selenium-wireで最後のリクエストのレスポンスを取得
            last_request = driver.last_request
            if not last_request or not last_request.response:
                # リクエストが捕捉できなかった場合（リダイレクトなど）
                # ここでは単純にページタイトルや内容で判断するフォールバック
                page_content = driver.page_source.lower()
                if "captcha" in page_content or "are you a robot" in page_content:
                    return "ブロックの可能性", "CAPTCHAまたはロボット確認が表示されました。"
                return "成功", "ステータスコード不明（リダイレクトの可能性）"

            status_code = last_request.response.status_code
            page_content = driver.page_source.lower()

            print(f"ステータスコード: {status_code}")

            if status_code in [403, 429, 503]:
                return "ブロックの可能性", f"アクセスが拒否されました (ステータスコード: {status_code})。"
            
            if "captcha" in page_content or "are you a robot" in page_content or "access denied" in page_content or "アクセスが集中" in page_content:
                 return "ブロックの可能性", "CAPTCHA、アクセス拒否、またはアクセス集中を示すページが表示されました。"

            if status_code >= 400:
                return "失敗", f"クライアントまたはサーバーエラー (ステータスコード: {status_code})。"

            # 商品が見つからない場合の判定は、汎用性がないためここでは行わない
            # 成功とみなし、詳細な在庫有無は後続の処理に委ねる
            return "成功", f"アクセス成功 (ステータスコード: {status_code})。"

        except Exception as e:
            return "実行エラー", f"スクレイピング中に予期せぬ例外が発生しました: {str(e)}"

    @abstractmethod
    def scrape(self, driver, isbn):
        """
        Scrapes the website for the given ISBN using the provided webdriver.
        Returns a dictionary with the scraping result.
        """
        pass

