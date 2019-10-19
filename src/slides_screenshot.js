const puppeteer = require("puppeteer");

const slidesScreenshot = async ({
  slidesUrl = "",
  publicPath = "./screenshot"
}) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  if (!slidesUrl) return;

  const page = await browser.newPage();

  await page.goto(slidesUrl);

  await page.evaluate(() => {
    /*
     *  可单独拎出来
     */
    const pills = document.querySelectorAll(".pill");
    Array.from(pills).forEach((pill) => {
      pill.style.display = "none";
    });

    const likeBtn = document.querySelector(".deck-kudos");
    likeBtn.style.visibility = "hidden";

    // opacity为0，给个机会点击事件
    const btnWrapper = document.querySelector(".controls");
    btnWrapper.style.opacity = "0";

    const progressBar = document.querySelector(".progress");
    progressBar.style.opacity = "0";

    // const slideNumber = document.querySelector(".slide-number");
    // slideNumber.style.opacity = "0";
  });

  const slidesDocs = await page.$$("div.slide-background");
  const slidesCount = (slidesDocs || []).length - 1;
  const nextBtn = await page.$(".navigate-down");
  let count = 0;

  // 可以做成递归
  while (count++ < slidesCount) {
    /*
     * TODO:
     *   - 图片加载检测，内容完全可见
     *   - 并发截图
     */
    await page.waitFor(5000);
    const presentDoc = await page.$(".reveal");
    await presentDoc.screenshot({ path: `${publicPath}/${count}.png` });
    await nextBtn.click();
  }

  browser.close();
};

module.exports = slidesScreenshot;
