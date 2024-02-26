module.exports = {
  apps: [{
    name: 'app',
    script: 'app.js',
    watch: true,
    ignore_watch: ["node_modules", "data"],
    watch_options: {
      followSymlinks: false
    }
  }]
};