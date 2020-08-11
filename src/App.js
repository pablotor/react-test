import React, { useState, useEffect } from 'react';
import { useInput } from './hooks/input-hook.js';
import logo from './logo.svg';
import './App.css';

class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.post.id,
      userId: this.props.post.userId,
      title: this.props.post.title,
      body: this.props.post.body,
      contentVisible: false
      };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({contentVisible: !this.state.contentVisible });
  }

  render() {
    if (this.state.contentVisible){
      return (
        <div class="post" key={this.state.id} onClick={this.handleClick}>
          {this.state.title}
          <div class="post__content">
            {this.state.body}
          </div>
        </div>
      );
    } else {
      return (
        <div class="post" key={this.state.id} onClick={this.handleClick}>
          {this.state.title}
        </div>
      );
    }
  }
}

function App() {
  const { value, bind, reset } = useInput('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    alert(`Fetching posts from ${value}`);
    getPosts(value);
    reset();
  }

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  const getPosts = (url) => {
    setIsLoaded(false);
    setError(null);
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  let header = (
      <header class="fb__1_2-header">
        <div class="fb fb__2_5-title header-content">
          <h1 id="header-title">Post Lister </h1>
        </div>
        <div class="fb fb__2_6-api-form header-content" id="submit-api" >

          <form id="form" onSubmit={handleSubmit}>
            <label>
              Enter the URL with the posts in Json format:<br/>
              <input id="form-bar" type="text" {...bind} />
            </label>
            <input id="input-button" type="submit" value="Submit" />
          </form>
        </div>
      </header>
  );

  if (error) {
    return (
      <div>
        {header}
        <div>Error: {error.message}</div>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        {header}
      </div>
    );
  } else {
    return (
      <div>
        {header}

        <div class="fb fb__1_3-main" id="app" >
          {items.map(newPost => (
            <Post post = {newPost}/>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
