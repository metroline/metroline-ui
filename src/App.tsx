import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RepoList } from './components/repos/RepoList';
import { NotFound } from './commons/components/NotFound';
import { RepoView } from './components/repos/RepoView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col mt-4 mb-5">
            <Switch>
              <Route path={['/', '/repos']} exact component={RepoList} />
              <Route path="/repos/:repoId" component={RepoView} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
