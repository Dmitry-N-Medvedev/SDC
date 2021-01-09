module.exports = {
  apps: [
    {
      name: 'sdc http server',
      script: './index.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        NODE_DEBUG: 'SDC_SERVER',
        UWS_PORT: 9091,
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_DEBUG: 'SDC_SERVER',
        UWS_PORT: 9091,
      },
      watch: false,
    },
  ],
};
