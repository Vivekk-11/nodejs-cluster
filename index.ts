import express from "express";
import cluster from "cluster";
import os from "os";

const totalCpus = os.cpus().length;

const port = 3000;

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCpus}`);
  console.log(`Primary ${process.pid} is running...`);

  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker.");
    cluster.fork();
  });
} else {
  const app = express();
  console.log(`Worker ${process.pid} started`);

  app.get("/", (req, res) => {
    res.send("Hello world!");
  });

  app.get("/api/:n", (req, res) => { 
    let n = Number(req.params.n);
    let count = 0;

    if (n > 5000000000) n = 5000000000;

    for (let i = 0; i <= n; i++) {
      count += i;
    }

    res.send(`Final count is ${count} ${process.pid}`);
  });

  app.listen(3000, () => {
    console.log(`App listening on port ${port}`);
  });
}
