try:
    from BeautifulSoup import BeautifulSoup
except ImportError:
    from bs4 import BeautifulSoup
import time


r = open("EigeneVokabeln.html", "r", encoding='utf8')

soup = BeautifulSoup(r)


class Vokabel:
    def __init__(self, englisch):
        self.englisch = englisch


vokabeln = []

trs = soup.find_all("tr")

for tr in trs:

    tds = tr.find_all("td")

    vokabel = []
    for td in tds:
        td_class_content = ""
        try:
            td_class_content = td["class"]
        except:
            td_class_content = ""

        if 'item_content' in td_class_content:
            divs = td.find_all("div")[0].find_all("div")
            vokabel.append(divs[0].text)
        if 'phase_col' in td_class_content:
            spans = td.find_all("span")
            for span in spans:
                try:
                    if "p6phase" in span["class"]:
                        vokabel.append(span.text)
                except:
                    vokabel.append("7")
    print(vokabel)
    time.sleep(0.02)

r.close()
