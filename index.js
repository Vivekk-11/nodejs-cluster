"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const totalCpus = os_1.default.cpus().length;
const port = 3000;
if (cluster_1.default.isPrimary) {
    console.log(`Number of CPUs is ${totalCpus}`);
    console.log(`Primary ${process.pid} is running...`);
    for (let i = 0; i < totalCpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker.");
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    console.log(`Worker ${process.pid} started`);
    app.get("/", (req, res) => {
        res.send("Hello world!");
    });
    app.get("/api/:n", (req, res) => {
        let n = Number(req.params.n);
        let count = 0;
        if (n > 5000000000)
            n = 5000000000;
        for (let i = 0; i <= n; i++) {
            count += i;
        }
        res.send(`Final count is ${count} ${process.pid}`);
    });
    app.listen(3000, () => {
        console.log(`App listening on port ${port}`);
    });
}
