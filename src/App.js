import './App.css';
import {Component} from "react";
import Web3 from "web3";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "./config";
import axios from "axios";


class App extends Component {



    refreshPage() {
        window.location.reload(false);
    }

    componentDidMount() {
        this.loadBlockchainData();
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        this.setState({account: accounts[0]});
        //console.log("state", this.state.account);

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
        //console.log(nftcollection.methods);

        console.log("tokenUri", await nftcollection.methods.tokenURI(2).call());

        const name = await nftcollection.methods.name().call();

        const balanceOf = await nftcollection.methods.balanceOf(this.state.account).call();
        console.log("balanceOf", balanceOf);//3 donuyor yani 3 tane nft var bende bu hesapta

        let nftArrayForAccount = [];
        let tokenURIArray = [];
        for (let i = 0; i < balanceOf; i++) {
            //console.log("i", i);
            //tokenOfOwnerByIndex
            let nft = await nftcollection.methods.tokenOfOwnerByIndex(this.state.account, i).call();

            //console.log("nft", nft);
            console.log("i->", i, "nft->", nft);
            nftArrayForAccount.push(parseInt(nft));
        }

        console.log(nftArrayForAccount);

        for (let x = 0; x < nftArrayForAccount.length; x++) {
            console.log('x =>', x);
            let tokenUri = await nftcollection.methods.tokenURI(nftArrayForAccount[x]).call();
            tokenURIArray.push(tokenUri);
            console.log("tokenUri  =>", tokenUri);
            this.fetchImage(tokenUri)
        }
        console.log(tokenURIArray);


        this.setState({name: name});


    }

    //using later

    async fetchImage(tokenUri) {
        console.log("param tokenUri", tokenUri);
        await axios.get(`${tokenUri}`).then((response) => {
            console.log("fetchImage image", response.data.image);
            this.setState({
                images: [...this.state.images, response.data.image]
            })

        });

    }


    constructor(props) {
        super(props);
        this.state = {
            name: 'NFT',
            images: [],
        }
        this.fetchImage = this.fetchImage.bind(this);
        this.refreshPage = this.refreshPage.bind(this);


    }

    render() {
        for (let i = 0; i < this.state.images.length; i++) {
            console.log("render i", i);


        }

        return (
            <div className="App">
                <h2 className="display-2 text-black"> {this.state.name}</h2>
                {
                    this.state.images.map((image, key) => {
                        return (
                            <div className={"d-flex flex-row"}>
                                <div>
                                    <img src={image} alt={image}/>
                                </div>
                            </div>
                        )
                    })}

            </div>


        );

    }
}

export default App;
