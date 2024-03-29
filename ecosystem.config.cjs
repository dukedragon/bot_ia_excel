module.exports = {
    apps : [{
      name: "coach_paolo",
      script: "./webhook.mjs",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
   ]
  }
