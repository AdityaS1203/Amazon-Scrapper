const puppeteer=require("puppeteer")

const newurl='https://www.amazon.in/gp/product/B0BRQD9Y92/ref=s9_acss_bw_cg_spotligh_3a1_w?pf_rd_m=A1K21FY43GMZF8&pf_rd_s=merchandised-search-5&pf_rd_r=A05NRHYWRM3PDYTY23JG&pf_rd_t=101&pf_rd_p=69f32f17-18c9-4c6b-8bfd-a4167dbf19c5&pf_rd_i=3474656031&th=1'

async function configureBrowser (url){
        const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);
    //html will store the complete html of the url page
    const html = await page.content();
    await browser.close();
    return html
}

module.exports = configureBrowser;





