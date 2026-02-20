module.exports = {
  apps: [
    {
      name: 'bdsb-backend',
      cwd: '/home/ubuntu/bdsb-backend',
      script: 'src/app.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 자동 재시작
      watch: false,
      max_memory_restart: '300M',
      // 로그
      error_file: '/home/ubuntu/logs/backend-error.log',
      out_file: '/home/ubuntu/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      // 무중단 재시작
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};
