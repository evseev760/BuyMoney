module.exports = {
  apps: [
    {
      name: "buy_money",
      script: "index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
