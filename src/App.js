import './App.css';
import {Component} from "react";
import Web3 from "web3";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "./config";
import axios from "axios";

class App extends Component {

    componentDidMount() {
        this.loadBlockchainData();
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        this.setState({account: accounts[0]});
        console.log("state", this.state.account);

        //this.setState({account: accounts[0]});

        web3.eth.getBalance(accounts[0], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(web3.utils.fromWei(result, "ether") + " ETH")
            }
        })

        let nftcollection = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        this.setState({nftcollection});
        console.log(nftcollection.methods);
        //yapilmasi gereken kontroller
        //owner of token id ? returns ='> 0x2Ee1CB29722ba8fB8F58F802e63c62c105F0b154
        //

        console.log("tokenUri", await nftcollection.methods.tokenURI(2).call());

        const name = await nftcollection.methods.name().call();
        const tokenByIndex = await nftcollection.methods.tokenByIndex(2).call();
        console.log("tokenByIndex", tokenByIndex);

        const tokenOfOwnerByIndex = await nftcollection.methods.tokenOfOwnerByIndex("0x2Ee1CB29722ba8fB8F58F802e63c62c105F0b154", 1).call();
        console.log("tokenByIndex", tokenOfOwnerByIndex);

        this.setState({name: name});

        const url = await axios.get("ipfs://bafybeichcifstxeeuywx37yvflept7tlruzroqgtxgmxjhkdc55krtmq3u/2.json");
        const image = url.data.image;
        this.setState({image: image});
        console.log(url.data.image);

        console.log(nftcollection);


        // const balance = await furkanToken.methods.balanceOf(this.state.account).call();
        // this.setState({balance: balance});
        // console.log(balance);


        // const registeredVoter = await this.state.simpleDao.methods.registeredVoter(this.state.account).call({gasLimit: 3000000});
        // console.log("name", registeredVoter.name);
        // console.log("isVoted", registeredVoter.isVoted);

        // const daoReason = await simpleDao.methods.DAOReason().call({gasLimit: 3000000});
        // const daoTitle = await simpleDao.methods.DAOTitle().call({gasLimit: 3000000});

        // this.setState({reason: daoReason});
        // this.setState({title: daoTitle});

        // this.setState({voterName: registeredVoter.name});
        // this.setState({isVoted: registeredVoter.isVoted});
        //
        //
        // this.setState({loading: false});


    }

    //using later

    async fetchImage() {
        const url = await axios.get("ipfs://bafybeichcifstxeeuywx37yvflept7tlruzroqgtxgmxjhkdc55krtmq3u/2.json");
        const image = url.data.image;
    }


    constructor(props) {
        super(props);
        this.state = {name: 'NFT'}
        //this.transfer = this.transfer.bind(this);

    }

    render() {
        return (
            <div className="App">
                <h2 className="display-2 text-black"> {this.state.name}</h2>
                <img src={this.state.image} alt={this.state.name}/>;

            </div>


        );

    }
}

export default App;
