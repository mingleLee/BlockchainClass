//这里用bsc 链举例子
//加载web3的库
const { mainModule } = require('process');
//将erc20 取出来
const erc20 = require('./erc20.js');
var moment = require('moment');
const { waitForDebugger } = require('inspector');
const util = require('ethereumjs-util');
const pancake = require('./pancakeAbi/pancakeSwapExactTokensForTokens.js')
const commonUtils = require('./commonUtils.js');

var Web3 = require('web3');
//创建 rpc 连接字符串
var rpcstring = 'https://bsc-dataseed1.binance.org/'
//创建ws连接字符串
var wstring = 'wss://bsc-ws-node.nariox.org:443';

var wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring ));
var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring ));

//设置web3 使用rpcweb3模式
web3 = rpcweb3;
var prikeystring = ""

var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
var lqtwallet = "0xbd2c43da85d007b0b3cd856fd55c299578d832bc"
var bsudAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
var dndAddress = "0x14c358b573a4cE45364a3DBD84BBb4Dae87af034"

var addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e"



prikeystring = prikeystring.replace("0x", "")

function getPriKey(prikeystring) {
    const privKey = new Buffer.from(prikeystring, "hex");
    return privKey;
}

//这里的privKey 是私钥
var priKey = getPriKey(prikeystring);

//获取input内容
function swaptokeninput(wbnbadddress, toaddress, nbnb, ntoken, tokenaddress, tokendecimals = 18,) {

    weiname = commonUtils.getweiname(tokendecimals);
    
    var path = [ lqtwallet,
        wbnbaddress,
        bsudAddress,
        dndAddress];

    var tokenamountIn = web3.utils.toWei(ntoken.toString(10), weiname);
    const now = moment().unix();
    const DEADLINE = now + 60 * 20; //往后延迟20分钟

    var deadline = (DEADLINE).toString(10);
    console.log("inputbefore");
    console.log(pancake[0]);
    var input = web3.eth.abi.encodeFunctionCall(pancake[0], [ tokenamountIn,0, path, toaddress, deadline]);
    console.log(input)
    return input;
}


const swap = async () => {

    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    //要交换的tokenadrress

    var tokenContract = new web3.eth.Contract(erc20, lqtwallet);

    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();

    // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
    var los = 50;
    // 假设要购买5个BNB的tokenA
     var nbnb = 0.00001;

    //获取交易对代币比例
    // let lpTokenBalance = await commonUtils.getTokenBalance(lqtwallet,lqtLPAddress)
    // let lpBnBBalance = await commonUtils.getBNBBalance(wbnbaddress,lqtLPAddress)
    // var rate = lpTokenBalance/lpBnBBalance;
    var ntoken = 0.001;


    //获得input 内容


    //创建交易执行智能合约


    var toAddress = addresspancake
    //获得下一次交易的数
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);

    //交易需要5个BNB
    nbnb = web3.utils.toWei((nbnb).toString(10), 'ether');
    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000

    var input = swaptokeninput(wbnbaddress, fromAddress, 0, ntoken, lqtwallet, decimals)
    let reslut = await commonUtils.signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, nbnb, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }
}









const main = async () => {

    //console.log("infoUtils:",infoUtils)
    //infoUtils.getBNBBalance(wbnbaddress,walletaddress)
    swap()
}

main()