import axios  from "axios";
import fs from "fs"
const URL = `https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=1104480873777230&ext=1662705250&hash=ATuMx352sLrhKUegbQZSC8oLl3J5Vy3Z49lO4HwTUKWRYQ`;
const FROM = `video`;

const config = {
  method: 'get',
  url: "https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=385314690889700&ext=1708370916&hash=ATuOF3H8lVRpnlIdv4ZJ0sP0vzcqFEwLc7P9g62KZiUStg", //PASS THE URL HERE, WHICH YOU RECEIVED WITH THE HELP OF MEDIA ID
  headers: {
    'Authorization': 'Bearer EAAPIPDBYgvIBOZCHEICj9HkTKnra6HDCO5E7GVqirKnWZCiZA4nPVDZAgSSq3e7ZBijyRen9HMMHJf1bUhaLcZCG0m0cuTVvWjq57k4f1RZA8zUfNt4kKawB1U7ETrTqZChZBMXdmzEIay8YRRCOqzdP9dMlZCFikslWkdZCyqMNYV2O4mRVSd6a4ZCHepdcQZBtdNTOnlnT2f8KS79HvvsaqgQZDZD'
  },
  responseType: 'arraybuffer'
};
axios(config)
  .then(function (response) {
    const ext = response.headers['content-type'].split("/")[1];
    fs.writeFileSync(`${FROM}.${ext}`, response.data);
  })
  .catch(function (error) {
    console.log(error);
  });