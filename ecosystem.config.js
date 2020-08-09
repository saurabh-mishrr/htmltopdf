module.exports = {
  apps: [
    {
      name: "pdfgen",
      script: "dest/index.js",
      watch: "dest/index.js",
      env: {
        NODE_ENV: ".env",
      },
      ignore_watch: ["node_modules", "Storage"],
      error_file: "/var/log/pm2_err.log",
      out_file: "/var/log/pm2_out.log",
      log: "/var/log/pdfgen.log",
    },
    /* {
      script: "./service-worker/",
      watch: ["./service-worker"],
    }, */
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },

    development: {
      user: "node",
      host: "127.0.0.1",
      ref: "origin/master",
      path: "/home/node/app",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.config.js --env development",
    },
  },
};
