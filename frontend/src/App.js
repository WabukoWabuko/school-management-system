import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CoCurricular from './pages/CoCurricular';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/co-curricular" component={CoCurricular} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" render={() => <div className="container py-5"><h2>Login Page (Coming Soon)</h2></div>} />
            <Route path="/dashboard" render={() => <div className="container py-5"><h2>Dashboard (Coming Soon)</h2></div>} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
