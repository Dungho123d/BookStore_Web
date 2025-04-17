module.exports = {
  apps: [
    {
      name: "backend-api",
      instances: 2,
      script: "server.js",
      autorestart: true,
      watch: ".",
      watch_delay: 1000,
      ignore_watch: ["node_modules", ".git", "seeds", "*.md"],
    },
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
  },
};
