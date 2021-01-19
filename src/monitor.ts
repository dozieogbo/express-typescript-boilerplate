import Monitor from "express-status-monitor";
import config from "./config";

const monitor = Monitor({
    path: config.monitor.route,
    title: `${config.app.name}`,
    healthChecks: [{
        protocol: 'http',
        host: 'localhost',
        path: '/v1/health',
        port: config.app.port.toString()
      }, {
        protocol: 'http',
        host: 'localhost',
        path: '/v1/health/database',
        port: config.app.port.toString()
      }]
});

export default monitor