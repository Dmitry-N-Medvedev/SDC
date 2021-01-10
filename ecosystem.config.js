module.exports = {
  apps: [
    {
      name: 'sdc http server',
      script: './sources/servers/api/index.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      // increment_var: 'UWS_PORT',
      env: {
        NODE_ENV: 'development',
        NODE_DEBUG: 'SDC_SERVER,LIB_SERVER,FN_HANDLE_DIRECTION',
        UWS_PORT: 9090,
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_DEBUG: 'SDC_SERVER,LIB_SERVER,FN_HANDLE_DIRECTION',
        UWS_PORT: 9090,
      },
      watch: false,
    },
  ],
};
