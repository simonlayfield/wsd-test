const express = require("express");
const app = express();
const fetch = require("node-fetch");
app.engine("html", require("ejs").renderFile);

const KEY = "coding_test";
const SECRET = "bwZm5XC6HTlr3fcdzRnD";

let TOKEN_DATA = null;
let JOB_DATA = null;

let appData = null;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const tokenData = await authenticate(); // Token returned
  TOKEN_DATA = tokenData;
  const jobData = await fetchJobId(tokenData); // Job id returned
  JOB_DATA = jobData;

  const statusData = await fetchStatusData(tokenData, jobData).then((data) => {
    if (appData) {
      let dataArray = [];

      for (i = 0; i < appData.service_reports.length; i++) {
        if (
          appData.service_reports[i].nodes.length &&
          appData.service_reports[i].status_code == 200
        ) {
          dataArray.push(appData.service_reports[i]);
        }
      }

      res.render(`${__dirname}/index.html`, { dataArray });
    }
  });
});

app.listen("3000", () => {
  console.log("App running on port 3000");
});

const authenticate = async () => {
  const tokenRequest = fetch(
    "https://staging-authentication.wallstreetdocs.com/oauth/token",
    {
      method: "POST",
      body:
        "grant_type=client_credentials&client_id=" +
        KEY +
        "&client_secret=" +
        SECRET,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });

  const tokenJson = await tokenRequest;
  return tokenJson;
};

const fetchJobId = async (json) => {
  // curl --location --request POST 'https://staging-gateway.priipcloud.com/api/v2.0/gateway/reports/status/service' \--header 'Authorization: [TOKEN]' \--header 'Accept: application/json'

  const jobIdRequest = fetch(
    "https://staging-gateway.priipcloud.com/api/v2.0/gateway/reports/status/service",

    {
      method: "POST",
      headers: {
        Authorization: `${json.token_type} ${json.access_token}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });

  const jobIdData = await jobIdRequest;
  return jobIdData;
};

const fetchStatusData = async (tokenData, jobData) => {
  // curl --location --request GET 'https://staging-gateway.priipcloud.com/api/v2.0/gateway/reports/status/service/:job_id' \--header 'Authorization: [TOKEN]' \--header 'Accept: application/json'

  let statusDataRequest = await fetch(
    `https://staging-gateway.priipcloud.com/api/v2.0/gateway/reports/status/service/${jobData.job_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });

  if (statusDataRequest.status === 202) {
    await fetchStatusData(tokenData, jobData);
  } else {
    const newData = await statusDataRequest.json().then((data) => {
      appData = data;
      return data;
    });

    return newData;
  }
};
