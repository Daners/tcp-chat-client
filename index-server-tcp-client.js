const net = require('net');
const chalk = require("chalk");
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);
const client = new net.Socket();
let port = 7070;
let host = '127.0.0.1';

var myArgs = process.argv.slice(2);
port  = myArgs[1] || port;
host = myArgs[0] || host;

console.log(`${chalk.bgYellow("CONNECTING")} ${host}:${port}`);
client.connect(port, host, function() {
    console.log(`${chalk.bgGreen("CONNECTED")}`);
});

client.on('data', (data) =>{
    const message = data.toString();
    const [user,...msg] = message.split(" ");
    console.log(`${chalk.bgBlue(user)}: ${msg.join(" ")}`);
     rl.prompt(true);
});

client.on('close', () => {
    console.log(`${chalk.bgRed("CLOSED".padEnd(10))}`);
});

client.on('error', (err) => {
    console.log(`${chalk.bgRed("ERROR".padEnd(10))} ${err}`);
    process.exit(1);
});


rl.on('line', function (line) {
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
    }else if(line === "exit"){
        return process.exit(1);
    } else {
        client.write(line);
        rl.prompt(true);
    }
});

client.on('connect', () => {
  rl.prompt(true);
});
