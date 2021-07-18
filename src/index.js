import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getHololiveJPAssets, getHololiveIDAssets, getHolostarAssets } from './constants.js';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

const hololivejp_assets = getHololiveJPAssets();
const hololiveid_assets = getHololiveIDAssets();
const holostar_assets = getHolostarAssets();

const next_page = require('./assets/right_arrow.png'); 
const prev_page = require('./assets/left_arrow.png');
const background_image = require('./assets/background.png');

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hololivejp: hololivejp_assets,
            hololiveid: hololiveid_assets,
            holostar: holostar_assets,
            active_list: 'hololive jp',
            active_page: hololivejp_assets[0].name,
            index: 0,
            page_number: 1,
            last_page: false,
        };
    };

    setActiveList(value, assets) {
        this.setState({
            active_list: value,
            active_page: assets[0].name,
            index: 0,
            page_number: 1,
            last_page: false,
        });
    }

    changeActiveList(value) {
        if (this.state.active_list !== 'hololive jp' && value === 'hololive jp') {
            this.setActiveList(value, this.state.hololivejp);
        }
        else if (this.state.active_list !== 'hololive id' && value === 'hololive id') {
            this.setActiveList(value, this.state.hololiveid);
        }
        else if (this.state.active_list !== 'holostar' && value === 'holostar') {
            this.setActiveList(value, this.state.holostar);
        }
    };

    createList(assets) {
        const begin_index = (this.state.page_number - 1) * 7;
        return (
            <ul id = 'vtuber-list'>
                {assets.map((idol, list_index) => {
                    if (list_index >= begin_index && list_index < (begin_index + 7)) {
                        return (
                            <li className = {this.state.index === list_index ? 'active-page' : 'inactive-page'} key = {list_index} onClick = {() => {
                                this.setState({ 
                                    index: list_index,
                                });
                            }}>
                                <div className = 'vtuber-icon' style = {{backgroundImage: `url(${idol.path})`}}>
                                    <div className = 'vtuber-icon-overlay-gif'>
                                        <div className = 'vtuber-icon-hover-gif'>
                                            {idol.path_gif ? <img className = 'vtuber-gif' src = {idol.path_gif} alt = {idol.name} /> : console.log()}
                                        </div>
                                    </div>
                                    <div className = 'vtuber-icon-overlay-text'>
                                        <div className = 'vtuber-icon-text'>
                                            {idol.name}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    }
                    else {
                        return console.log();
                    }
                })}
            </ul>
        );
    }

    renderList() {
        if (this.state.active_list === 'hololive jp') {
            return (
                this.createList(this.state.hololivejp)
            );
        }
        else if (this.state.active_list === 'hololive id') {
            return (
                this.createList(this.state.hololiveid)
            );
        }
        else {
            return (
                this.createList(this.state.holostar)
            );
        }
    }

    nextPageHelper (value, assets) {
        if (this.state.page_number < Math.ceil(assets.length / 7)) {
            const page_number_copy = this.state.page_number + 1;
            const new_index = this.state.page_number * 7;
            if (page_number_copy === Math.ceil(assets.length / 7)) {
                this.setState({
                    index: new_index,
                    page_number: page_number_copy,
                    last_page: true,
                });
            }
            else {
                this.setState({
                    index: new_index,
                    page_number: page_number_copy,
                    last_page: false,
                });
            }
        }
    }

    createYoutubeLivestreamEmbed (ID) {
        const streamLink = "https://www.youtube.com/embed/live_stream?channel=" + ID;
        return (
            <div className = 'youtube-player'>
                <iframe width="800" height="500" src={streamLink} frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
            </div>
        );
    }

    createTwitterEmbed (name) {
        return (
            <div className = 'twitter-embed-div'>
                <TwitterTimelineEmbed key = {name} sourceType = 'profile' screenName = {name} options = {{width: 300, height: 400}} />
            </div>
        );
    }

    renderPages() {
        if (this.state.active_list === 'hololive jp') {
            return (
                <div className = 'idol-page'>
                    {this.createTwitterEmbed(this.state.hololivejp[this.state.index].twitter)}
                    {this.createYoutubeLivestreamEmbed(this.state.hololivejp[this.state.index].youtube)}
                </div>
            );
        }
        else if (this.state.active_list === 'hololive id') {
            return (
                <div className = 'idol-page'>
                    {this.createTwitterEmbed(this.state.hololiveid[this.state.index].twitter)}
                    {this.createYoutubeLivestreamEmbed(this.state.hololiveid[this.state.index].youtube)}
                </div>
            );
        }
        else {
            return (
                <div className = 'idol-page'>
                    {this.createTwitterEmbed(this.state.holostar[this.state.index].twitter)}
                    {this.createYoutubeLivestreamEmbed(this.state.holostar[this.state.index].youtube)}
                </div>
            );
        }
    }

    render() {
        return (
            <div className = 'scroll-container'>
                <div className = 'navigation-bar'>
                    <div className = 'group-selector'>
                        <label id = {this.state.active_list === 'hololive jp' ? 'hololivejp-group-active' : 'hololivejp-group'}>
                            <input type = 'radio' name = 'option-radio' onClick = {() => {
                                if (this.state.active_list !== 'hololive jp') {
                                    this.changeActiveList('hololive jp');
                                }
                            }} defaultChecked/>
                            <span className = 'input-radio'/>
                            HOLOLIVE JP
                        </label>
                        <label id = {this.state.active_list === 'hololive id' ? 'hololiveid-group-active' : 'hololiveid-group'}>
                            <input type = 'radio' name = 'option-radio' onClick = {() => {
                                if (this.state.active_list !== 'hololive id') {
                                    this.changeActiveList('hololive id');
                                }
                            }} />
                            <span className = 'input-radio'/>
                            HOLOLIVE ID
                        </label>
                        <label id = {this.state.active_list === 'holostar' ? 'holostar-group-active' : 'holostar-group'}>
                            <input type = 'radio' name = 'option-radio' onClick = {() => {
                                if (this.state.active_list !== 'holostar') {
                                    this.changeActiveList('holostar');
                                    
                                }
                            }} />
                            <span className = 'input-radio'/>
                            HOLOSTAR
                        </label>
                    </div>
                    <div className = 'list-wrapper'>
                        <div className = 'prev-page-icon'>
                            <button className = 'prev-page-button' onClick = {() => {
                                    if (this.state.page_number > 1) {
                                        const page_number_copy = this.state.page_number - 1;
                                        const new_index = (page_number_copy - 1) * 7;
                                        this.setState({
                                            index: new_index,
                                            page_number: page_number_copy,
                                            last_page: false,
                                        });
                                    }
                                }} disabled = {this.state.page_number === 1}>
                                    <img id = {this.state.page_number === 1 ? 'prev-page-button-inactive' : 'prev-page-button-active'} src = {prev_page} alt="Previous Page" />
                            </button>
                        </div>
                        <div className = 'list-window'>
                            {this.renderList()}
                        </div>
                        <div className = 'next-page-icon'>
                            <button className = 'next-page-button' onClick = {() => {
                                if (this.state.active_list === 'hololive jp') {
                                    this.nextPageHelper('hololive jp', this.state.hololivejp);
                                }
                                else if (this.state.active_list === 'hololive id') {
                                    this.nextPageHelper('hololive id', this.state.hololiveid);
                                }
                                else {
                                    this.nextPageHelper('holostar', this.state.holostar);
                                }
                            }} disabled = {this.state.last_page || (this.state.active_list === 'hololive id' && this.state.page_number === 1)}>
                                <img id = {this.state.last_page || (this.state.active_list === 'hololive id' && this.state.page_number === 1) ? 'next-page-button-inactive' : 'next-page-button-active'} src = {next_page} alt="Next Page" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className = 'fullpage-container'>
                    <div className = 'fullpage-background' style = {{backgroundImage: `url(${background_image})`}}>
                    </div>
                    <div className = 'page-background'>
                    </div>
                    <div className = 'page-wrapper'>
                        {this.renderPages()}
                    </div>
                </div>
            </div>
        );
    };
};

class Footer extends React.Component {
    render () {
        return (
            <div className = 'footer'>
                <p className = 'footer-text'>Disclaimer: PekoPeko is a fansite. I do not own any of the assets or characters used.</p>
            </div>
        );
    };
};
  
ReactDOM.render(
    <Main />,
    document.getElementById('main')
);

ReactDOM.render(
    <Footer />,
    document.getElementById('footer')
);