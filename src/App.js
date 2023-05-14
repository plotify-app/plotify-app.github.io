import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./helpers/config.js"
import hash from "./helpers/hash.js";
import {DisplayGraph} from "./components/DisplayGraph";
import "./App.css";
import pIcon from "./images/plotifyIcon.png" 
import pTitle from "./images/plotifyLogo.png"

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      items: null,
      no_data: false,
      valence: {}, 
      popularity: {},
      songDictionary: {}, 
    };
    this.getTopSongs = this.getTopSongs.bind(this)    
    this.getAudioFeatures = this.getAudioFeatures.bind(this)
    this.getPopularity = this.getPopularity.bind(this)
    this.getSongInfo = this.getSongInfo.bind(this)
  }

  componentDidMount() {      
    document.body.style.zoom = "100%";
    setInterval(this.decrTime, 1000);
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      // this.getCurrentlyPlaying(_token);
      this.getTopSongs(_token);
    }
  }

  getTopSongs(token) {
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        if(!data) {
          window.alert("NOOOOO we couldn't get your top songs :((");
          return;
        }
        this.setState({
          items: data.items,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
        this.getAudioFeatures(token)
        this.getPopularity(token)
        this.getSongInfo(token)
      }
    });
  }

  getSongInfo(token) {
    for (var i = 0; i < this.state.items.length; i++) {
      const id = this.state.items[i].id
      this.setState({
        genreList: []
      })
      const track = this.state.items[i].name; 
      const artists = this.state.items[i].artists;
      const src = this.state.items[i].album.images[0].url
      for (var j = 0; j < artists.length; j++) {
        const artistID = artists[j].id
        $.ajax({
          url: "https://api.spotify.com/v1/artists/" + artistID,
          type: "GET",
          beforeSend: xhr => {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: data => {
            // Checks if the data is not empty
            if(!data) {
              window.alert("NOOOOO we couldn't get your top songs :((");
              return;
            }
            const dictionary = this.state.songDictionary;
            if (id in dictionary) {
              dictionary[id] = {
                track: track, 
                artists: artists, 
                genres: (dictionary[id].genres).concat(data.genres),
                src: src, 
              }
            } else {
              dictionary[id] = {
                track: track, 
                artists: artists, 
                genres: data.genres, 
                src: src, 
              }
            }
            this.setState({
              songDictionary: dictionary, 
            })
          }
        });
      }
    }
  }

  getAudioFeatures(token) {
    for (var i = 0; i < this.state.items.length; i++) {
      const id = this.state.items[i].id
      $.ajax({
        url: "https://api.spotify.com/v1/audio-features?ids=" + id,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: data => {
          // Checks if the data is not empty
          if(!data) {
            window.alert("NOOOOO we couldn't get your top songs :((")
            return;
          }
          const dictionary = this.state.valence;
          dictionary[id] = [100 - data.audio_features[0].valence * 100];  
          this.setState({
            valence: dictionary, 
          })
        }
      });
    }
  }

  getPopularity(token) {
    for (var i = 0; i < this.state.items.length; i++) {
      const id = this.state.items[i].id
      $.ajax({
        url: "https://api.spotify.com/v1/tracks/" + id,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: data => {
          // Checks if the data is not empty
          if(!data) {
            window.alert("NOOOOO we couldn't get your top songs :((")
            return;
          }
          const dictionary = this.state.popularity;
          dictionary[id] = [data.popularity];  
          this.setState({
            popularity: dictionary, 
          })
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="intro">
            {!this.state.token && (
              <div className="main"> 
                <div className="plotify"> 
                  <img className="logo" src={pIcon} alt="logo"/> 
                  <img className="logoName" src={pTitle} alt="logo"/> 
                </div> 
                <h1 className="divider"> </h1>
                <a
                  className="btn btn--loginApp-link"
                  href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                  )}&response_type=token&show_dialog=true`}
                >
                  Log in with Spotify
                </a>
                <p className="hi"> made with &#60;3 by Kaily Liu and Joyce He </p>
                <p className="hi"> note: this app is not published - please email one of us to join the user list :) </p>
              </div> 
            )}
          </div> 
          {this.state.token && !this.state.no_data && (
            <div> 
              <DisplayGraph items={this.state.items} 
                          popularity={this.state.popularity} 
                          valence={this.state.valence} 
                          songDictionary={this.state.songDictionary}/> 
            </div>
          )}
          {this.state.no_data && (
            <p>
              NOOO it doesn't seem like we were able to retrieve your data :(
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default App;
